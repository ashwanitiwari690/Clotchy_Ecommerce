import { Routes } from '@angular/router';
import { Page500Component } from './views/authentication/page500/page500.component'
import { AuthGaurd } from './views/authentication/gaurd/Auth.guard'
import { environment } from './../environments/environment';

var appuri, logouturi: any;
if (environment.production) {
  appuri = environment.SERVER;
  logouturi = environment.SERVER + 'logout';
}
else {
  appuri = environment.SERVER;
  logouturi = environment.SERVER + 'logout';
}

export const CIAPIURL = 'http://localhost:4228/'
export const APIURL = appuri;

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./views/authentication/auth-routing.module')
            .then(m => m.AuthRoutingModule)
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGaurd],
    runGuardsAndResolvers: 'always',
    loadComponent: () => import('./layout/default-layout').then(m => m.DefaultLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'knowledge',
        loadChildren: () => import('./views/knowledge-base/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      }
    ]
  },
  { path: '**', component: Page500Component }
];
