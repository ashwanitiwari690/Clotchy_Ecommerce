import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customers.component').then((m) => m.CustomerReportComponent),
    data: { title: $localize`Customer Report` },
  },
];
