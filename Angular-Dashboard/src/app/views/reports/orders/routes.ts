import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders.component').then((m) => m.OrderReportComponent),
    data: { title: $localize`Order Report` },
  },
];
