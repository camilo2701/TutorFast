import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

import { logInOutline, logOutOutline, personOutline,
  gridOutline, cardOutline, businessOutline } from 'ionicons/icons';

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

  constructor(private router: Router) { 
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

  searchQuery: string = '';

  tutores: any[] = [
    { nombre: 'Tutoría matemática', precio: 25000, calificacion: 4.5, descripcion: 'matemática aplicada', premium: 1, modalidad: 'Presencial' },
{ nombre: 'Tutoría de inglés', precio: 30000, calificacion: 4.8, descripcion: 'speak english every day', premium: 0, modalidad: 'Online' },
{ nombre: 'Tutoría de ciencias', precio: 20000, calificacion: 4.2, descripcion: 'conoce el mundo de las ciencias', premium: 0, modalidad: 'Presencial y Online' },
{ nombre: 'Tutoría de química', precio: 20008, calificacion: 4.7, descripcion: 'conoce el mundo de las químicas', premium: 1, modalidad: 'Online' },
{ nombre: 'Tutoría de física', precio: 22000, calificacion: 4.3, descripcion: 'aprende las reglas de la física', premium: 0, modalidad: 'Presencial' },
{ nombre: 'Tutoría de inglés', precio: 35000, calificacion: 4.9, descripcion: 'progama lo que quieras en Java', premium: 1, modalidad: 'Presencial y Online' },
{ nombre: 'Tutoría matemática', precio: 25000, calificacion: 4.5, descripcion: 'matemática aplicada', premium: 1, modalidad: 'Presencial' },
{ nombre: 'Tutoría de inglés', precio: 30000, calificacion: 4.8, descripcion: 'speak english every day', premium: 0, modalidad: 'Online' },
{ nombre: 'Tutoría de ciencias', precio: 20000, calificacion: 4.2, descripcion: 'conoce el mundo de las ciencias', premium: 0, modalidad: 'Presencial y Online' },
{ nombre: 'Tutoría de química', precio: 20008, calificacion: 4.7, descripcion: 'conoce el mundo de las químicas', premium: 1, modalidad: 'Online' },
{ nombre: 'Tutoría de física', precio: 22000, calificacion: 4.3, descripcion: 'aprende las reglas de la física', premium: 0, modalidad: 'Presencial' },
{ nombre: 'Tutoría de inglés', precio: 35000, calificacion: 4.9, descripcion: 'progama lo que quieras en Java', premium: 1, modalidad: 'Presencial y Online' },

  ]

  filteredTutores: any[] = [];

  ngOnInit() {
    this.checkSession();

    this.filteredTutores = [...this.tutores].sort((a, b) => {
      if (a.premium === b.premium) return 0;
      return a.premium ? -1 : 1;
    });
  }

  checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    this.isLoggedIn = !!token && !!user;
  }

  goHome(){
    this.router.navigate(['/home']);
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

  goTutoria(){
    this.router.navigate(['/tutoria']);
  }
}
