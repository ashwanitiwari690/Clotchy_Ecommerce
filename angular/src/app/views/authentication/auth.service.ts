import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../../service/AppService.class'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AppService<any> {

  constructor(protected override http: HttpClient) {
    super(http)
    this.appmod = 'login'
  }

   logout(id: number): Observable<any> {
    this.appmod = 'logout';
    let result = super.deleteService(id);
    this.appmod = "login";
    return result;
  }

  userLogin(data: any): Observable<any> {
    return this.http.post<any>(environment.SERVER + "loginuser", data)
  }

}
