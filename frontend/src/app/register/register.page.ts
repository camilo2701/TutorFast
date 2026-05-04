import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { IonicModule } from '@ionic/angular';

import {
  personOutline,
  homeOutline,
  personCircleOutline,
  logInOutline,
  logOutOutline,
  gridOutline
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
    IonicModule
  ]
})
export class RegisterPage implements OnInit{
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
  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      'person-outline': personOutline,
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'grid-outline': gridOutline
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

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    // Tipos permitidos
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes PNG, JPG o JPEG');
      return;
    }

    // Validar tamaño (2MB)
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      alert('La imagen debe ser menor a 2MB');
      return;
    }

    this.selectedFile = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
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

  createAccount() {
    if (!this.user.acceptTerms) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    const formData = new FormData();

    formData.append('nombre_real', `${this.user.name} ${this.user.lastname}`);
    formData.append('nombre_de_usuario', this.user.email.split('@')[0]);
    formData.append('correo_electronico', this.user.email);
    formData.append('contrasena', this.user.password);
    formData.append('rol', this.user.role === 'student' ? '0' : '1');
    formData.append('rut', this.user.rut.replace(/\./g, ''));

    if (this.selectedFile) {
      formData.append('pfp', this.selectedFile);
    }

    this.authService.register(formData).subscribe({
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