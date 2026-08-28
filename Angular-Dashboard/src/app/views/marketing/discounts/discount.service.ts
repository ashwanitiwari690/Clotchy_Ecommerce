import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Discount } from '../../../core/models/marketing.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<Discount>(this.http, `${environment.ECOMMERCE_API}discounts`);

  list(): Observable<Discount[]> { return this.store.list(); }
  get all(): Discount[] { return this.store.all; }
  getById(id: string): Discount | undefined { return this.store.getById(id); }
  create(data: Omit<Discount, 'id'>): Observable<Discount> { return this.store.create(data); }
  update(id: string, data: Partial<Discount>): Observable<Discount | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
