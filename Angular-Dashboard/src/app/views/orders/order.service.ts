import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Order, OrderStatus } from '../../core/models/order.model';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}orders`;
  private readonly items = signal<Order[]>([]);

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.list().subscribe();
  }

  list(): Observable<Order[]> {
    return this.http.get<ApiEnvelope<Order[]>>(this.baseUrl, { params: { pageSize: '50' } }).pipe(
      map((res) => res.data),
      tap((list) => this.items.set(list)),
    );
  }

  get all(): Order[] {
    return this.items();
  }

  getById(id: string): Order | undefined {
    return this.items().find((o) => o.id === id);
  }

  getByIdAsync(id: string): Observable<Order> {
    return this.http.get<ApiEnvelope<Order>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  setStatus(id: string, status: OrderStatus): Observable<Order | undefined> {
    return this.http.patch<ApiEnvelope<Order>>(`${this.baseUrl}/${id}/status`, { status }).pipe(
      map((res) => res.data),
      tap(() => this.refresh()),
    );
  }
}
