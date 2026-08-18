import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Customer } from '../../core/models/customer.model';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}customers`;
  private readonly items = signal<Customer[]>([]);

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.list().subscribe();
  }

  list(): Observable<Customer[]> {
    return this.http.get<ApiEnvelope<Omit<Customer, 'addresses' | 'wishlistProductIds'>[]>>(this.baseUrl).pipe(
      map((res) => res.data.map((c): Customer => ({ ...c, addresses: [], wishlistProductIds: [] }))),
      tap((list) => this.items.set(list)),
    );
  }

  get all(): Customer[] {
    return this.items();
  }

  getById(id: string): Customer | undefined {
    return this.items().find((c) => c.id === id);
  }

  getByIdAsync(id: string): Observable<Customer> {
    return this.http.get<ApiEnvelope<Customer>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  update(id: string, data: Partial<Customer>): Observable<Customer | undefined> {
    return this.http.patch<ApiEnvelope<Customer>>(`${this.baseUrl}/${id}`, data).pipe(
      map((res) => res.data),
      tap(() => this.refresh()),
    );
  }
}
