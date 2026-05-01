import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class UserProfilePage implements OnInit {

  constructor() {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  user: any = {};
  reviews: any[] = [];
  tutorReviews: any[] = [];
  tutorSessions: any[] = [];

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    // 🔹 Cambia role: 'student' | 'tutor'
    this.user = {
      name: 'Nombre',
      lastname: 'Apellido',
      role: 'tutor', // 👈 cambia a 'tutor' para probar
      image: null
    };

    // 🔹 Reviews (estudiante)
    this.reviews = [
      {
        tutor: 'Tutor ejemplo 1',
        subject: 'Asignatura tutor 1',
        comment: 'Ejemplo de review del estudiante',
        rating: 5
      },
      {
        tutor: 'Tutor ejemplo 2',
        subject: 'Asignatura tutor 2',
        comment: 'Ejemplo de review del estudiante',
        rating: 3
      },
      {
        tutor: 'Tutor ejemplo 3',
        subject: 'Asignatura tutor 3',
        comment: 'Ejemplo de review del estudiante',
        rating: 5
      },
      {
        tutor: 'Tutor ejemplo 4',
        subject: 'Asignatura tutor 4',
        comment: 'Ejemplo de review del estudiante',
        rating: 5
      },
      {
        tutor: 'Tutor ejemplo 5',
        subject: 'Asignatura tutor 5',
        comment: 'Ejemplo de review del estudiante',
        rating: 5
      }
    ];

    // 🔹 Tutor data
    this.tutorSessions = [
      { title: 'Tutoría 1' },
      { title: 'Tutoría 2' },
      { title: 'Tutoría 3' },
      { title: 'Tutoría 4' },
      { title: 'Tutoría 5' },
      { title: 'Tutoría 6' },
      { title: 'Tutoría 7' }
    ];
    this.tutorReviews = [...this.reviews]; // mock
  }

  getStarsArray(rating: number): string[] {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('star');
      else stars.push('star-outline');
    }

    return stars;
  }

  getUserImage(): string {
    return 'assets/icon/userpfp.jpg';
  }
}