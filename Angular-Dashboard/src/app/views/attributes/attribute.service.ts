import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAttribute } from '../../core/models/brand.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttributeService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<ProductAttribute>(this.http, `${environment.ECOMMERCE_API}attributes`);

  list(): Observable<ProductAttribute[]> { return this.store.list(); }
  get all(): ProductAttribute[] { return this.store.all; }
  getById(id: string): ProductAttribute | undefined { return this.store.getById(id); }
  create(data: Omit<ProductAttribute, 'id'>): Observable<ProductAttribute> { return this.store.create(data); }
  update(id: string, data: Partial<ProductAttribute>): Observable<ProductAttribute | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
