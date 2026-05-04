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

import { ActivatedRoute } from '@angular/router';
import { TutoringAdService } from '../services/tutoring-ad.service';

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

  constructor(private route: ActivatedRoute, private router: Router, private tutoringAdService: TutoringAdService) { 
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

  ad: any = {};
  tutor: Tutor = {} as Tutor;
  reviews: Review[] = [];
  stars: string[] = [];
  averageRating: string = '0.0';

  isBookingOpen = false;
  selectedDate: string = '';
  paymentMethod: string = 'credit';
  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  ngOnInit() {
    this.checkSession();
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.loadTutoringAd(id);
    }
  }

  checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    this.isLoggedIn = !!token && !!user;
  }

  loadTutoringAd(id: number) {
    this.tutoringAdService.getTutoringAd(id).subscribe({
      next: (data) => {
        this.ad = data;
        this.reviews = data.reviews || [];

        const rating = Number(data.rating || 0);

        this.averageRating = rating.toFixed(1);
        this.stars = this.getStarsArray(rating);
      },
      error: (error) => {
        console.error('Error cargando anuncio:', error);
      }
    });
  }

  getTeacherImage(): string {
    return this.ad?.tutor?.image
      ? this.ad.tutor.image
      : 'assets/icon/userpfp.jpg';
  }

  getStarsArray(rating: number): string[] {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('star');
      else if (rating >= i - 0.5) stars.push('star-half');
      else stars.push('star-outline');
    }

    return stars;
  }

  confirmTutoria() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      alert('Debes iniciar sesión para contratar una tutoría.');
      return;
    }

    if (!this.selectedDate || !this.paymentMethod) {
      alert('Debes seleccionar fecha y método de pago.');
      return;
    }

    const payload = {
      id_anuncio: this.ad.id,
      metodo_pago: this.paymentMethod,
      pago_total: this.ad.price,
      fecha: this.selectedDate
    };

    this.tutoringAdService.confirmTutoria(payload).subscribe({
      next: () => {
        alert('Tutoría confirmada correctamente.');
      },
      error: (error) => {
        alert(error.error?.error || 'Error al confirmar tutoría.');
      }
    });
  }

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

  openBooking() {
    this.isBookingOpen = true;
  }

  closeBooking() {
    this.isBookingOpen = false;
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

}