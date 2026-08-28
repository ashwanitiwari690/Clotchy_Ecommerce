import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../core/models/brand.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<Brand>(this.http, `${environment.ECOMMERCE_API}brands`);

  list(): Observable<Brand[]> { return this.store.list(); }
  get all(): Brand[] { return this.store.all; }
  getById(id: string): Brand | undefined { return this.store.getById(id); }
  create(data: Omit<Brand, 'id'>): Observable<Brand> { return this.store.create(data); }
  update(id: string, data: Partial<Brand>): Observable<Brand | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
