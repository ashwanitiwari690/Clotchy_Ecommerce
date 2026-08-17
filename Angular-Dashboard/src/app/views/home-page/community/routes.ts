import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./community.component').then((m) => m.CommunityComponent),
    data: { title: $localize`Community Section` },
  },
];
