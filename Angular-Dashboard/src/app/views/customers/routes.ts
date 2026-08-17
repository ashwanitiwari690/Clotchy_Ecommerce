import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customers.component').then((m) => m.CustomersComponent),
    data: { title: $localize`Customers` },
  },
  {
    path: 'groups',
    loadComponent: () => import('./customer-groups.component').then((m) => m.CustomerGroupsComponent),
    data: { title: $localize`Customer Groups` },
  },
  {
    path: 'addresses',
    loadComponent: () => import('./customer-addresses.component').then((m) => m.CustomerAddressesComponent),
    data: { title: $localize`Customer Addresses` },
  },
  {
    path: ':id',
    loadComponent: () => import('./customer-detail.component').then((m) => m.CustomerDetailComponent),
    data: { title: $localize`Customer Detail` },
  },
];
