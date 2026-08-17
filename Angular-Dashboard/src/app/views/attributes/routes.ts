import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./attributes.component').then((m) => m.AttributesComponent),
    data: { title: $localize`Product Attributes` },
  },
];
