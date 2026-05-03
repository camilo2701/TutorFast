import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonInput,
  IonLabel
} from '@ionic/angular/standalone';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  lockClosedOutline
} from 'ionicons/icons';

import { logInOutline, logOutOutline, personOutline,
  gridOutline, cardOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonicModule
  ]
})
export class LoginPage implements OnInit{

  loginData: {
    email: string;
    password: string;
  } = {
    email: '',
    password: ''
  };

  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
      'card-outline': cardOutline,
      'business-outline': businessOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'grid-outline': gridOutline,
      'lock-closed-outline': lockClosedOutline
    });
  }

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

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Debes ingresar correo y contraseña.');
      return;
    }

    const data = {
      correo_electronico: this.loginData.email,
      contrasena: this.loginData.password
    };

    this.authService.login(data).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.router.navigate(['/user-profile', response.user.id_usuario]);
      },
      error: (error) => {
        alert(error.error?.error || 'Error al iniciar sesión');
      }
    });
  }
}