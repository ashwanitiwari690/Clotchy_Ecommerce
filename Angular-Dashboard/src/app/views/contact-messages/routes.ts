import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact-messages.component').then((m) => m.ContactMessagesComponent),
    data: { title: $localize`Contact Messages` },
  },
];
