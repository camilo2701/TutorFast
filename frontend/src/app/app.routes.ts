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
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'search-results',
    loadComponent: () => import('./search-results/search-results.page').then( m => m.SearchResultsPage)
  },
  {
    path: 'help-center',
    loadComponent: () => import('./help-center/help-center.page').then( m => m.HelpCenterPage)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/privacy-policy.page').then( m => m.PrivacyPolicyPage)
  },
  {
    path: 'create-tutoring-ad',
    loadComponent: () => import('./create-tutoring-ad/create-tutoring-ad.page').then( m => m.CreateTutoringAdPage)
  },
  {
    path: 'tutoring-ad',
    loadComponent: () => import('./tutoring-ad/tutoring-ad.page').then( m => m.TutoringAdPage)
  },
  {
    path: 'user-profile/:id',
    loadComponent: () =>
      import('./user-profile/user-profile.page').then((m) => m.UserProfilePage),
  },
];
