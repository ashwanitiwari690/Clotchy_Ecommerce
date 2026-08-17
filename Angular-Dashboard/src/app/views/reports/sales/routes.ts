import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sales.component').then((m) => m.SalesReportComponent),
    data: { title: $localize`Sales Report` },
  },
];
