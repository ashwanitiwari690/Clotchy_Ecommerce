import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reviews.component').then((m) => m.ReviewsComponent),
    data: { title: $localize`Product Reviews` },
  },
];
