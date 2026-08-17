import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./featured-products.component').then((m) => m.FeaturedProductsComponent),
    data: { title: $localize`Featured Products` },
  },
];
