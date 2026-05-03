import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

import { logInOutline, logOutOutline, personOutline,
  gridOutline, cardOutline, businessOutline } from 'ionicons/icons';

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

  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,'card-outline': cardOutline,
      'business-outline': businessOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'grid-outline': gridOutline
    });
  }

  ngOnInit() {
    this.checkSession();

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