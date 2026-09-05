import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StaticPage } from '../../core/models/static-page.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StaticPageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}static-pages`;
  private readonly store = new HttpCrudStore<StaticPage>(this.http, this.baseUrl);

  list(): Observable<StaticPage[]> { return this.store.list(); }
  get all(): StaticPage[] { return this.store.all; }
  getById(id: string): StaticPage | undefined { return this.store.getById(id); }
  create(data: Omit<StaticPage, 'id'>): Observable<StaticPage> { return this.store.create(data); }
  update(id: string, data: Partial<StaticPage>): Observable<StaticPage | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
