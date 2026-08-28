import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
}

export interface ProductReviews {
  reviews: ProductReview[];
  average: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  list(productId: string): Observable<ProductReviews> {
    return this.http
      .get<ApiEnvelope<ProductReviews>>(`${this.baseUrl}/products/${productId}/reviews`)
      .pipe(map((res) => res.data));
  }

  submit(productId: string, rating: number, comment: string): Observable<ProductReview> {
    return this.http
      .post<ApiEnvelope<ProductReview>>(`${this.baseUrl}/products/${productId}/reviews`, { rating, comment }, { withCredentials: true })
      .pipe(map((res) => res.data));
  }
}
