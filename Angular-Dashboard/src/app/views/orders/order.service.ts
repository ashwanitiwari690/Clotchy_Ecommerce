import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../../core/models/order.model';
import { ORDERS_MOCK } from '../../core/mock-data/orders.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly store = new MockCrudStore<Order>(ORDERS_MOCK, 'CLT');

  list(): Observable<Order[]> { return this.store.list(); }
  get all(): Order[] { return this.store.all; }
  getById(id: string): Order | undefined { return this.store.getById(id); }
  update(id: string, data: Partial<Order>): Observable<Order | undefined> { return this.store.update(id, data); }

  setStatus(id: string, status: OrderStatus): Observable<Order | undefined> {
    return this.store.update(id, { status });
  }
}
