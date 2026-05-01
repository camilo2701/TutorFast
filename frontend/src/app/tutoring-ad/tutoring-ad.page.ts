import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

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

  constructor() { 
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  tutor: any = {};
  reviews: any[] = [];
  stars: string[] = [];

  ngOnInit() {
    this.loadTutor();
    this.calculateAverageStars();
  }
    // 🔹 Mock data (replace with API later)
  loadTutor() {
    this.tutor = {
      name: 'Nombre',
      lastname: 'Apellido',
      profession: 'Profesor de Matemáticas',
      subjects: ['Álgebra', 'Cálculo'],
      price: 15000,
      description: 'Ejemplo de descripción de un tutor',
      image: null // try with URL later
    };

    this.reviews = [
      { student: 'Alumno 1', rating: 5, comment: 'Muy buen profe', date: 'hace 2 días' },
      { student: 'Alumno 2', rating: 4, comment: 'Explica bien', date: 'hace 1 semana' }
    ];
  }

  // 🔹 1. Average rating → stars
  calculateAverageStars() {
    if (this.reviews.length === 0) {
      this.stars = Array(5).fill('star-outline');
      return;
    }

    const avg = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;

    this.stars = this.getStarsArray(avg);
  }

  // 🔹 Star generator (reusable)
  getStarsArray(rating: number): string[] {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('star'); // full
      } else if (rating >= i - 0.5) {
        stars.push('star-half'); // half (optional)
      } else {
        stars.push('star-outline'); // empty
      }
    }

    return stars;
  }

  // 🔹 2. Image with fallback
  getTeacherImage(): string {
    return this.tutor.image 
      ? this.tutor.image 
      : 'assets/placeholder-user.png'; // put a placeholder image here
  }

}
