import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class HomePage implements OnInit {

  tutors: any[] = [];

  constructor(private router: Router) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {}

  get hasTutors() {
    return this.tutors && this.tutors.length > 0;
  }

  goToProfile() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      this.router.navigate(['/register']);
      return;
    }

    const parsedUser = JSON.parse(user);

    this.router.navigate(['/user-profile', parsedUser.id_usuario]);
  }

}