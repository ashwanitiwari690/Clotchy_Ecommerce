import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Ticket } from '../../core/models/ticket.model';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}tickets`;
  private readonly items = signal<Ticket[]>([]);

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.list().subscribe();
  }

  list(): Observable<Ticket[]> {
    return this.http.get<ApiEnvelope<Ticket[]>>(this.baseUrl, { params: { pageSize: '50' }, withCredentials: true }).pipe(
      map((res) => res.data),
      tap((list) => this.items.set(list)),
    );
  }

  get all(): Ticket[] {
    return this.items();
  }

  getById(id: string): Ticket | undefined {
    return this.items().find((t) => t.id === id);
  }

  getByIdAsync(id: string): Observable<Ticket> {
    return this.http.get<ApiEnvelope<Ticket>>(`${this.baseUrl}/${id}`, { withCredentials: true }).pipe(map((res) => res.data));
  }

  update(id: string, data: { status?: string; priority?: string; category?: string; assignedAdminId?: string | null }): Observable<Ticket | undefined> {
    return this.http.patch<ApiEnvelope<Ticket>>(`${this.baseUrl}/${id}`, data, { withCredentials: true }).pipe(
      map((res) => res.data),
      tap(() => this.refresh()),
    );
  }

  addMessage(ticketId: string, message: string): Observable<Ticket | undefined> {
    return this.http.post<ApiEnvelope<Ticket>>(`${this.baseUrl}/${ticketId}/messages`, { message }, { withCredentials: true }).pipe(
      map((res) => res.data),
      tap(() => this.refresh()),
    );
  }
}
