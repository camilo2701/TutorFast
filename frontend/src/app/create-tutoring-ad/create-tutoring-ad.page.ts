import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';
import { logInOutline, logOutOutline, personOutline,
  gridOutline, cardOutline, businessOutline } from 'ionicons/icons';
import { TutoringAdService } from '../services/tutoring-ad.service';

@Component({
  selector: 'app-create-tutoring-ad',
  templateUrl: './create-tutoring-ad.page.html',
  styleUrls: ['./create-tutoring-ad.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class CreateTutoringAdPage implements OnInit {

  form: any = {
    price: null,
    title: '',
    subject: '',
    description: '',
    boost: false
  };

  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  constructor(private alertController: AlertController, private router: Router, private tutoringAdService: TutoringAdService) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
      'card-outline': cardOutline,
      'business-outline': businessOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
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

  getLoggedUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // VALIDACIÓN BÁSICA
  isFormValid(): boolean {
    const price = Number(this.form.price);

    return (
      !isNaN(price) &&           // es número
      price > 0 &&               // mayor a 0
      this.form.title.trim() &&
      this.form.subject.trim() &&
      this.form.description.trim()
    );
  }

  goHome(){
    console.log('Navegar a Home');
    this.router.navigateByUrl('/home')
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

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.showAlert('Debes iniciar sesión para publicar un anuncio.');
      this.router.navigate(['/login']);
      return;
    }

    if (loggedUser.rol !== 1) {
      this.showAlert('Solo los tutores pueden publicar anuncios.');
      return;
    }

    if (this.form.boost && loggedUser.suscripcion !== true) {
      this.showAlert('Necesitas una suscripción activa para potenciar anuncios.');
      this.form.boost = false;
      return;
    }

    if (!this.isFormValid()) {
      this.showAlert('Campos incompletos o precio inválido. Por favor, revisa el formulario.');
      return;
    }

    const payload = {
      precio_por_hora: Number(this.form.price),
      titulo: this.form.title,
      asignatura: this.form.subject,
      descripcion: this.form.description,
      boosted: this.form.boost
    };

    this.tutoringAdService.createAd(payload).subscribe({
      next: () => {
        this.showAlert('Publicación creada exitosamente.');

        this.form = {
          price: null,
          title: '',
          subject: '',
          description: '',
          boost: false
        };

        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.showAlert(error.error?.error || 'Error al crear el anuncio.');
      }
    });
  }

  // CANCELAR
  onCancel() {
    this.form = {
      price: null,
      title: '',
      subject: '',
      description: '',
      boost: false
    };
  }

  canBoost(): boolean {
    const user = this.getLoggedUser();
    return user?.suscripcion === true;
  }

}