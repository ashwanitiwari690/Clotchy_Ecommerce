import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tickets.component').then((m) => m.TicketsComponent),
    data: { title: $localize`Support Tickets` },
  },
  {
    path: 'categories',
    loadComponent: () => import('./ticket-categories.component').then((m) => m.TicketCategoriesComponent),
    data: { title: $localize`Support Categories` },
  },
  {
    path: ':id',
    loadComponent: () => import('./ticket-detail.component').then((m) => m.TicketDetailComponent),
    data: { title: $localize`Ticket Detail` },
  },
];
