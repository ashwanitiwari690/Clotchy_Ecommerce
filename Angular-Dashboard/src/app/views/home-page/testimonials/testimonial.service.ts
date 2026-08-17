import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonial } from '../../../core/models/homepage.model';
import { TESTIMONIALS_MOCK } from '../../../core/mock-data/home-page.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly store = new MockCrudStore<Testimonial>(TESTIMONIALS_MOCK, 'test');

  list(): Observable<Testimonial[]> { return this.store.list(); }
  get all(): Testimonial[] { return this.store.all; }
  getById(id: string): Testimonial | undefined { return this.store.getById(id); }
  create(data: Omit<Testimonial, 'id'>): Observable<Testimonial> { return this.store.create(data); }
  update(id: string, data: Partial<Testimonial>): Observable<Testimonial | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.store.all].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((t) => t.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const tmp = sorted[idx].displayOrder;
    sorted[idx] = { ...sorted[idx], displayOrder: sorted[swapIdx].displayOrder };
    sorted[swapIdx] = { ...sorted[swapIdx], displayOrder: tmp };
    this.store.replaceAll(sorted);
  }
}
