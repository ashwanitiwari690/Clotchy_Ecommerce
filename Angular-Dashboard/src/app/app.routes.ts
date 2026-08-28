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
    path: 'home-page-preview',
    canActivate: [AuthGaurd],
    loadComponent: () => import('./views/home-page-preview/home-page-preview.component').then((m) => m.HomePagePreviewComponent)
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
        path: 'products',
        loadChildren: () => import('./views/products/routes').then((m) => m.routes)
      },
      {
        path: 'categories',
        loadChildren: () => import('./views/categories/routes').then((m) => m.routes)
      },
      {
        path: 'collections',
        loadChildren: () => import('./views/collections/routes').then((m) => m.routes)
      },
      {
        path: 'brands',
        loadChildren: () => import('./views/brands/routes').then((m) => m.routes)
      },
      {
        path: 'attributes',
        loadChildren: () => import('./views/attributes/routes').then((m) => m.routes)
      },
      {
        path: 'reviews',
        loadChildren: () => import('./views/reviews/routes').then((m) => m.routes)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./views/inventory/routes').then((m) => m.routes)
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/orders/routes').then((m) => m.routes)
      },
      {
        path: 'customers',
        loadChildren: () => import('./views/customers/routes').then((m) => m.routes)
      },
      {
        path: 'home-page',
        loadChildren: () => import('./views/home-page/routes').then((m) => m.routes)
      },
      {
        path: 'marketing/coupons',
        loadChildren: () => import('./views/marketing/coupons/routes').then((m) => m.routes)
      },
      {
        path: 'marketing/discounts',
        loadChildren: () => import('./views/marketing/discounts/routes').then((m) => m.routes)
      },
      {
        path: 'marketing/banners',
        loadChildren: () => import('./views/marketing/banners/routes').then((m) => m.routes)
      },
      {
        path: 'marketing/featured-products',
        loadChildren: () => import('./views/marketing/featured-products/routes').then((m) => m.routes)
      },
      {
        path: 'helpdesk',
        loadChildren: () => import('./views/helpdesk/routes').then((m) => m.routes)
      },
      {
        path: 'contact-messages',
        loadChildren: () => import('./views/contact-messages/routes').then((m) => m.routes)
      },
      {
        path: 'faq',
        loadChildren: () => import('./views/faq/routes').then((m) => m.routes)
      },
      {
        path: 'reports/sales',
        loadChildren: () => import('./views/reports/sales/routes').then((m) => m.routes)
      },
      {
        path: 'reports/products',
        loadChildren: () => import('./views/reports/products/routes').then((m) => m.routes)
      },
      {
        path: 'reports/customers',
        loadChildren: () => import('./views/reports/customers/routes').then((m) => m.routes)
      },
      {
        path: 'reports/orders',
        loadChildren: () => import('./views/reports/orders/routes').then((m) => m.routes)
      },
      {
        path: 'reports/inventory',
        loadChildren: () => import('./views/reports/inventory/routes').then((m) => m.routes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./views/settings/routes').then((m) => m.routes)
      },
      {
        path: 'admin-users',
        loadChildren: () => import('./views/admin-users/routes').then((m) => m.routes)
      }
    ]
  },
  { path: '**', component: Page500Component }
];
