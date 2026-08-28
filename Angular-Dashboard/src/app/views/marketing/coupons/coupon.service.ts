import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from '../../../core/models/marketing.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<Coupon>(this.http, `${environment.ECOMMERCE_API}coupons`);

  list(): Observable<Coupon[]> { return this.store.list(); }
  get all(): Coupon[] { return this.store.all; }
  getById(id: string): Coupon | undefined { return this.store.getById(id); }
  create(data: Omit<Coupon, 'id'>): Observable<Coupon> { return this.store.create(data); }
  update(id: string, data: Partial<Coupon>): Observable<Coupon | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
