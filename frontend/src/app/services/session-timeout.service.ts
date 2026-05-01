import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private timeout: any;
  private readonly limit = 10 * 60 * 1000;

  constructor(private router: Router) {}

  start() {
    this.reset();

    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => this.reset());
    });
  }

  reset() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.logout();
    }, this.limit);
  }

  logout() {
    console.log('Sesión expirada');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }
}