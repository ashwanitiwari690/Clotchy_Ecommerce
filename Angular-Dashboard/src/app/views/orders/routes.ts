import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders.component').then((m) => m.OrdersComponent),
    data: { title: $localize`Orders` },
  },
  {
    path: ':id',
    loadComponent: () => import('./order-detail.component').then((m) => m.OrderDetailComponent),
    data: { title: $localize`Order Detail` },
  },
];
