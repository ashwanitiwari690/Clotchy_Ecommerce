import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Review, ReviewStatus } from '../../core/models/review.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}reviews`;
  private readonly store = new HttpCrudStore<Review>(this.http, this.baseUrl);

  list(): Observable<Review[]> { return this.store.list(); }
  get all(): Review[] { return this.store.all; }
  getById(id: string): Review | undefined { return this.store.getById(id); }
  getByIdAsync(id: string): Observable<Review> { return this.store.getByIdAsync(id); }

  updateStatus(id: string, status: ReviewStatus): Observable<Review | undefined> {
    return this.http.patch<ApiEnvelope<Review>>(`${this.baseUrl}/${id}`, { status }, { withCredentials: true }).pipe(
      map((res) => res.data),
      tap(() => this.store.refresh()),
    );
  }

  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
