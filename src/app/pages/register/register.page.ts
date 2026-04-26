import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel
} from '@ionic/angular/standalone';

import {
  personOutline,
  logoGoogle,
  logoApple
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonInput,
    IonLabel,
    IonButton,
    IonCheckbox
  ]
})
export class RegisterPage {
  user: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    role: 'student' | 'tutor';
    acceptTerms: boolean;
  } = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: 'student',
    acceptTerms: false
  };

  constructor() {
    addIcons({
      personOutline,
      logoGoogle,
      logoApple
    });
  }

  selectRole(role: 'student' | 'tutor') {
    this.user.role = role;
  }

  createAccount() {
    if (!this.user.acceptTerms) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    console.log('Usuario registrado:', this.user);
  }
}