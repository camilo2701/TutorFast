import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  personCircleOutline, 
  cardOutline, 
  businessOutline,
  logInOutline, 
  logOutOutline, 
  personOutline, 
  gridOutline,
  star, 
  starHalf, 
  starOutline 
} from 'ionicons/icons';

interface Tutor {
  title: string;
  name: string;
  lastname: string;
  profession: string;
  subjects: string[];
  price: number;
  description: string;
  image: string | null;
}

interface Review {
  student: string;
  rating: number; // 1 a 5 entero
  comment: string;
  date: string;
}

@Component({
  selector: 'app-tutoring-ad',
  templateUrl: './tutoring-ad.page.html',
  styleUrls: ['./tutoring-ad.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})

export class TutoringAdPage implements OnInit {

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
      'grid-outline': gridOutline,
      'star': star,
      'star-half': starHalf,
      'star-outline': starOutline
    });
  }

  tutor: Tutor = {} as Tutor;
  reviews: Review[] = [];
  stars: string[] = [];
  averageRating: string = '0.0';

  isBookingOpen = false;
  selectedDate: string = '';
  paymentMethod: string = 'credit';

  ngOnInit() {
    this.checkSession();
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

  loadTutor() {
    this.tutor = {
      title: 'Clases de Matemáticas Personalizadas', 
      name: 'Nombre',
      lastname: 'Apellido',
      profession: 'Tutor',
      subjects: ['Álgebra', 'Cálculo'],
      price: 15000,
      description: 'Aprende matemáticas de forma clara y práctica.',
      image: null
    };

    this.reviews = [
      { student: 'Alumno 1', rating: 5, comment: 'Muy buen profe', date: 'hace 2 días' },
      { student: 'Alumno 2', rating: 2, comment: 'Explica como el pico', date: 'hace 1 semana' }
    ];
  }

  /* 🔥 PROMEDIO + REDONDEO A 0.5 */
  calculateAverageStars() {
    if (this.reviews.length === 0) {
      this.stars = Array(5).fill('star-outline');
      this.averageRating = '0.0';
      return;
    }

    const avg = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;

    // 🔹 Guardamos valor con 1 decimal (visual)
    this.averageRating = avg.toFixed(1);

    // 🔹 Redondeo a 0.5 para estrellas
    const rounded = Math.round(avg * 2) / 2;

    this.stars = this.generateStars(rounded);
  }
  /* 🔥 GENERADOR CORRECTO */
  generateStars(rating: number): string[] {
    const stars: string[] = [];

    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalf) {
      stars.push('star-half');
    }

    while (stars.length < 5) {
      stars.push('star-outline');
    }

    return stars;
  }

  /* ⭐ ESTRELLAS PARA REVIEW (ENTERO 1–5, SIN HALF) */
  getReviewStars(rating: number): string[] {
    const stars: string[] = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('star');
      } else {
        stars.push('star-outline');
      }
    }

    return stars;
  }

  getTeacherImage(): string {
    return this.tutor.image 
      ? this.tutor.image 
      : 'assets/placeholder-user.png';
  }

  openBooking() {
    this.isBookingOpen = true;
  }

  closeBooking() {
    this.isBookingOpen = false;
  }

  pay() {
    console.log('Tutoría:', this.tutor.title);
    console.log('Fecha:', this.selectedDate);
    console.log('Método:', this.paymentMethod);
    this.closeBooking();
  }
}