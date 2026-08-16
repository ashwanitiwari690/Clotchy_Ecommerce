import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAppInitializer, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth.interceptor';
import { AuthService } from './app/auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    // Preload all lazy route chunks in the background after the initial route
    // renders, so first load stays light but later navigation is instant.
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withPreloading(PreloadAllModules)),
    // Defers the animations engine out of the initial bundle until it's actually used.
    provideAnimationsAsync(),
    // Fetch-based HttpClient backend instead of XHR: supports HTTP/2 multiplexing better.
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    // Silently check the access-token cookie on app load so a returning user
    // stays logged in. A 401 here just means there's no valid session, so it's swallowed.
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.restoreSession().pipe(catchError(() => of(null)));
    })
  ]
}).catch(err => console.error(err));
