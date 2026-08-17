import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.component').then((m) => m.ProductReportComponent),
    data: { title: $localize`Product Report` },
  },
];
