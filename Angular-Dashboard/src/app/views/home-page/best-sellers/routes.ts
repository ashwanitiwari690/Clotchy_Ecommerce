import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./best-sellers.component').then((m) => m.BestSellersComponent),
    data: { title: $localize`Best Sellers` },
  },
];
