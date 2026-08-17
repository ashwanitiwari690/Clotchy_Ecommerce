import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./collections.component').then((m) => m.CollectionsComponent),
    data: { title: $localize`Collections` },
  },
];
