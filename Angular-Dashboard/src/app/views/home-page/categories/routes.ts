import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-categories.component').then((m) => m.HomeCategoriesComponent),
    data: { title: $localize`Shop By Category` },
  },
];
