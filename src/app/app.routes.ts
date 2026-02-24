import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing').then(m => m.Landing), pathMatch: 'full' },
  { path: 'landing', redirectTo: '', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { 
    path: '', 
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
      { path: 'clientes', loadComponent: () => import('./pages/clients/clients').then(m => m.Clients) },
      { path: 'menu-admin', loadComponent: () => import('./pages/menu-admin/menu-admin').then(m => m.MenuAdmin) },
      { path: 'landing-admin', loadComponent: () => import('./pages/landing-admin/landing-admin').then(m => m.LandingAdmin) },
      { path: 'bitacora', loadComponent: () => import('./pages/bitacora/bitacora').then(m => m.Bitacora) }
    ]
  },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.Registro) },
  { path: 'menu', loadComponent: () => import('./pages/menu-public/menu-public').then(m => m.MenuPublic) },
  { path: '**', redirectTo: '' }
];
