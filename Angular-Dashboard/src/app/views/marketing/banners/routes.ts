import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./banners.component').then((m) => m.BannersComponent),
    data: { title: $localize`Banners` },
  },
];
