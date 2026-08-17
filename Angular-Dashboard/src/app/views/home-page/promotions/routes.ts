import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./promotions.component').then((m) => m.PromotionsComponent),
    data: { title: $localize`Promotional Sections` },
  },
];
