import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, ReviewStatus } from '../../core/models/review.model';
import { REVIEWS_MOCK } from '../../core/mock-data/reviews.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly store = new MockCrudStore<Review>(REVIEWS_MOCK, 'rev');

  list(): Observable<Review[]> { return this.store.list(); }
  get all(): Review[] { return this.store.all; }
  getById(id: string): Review | undefined { return this.store.getById(id); }

  updateStatus(id: string, status: ReviewStatus): Observable<Review | undefined> {
    return this.store.update(id, { status });
  }

  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
