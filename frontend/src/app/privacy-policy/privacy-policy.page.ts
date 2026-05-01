import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class PrivacyPolicyPage implements OnInit {

  constructor() { 
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {
  }
}
