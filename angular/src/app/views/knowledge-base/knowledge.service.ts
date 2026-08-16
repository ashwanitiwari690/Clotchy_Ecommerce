import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../../service/AppService.class';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeService extends AppService<any>{
   constructor(protected override http: HttpClient) {
    super(http)
    this.appmod = 'knowledge'
  }

   public getknowledge(): Observable<any> {
    this.appmod = 'knowledge'
    let result = super.getService();
    this.appmod = "knowledge"
    return result
  }

}
