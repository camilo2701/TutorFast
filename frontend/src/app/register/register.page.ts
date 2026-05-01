import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonToolbar,
  IonFooter,
  IonIcon,
  IonInput,
  IonLabel,
  IonTitle
} from '@ionic/angular/standalone';

import {
  personOutline,
  logoGoogle,
  logoApple,
  homeOutline,
  personCircleOutline
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
    IonHeader,
    IonToolbar,
    IonFooter,
    IonIcon,
    IonInput,
    IonLabel,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonTitle
  ]
})
export class RegisterPage {
  user: {
    rut: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    role: 'student' | 'tutor';
    acceptTerms: boolean;
  } = {
    rut: '',
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: 'student',
    acceptTerms: false
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      logoGoogle,
      logoApple,
      homeOutline,
      personCircleOutline
    });
  }

  onRutChange(value: string) {
    if (!value) {
      this.user.rut = '';
      return;
    }

    let cleanRut = value.replace(/[^0-9kK]/g, '').toUpperCase();

    if (cleanRut.length === 0) {
      this.user.rut = '';
      return;
    }

    if (cleanRut.length === 1) {
      this.user.rut = cleanRut;
      return;
    }

    let body = cleanRut.slice(0, -1);
    let dv = cleanRut.slice(-1);

    let formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.user.rut = `${formattedBody}-${dv}`;
  }

  selectRole(role: 'student' | 'tutor') {
    this.user.role = role;
  }

  goHome() {
    console.log('Ir a home');
  }

  goProfile() {
    console.log('Ir a perfil');
  }

  createAccount() {
  if (!this.user.acceptTerms) {
    alert('Debes aceptar los términos y condiciones.');
    return;
  }

  const userData = {
      nombre_real: `${this.user.name} ${this.user.lastname}`,
      nombre_de_usuario: this.user.email.split('@')[0],
      correo_electronico: this.user.email,
      contrasena: this.user.password,
      rol: this.user.role === 'student' ? 0 : 1,
      rut: this.user.rut.replace(/\./g, '')
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        alert('Cuenta creada correctamente');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        alert(error.error?.error || 'Error al crear la cuenta');
      }
    });
  }
}