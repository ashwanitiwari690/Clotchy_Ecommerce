import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Testimonial } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}testimonials`;
  private readonly store = new HttpCrudStore<Testimonial>(this.http, this.baseUrl);

  list(): Observable<Testimonial[]> { return this.store.list(); }
  get all(): Testimonial[] { return this.store.all; }
  getById(id: string): Testimonial | undefined { return this.store.getById(id); }
  create(data: Omit<Testimonial, 'id'>): Observable<Testimonial> { return this.store.create(data); }
  update(id: string, data: Partial<Testimonial>): Observable<Testimonial | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    this.http
      .post<{ success: boolean; data: Testimonial[] }>(`${this.baseUrl}/${id}/move`, { direction }, { withCredentials: true })
      .pipe(tap((res) => this.store.replaceAll(res.data)))
      .subscribe();
  }
}
