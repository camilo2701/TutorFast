import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]})
export class HelpCenterPage implements OnInit {

  constructor() { 
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {
  }

}
