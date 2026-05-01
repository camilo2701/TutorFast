import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

import { UserProfileService } from '../services/user-profile.service';

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

  user: any = {};
  reviews: any[] = [];
  tutorReviews: any[] = [];
  tutorSessions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService
  ) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.userProfileService.getUserProfile(id).subscribe({
        next: (data) => {
          this.user = data.user;
          this.reviews = data.reviews || [];
          this.tutorSessions = data.tutorSessions || [];
          this.tutorReviews = data.tutorReviews || [];
        },
        error: (err) => {
          console.error('Error cargando perfil:', err);
        }
      });
    }
  }

  loadUserProfile(id: number) {
    this.userProfileService.getUserProfile(id).subscribe({
      next: (data) => {
        this.user = data.user;
        this.reviews = data.reviews || [];
        this.tutorSessions = data.tutorSessions || [];
        this.tutorReviews = data.tutorReviews || [];
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
      }
    });
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
    return this.user.image
      ? this.user.image
      : 'assets/icon/userpfp.jpg';
  }
}