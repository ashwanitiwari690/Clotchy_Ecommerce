import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from '../../../core/models/marketing.model';
import { COUPONS_MOCK } from '../../../core/mock-data/marketing.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private readonly store = new MockCrudStore<Coupon>(COUPONS_MOCK, 'cpn');

  list(): Observable<Coupon[]> { return this.store.list(); }
  get all(): Coupon[] { return this.store.all; }
  getById(id: string): Coupon | undefined { return this.store.getById(id); }
  create(data: Omit<Coupon, 'id'>): Observable<Coupon> { return this.store.create(data); }
  update(id: string, data: Partial<Coupon>): Observable<Coupon | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
