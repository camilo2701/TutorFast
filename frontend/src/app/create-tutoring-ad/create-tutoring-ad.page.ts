import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';

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
    career: '',
    subject: '',
    description: '',
    boost: false,
    image: null
  };

  constructor(private alertController: AlertController, private router: Router) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {}

  // IMAGEN
  openFileSelector(fileInput: HTMLInputElement) {
    fileInput.click();
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.form.image = file;
      console.log('Imagen seleccionada:', file);
    }
  }

  // VALIDACIÓN BÁSICA
  isFormValid(): boolean {
    const price = Number(this.form.price);

    return (
      !isNaN(price) &&           // es número
      price > 0 &&               // mayor a 0
      this.form.career.trim() &&
      this.form.subject.trim() &&
      this.form.description.trim()
    );
  }

  goHome(){
    console.log('Navegar a Home');
    this.router.navigateByUrl('/home')
  }
  goProfile(){
    console.log('Navegar a Profile');
    //this.router.navigateByUrl('/home')
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
    if (!this.isFormValid()) {
      this.showAlert('Campos incompletos o precio inválido. Por favor, revisa el formulario.');
      return;
    }

    const payload = {
      price: Number(this.form.price),
      career: this.form.career,
      subject: this.form.subject,
      description: this.form.description,
      boost: this.form.boost
    };

    // 🔥 FUTURO BACKEND
    /*
    this.http.post('API_URL', payload).subscribe(...)
    */

    // Si hay imagen → usar FormData
    if (this.form.image) {
      const formData = new FormData();

      formData.append('data', JSON.stringify(payload));
      formData.append('image', this.form.image);

      this.showAlert('Publicación creada exitosamente.');
    }
  }

  // CANCELAR
  onCancel() {
    this.form = {
      price: null,
      career: '',
      subject: '',
      description: '',
      boost: false,
      image: null
    };
  }
}