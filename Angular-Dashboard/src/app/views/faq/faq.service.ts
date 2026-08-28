import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Faq } from '../../core/models/ticket.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}faqs`;
  private readonly store = new HttpCrudStore<Faq>(this.http, this.baseUrl);

  list(): Observable<Faq[]> { return this.store.list(); }
  get all(): Faq[] { return this.store.all; }
  getById(id: string): Faq | undefined { return this.store.getById(id); }
  create(data: Omit<Faq, 'id'>): Observable<Faq> { return this.store.create(data); }
  update(id: string, data: Partial<Faq>): Observable<Faq | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    this.http
      .post<{ success: boolean; data: Faq[] }>(`${this.baseUrl}/${id}/move`, { direction }, { withCredentials: true })
      .pipe(tap((res) => this.store.replaceAll(res.data)))
      .subscribe();
  }
}
