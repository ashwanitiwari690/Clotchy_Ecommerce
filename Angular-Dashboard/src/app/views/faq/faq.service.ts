import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Faq } from '../../core/models/ticket.model';
import { FAQS_MOCK } from '../../core/mock-data/helpdesk.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly store = new MockCrudStore<Faq>(FAQS_MOCK, 'faq');

  list(): Observable<Faq[]> { return this.store.list(); }
  get all(): Faq[] { return this.store.all; }
  getById(id: string): Faq | undefined { return this.store.getById(id); }
  create(data: Omit<Faq, 'id'>): Observable<Faq> { return this.store.create(data); }
  update(id: string, data: Partial<Faq>): Observable<Faq | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.store.all].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((f) => f.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const tmp = sorted[idx].displayOrder;
    sorted[idx] = { ...sorted[idx], displayOrder: sorted[swapIdx].displayOrder };
    sorted[swapIdx] = { ...sorted[swapIdx], displayOrder: tmp };
    this.store.replaceAll(sorted);
  }
}
