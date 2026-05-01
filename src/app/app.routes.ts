import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'create-tutoring-ad',
    loadComponent: () => import('./create-tutoring-ad/create-tutoring-ad.page').then( m => m.CreateTutoringAdPage)
  },
  {
    path: 'tutoring-ad',
    loadComponent: () => import('./tutoring-ad/tutoring-ad.page').then( m => m.TutoringAdPage)
  },
];
