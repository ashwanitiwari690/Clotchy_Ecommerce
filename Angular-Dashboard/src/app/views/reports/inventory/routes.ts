import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inventory.component').then((m) => m.InventoryReportComponent),
    data: { title: $localize`Inventory Report` },
  },
];
