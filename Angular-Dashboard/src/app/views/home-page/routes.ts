import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page.component').then((m) => m.HomePageComponent),
    data: { title: $localize`Home Page Management` },
  },
  {
    path: 'hero',
    loadChildren: () => import('./hero/routes').then((m) => m.routes),
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/routes').then((m) => m.routes),
  },
  {
    path: 'collections',
    loadChildren: () => import('./collections/routes').then((m) => m.routes),
  },
  {
    path: 'best-sellers',
    loadChildren: () => import('./best-sellers/routes').then((m) => m.routes),
  },
  {
    path: 'promotions',
    loadChildren: () => import('./promotions/routes').then((m) => m.routes),
  },
  {
    path: 'testimonials',
    loadChildren: () => import('./testimonials/routes').then((m) => m.routes),
  },
  {
    path: 'community',
    loadChildren: () => import('./community/routes').then((m) => m.routes),
  },
  {
    path: 'newsletter',
    loadChildren: () => import('./newsletter/routes').then((m) => m.routes),
  },
];
