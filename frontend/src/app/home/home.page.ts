import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';
import { logInOutline, logOutOutline, personOutline,
  gridOutline, cardOutline, businessOutline } from 'ionicons/icons';
import { TutoringAdService } from '../services/tutoring-ad.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ]
})
export class HomePage implements OnInit {

  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  tutors: any[] = [];
  tutorias: any[] = [];

  first: any = null;
  second: any = null;
  third: any = null;

  searchQuery: string = '';

  constructor(private router: Router, private tutoringAdService: TutoringAdService) {
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
    this.loadHomeData();
  }

  loadHomeData() {
    this.tutoringAdService.getTutorias().subscribe({
      next: (data) => {
        this.tutorias = data;
      },
      error: (error) => {
        console.error('Error cargando tutorías:', error);
      }
    });

    this.tutoringAdService.getFeaturedTutors().subscribe({
      next: (data) => {
        this.tutors = data;
        this.first = data[0] || null;
        this.second = data[1] || null;
        this.third = data[2] || null;
      },
      error: (error) => {
        console.error('Error cargando tutores destacados:', error);
      }
    });
  }

  checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    this.isLoggedIn = !!token && !!user;
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

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
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

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 100);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;

    this.closePopover();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  // =========================
  searchTutorias() {
    const query = this.searchQuery.trim();

    if (!query) return;

    this.router.navigate(['/search-results'], {
      queryParams: { q: query }
    });
  }

  goToTutoringAd(id: number) {
    this.router.navigate(['/tutoring-ad', id]);
  }

  // =========================
  get hasTutors(): boolean {
    return this.tutorias && this.tutorias.length > 0;
  }
  
  goToTutorProfile(id: number) {
    this.router.navigate(['/user-profile', id]);
  }
}