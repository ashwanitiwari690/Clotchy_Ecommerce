import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * The API uses an httpOnly session cookie (no bearer token stored client-side),
 * so every request against it needs `withCredentials: true` or the cookie never
 * gets sent. Applying it here once means individual services don't each have to
 * remember to set it.
 */
@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith(environment.ECOMMERCE_API)) {
      return next.handle(req.clone({ withCredentials: true }));
    }
    return next.handle(req);
  }
}
