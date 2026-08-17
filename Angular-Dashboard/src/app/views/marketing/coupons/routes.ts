import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./coupons.component').then((m) => m.CouponsComponent),
    data: { title: $localize`Coupons` },
  },
];
