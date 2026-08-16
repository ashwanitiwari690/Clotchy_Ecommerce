import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                location.reload()
            }
            if(err.status == 406) {
                // this.__toast.error({ detail: "Message", summary: "Session has been expired", duration: 3000 });
                this.router.navigate(['/auth'])
                localStorage.clear()
                sessionStorage.clear()
            }

            const error = err.error.message || err.statusText
            return throwError(error)
        }))
    }
}