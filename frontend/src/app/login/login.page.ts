import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  IonLabel,
  IonCheckbox
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  lockClosedOutline,
  logoGoogle,
  logoApple
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonFooter,
    IonInput,
    IonLabel,
    IonCheckbox
  ]
})
export class LoginPage {

  loginData: {
    email: string;
    password: string;
    role: 'student' | 'tutor';
    rememberMe: boolean;
  } = {
    email: '',
    password: '',
    role: 'student',
    rememberMe: false
  };

  constructor() {
    addIcons({
      homeOutline,
      personCircleOutline,
      lockClosedOutline,
      logoGoogle,
      logoApple
    });
  }

  selectRole(role: 'student' | 'tutor') {
    this.loginData.role = role;
  }

  goProfile() {
    console.log('Ir al perfil');
  }

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Debes ingresar correo y contraseña.');
      return;
    }

    console.log('Inicio de sesión:', this.loginData);
  }
}