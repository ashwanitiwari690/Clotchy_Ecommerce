import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./brands.component').then((m) => m.BrandsComponent),
    data: { title: $localize`Brands` },
  },
];
