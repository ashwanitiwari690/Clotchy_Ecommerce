import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-collections.component').then((m) => m.HomeCollectionsComponent),
    data: { title: $localize`Explore Collections` },
  },
];
