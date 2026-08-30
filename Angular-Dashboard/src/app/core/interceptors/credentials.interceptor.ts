import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../views/authentication/auth.service';

/**
 * The dashboard is deployed on a different domain than the API, so the API's
 * session cookie is a third-party cookie that browsers may refuse to send
 * regardless of SameSite. Instead every request against the API carries the
 * stored accessToken as `Authorization: Bearer <token>`, which the backend
 * accepts as an alternative to the cookie. `withCredentials: true` is kept
 * as a harmless fallback for same-origin/local setups where the cookie does
 * work.
 */
@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith(environment.ECOMMERCE_API)) {
      const token = this.authService.getToken();
      const headers = token ? req.headers.set('Authorization', `Bearer ${token}`) : req.headers;
      return next.handle(req.clone({ withCredentials: true, headers }));
    }
    return next.handle(req);
  }
}
