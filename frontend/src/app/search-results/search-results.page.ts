import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { TutoringAdService } from '../services/tutoring-ad.service';

import {
  homeOutline,
  personCircleOutline,
  logInOutline,
  logOutOutline,
  personOutline,
  gridOutline,
  cardOutline,
  businessOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class SearchResultsPage implements OnInit {

  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  searchQuery: string = '';

  tutores: any[] = [];
  filteredTutores: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tutoringAdService: TutoringAdService
  ) {

    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
      'card-outline': cardOutline,
      'business-outline': businessOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'grid-outline': gridOutline
    });
  }

  ngOnInit() {
    this.checkSession();

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.loadTutorias();
    });
  }
  
  loadTutorias() {
    this.tutoringAdService.getTutorias().subscribe({
      next: (data) => {
        this.tutores = data || [];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error cargando resultados:', error);
        this.tutores = [];
        this.filteredTutores = [];
      }
    });
  }
  
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // separa letras y acentos
      .replace(/[\u0300-\u036f]/g, ''); // elimina acentos
  }
  // =========================
  // 🔍 FILTRO PRINCIPAL
  // =========================
  applyFilters() {

    let results = [...this.tutores];

    if (this.searchQuery.trim()) {

      const query = this.normalizeText(this.searchQuery);

      results = results.filter(t => {
        return (
          this.normalizeText(t.name).includes(query)
        );
      });
    }

    results.sort((a, b) => {
      if (a.premium === b.premium) return 0;
      return a.premium ? -1 : 1;
    });

    this.filteredTutores = results;
  }

  checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    this.isLoggedIn = !!token && !!user;
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goTutoria(id: number) {
    this.router.navigate(['/tutoring-ad', id]);
  }

  openPopover(event: Event) {
    this.checkSession();
    this.popoverEvent = event;
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
    this.popoverEvent = null;
  }

  goToLogin() {
    this.closePopover();
    setTimeout(() => this.router.navigate(['/login']), 100);
  }

  goToProfile() {
    const user = localStorage.getItem('user');

    this.closePopover();

    setTimeout(() => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      const parsedUser = JSON.parse(user);
      this.router.navigate(['/user-profile', parsedUser.id_usuario]);
    }, 100);
  }

  goToDashboard() {
    this.closePopover();
    setTimeout(() => this.router.navigate(['/dashboard']), 100);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;

    this.closePopover();
    setTimeout(() => this.router.navigate(['/login']), 100);
  }
}