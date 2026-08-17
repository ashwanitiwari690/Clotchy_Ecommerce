import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./discounts.component').then((m) => m.DiscountsComponent),
    data: { title: $localize`Discounts` },
  },
];
