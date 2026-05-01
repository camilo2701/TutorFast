import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SessionTimeoutService } from './services/session-timeout.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet
  ],
})
export class AppComponent {

  constructor(private sessionTimeout: SessionTimeoutService) {
    this.sessionTimeout.start();
  }

}