import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./hero.component').then((m) => m.HeroComponent),
    data: { title: $localize`Hero Banner` },
  },
];
