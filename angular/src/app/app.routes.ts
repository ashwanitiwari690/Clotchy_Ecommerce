import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent) },
  { path: 'product/:id', loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'collections', loadComponent: () => import('./collections/collections.component').then(m => m.CollectionsComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
  { path: 'faq', loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent) },
  { path: 'help', data: { slug: 'help', label: 'HELP' }, loadComponent: () => import('./static-page/static-page.component').then(m => m.StaticPageComponent) },
  { path: 'shipping-policy', data: { slug: 'shipping-policy', label: 'SHIPPING POLICY' }, loadComponent: () => import('./static-page/static-page.component').then(m => m.StaticPageComponent) },
  { path: 'return-policy', data: { slug: 'return-policy', label: 'RETURN POLICY' }, loadComponent: () => import('./static-page/static-page.component').then(m => m.StaticPageComponent) },
  { path: 'bulk-orders', data: { slug: 'bulk-orders', label: 'BULK ORDERS' }, loadComponent: () => import('./static-page/static-page.component').then(m => m.StaticPageComponent) },
  { path: 'track-order', loadComponent: () => import('./track-order/track-order.component').then(m => m.TrackOrderComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./authentication/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./authentication/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', canActivate: [guestGuard], loadComponent: () => import('./authentication/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: '**', redirectTo: '' }
];
