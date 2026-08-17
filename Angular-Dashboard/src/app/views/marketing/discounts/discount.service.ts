import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Discount } from '../../../core/models/marketing.model';
import { DISCOUNTS_MOCK } from '../../../core/mock-data/marketing.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private readonly store = new MockCrudStore<Discount>(DISCOUNTS_MOCK, 'disc');

  list(): Observable<Discount[]> { return this.store.list(); }
  get all(): Discount[] { return this.store.all; }
  getById(id: string): Discount | undefined { return this.store.getById(id); }
  create(data: Omit<Discount, 'id'>): Observable<Discount> { return this.store.create(data); }
  update(id: string, data: Partial<Discount>): Observable<Discount | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
