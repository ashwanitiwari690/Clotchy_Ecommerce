import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.component').then((m) => m.ProductsComponent),
    data: { title: $localize`Products` },
  },
  {
    path: 'add',
    loadComponent: () => import('./product-form.component').then((m) => m.ProductFormComponent),
    data: { title: $localize`Add Product` },
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./product-form.component').then((m) => m.ProductFormComponent),
    data: { title: $localize`Edit Product` },
  },
];
