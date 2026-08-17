import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./testimonials.component').then((m) => m.TestimonialsComponent),
    data: { title: $localize`Testimonials` },
  },
];
