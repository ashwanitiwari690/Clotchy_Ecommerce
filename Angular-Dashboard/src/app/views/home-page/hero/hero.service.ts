import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeroBanner } from '../../../core/models/homepage.model';
import { HERO_BANNERS_MOCK } from '../../../core/mock-data/home-page.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly store = new MockCrudStore<HeroBanner>(HERO_BANNERS_MOCK, 'hero');

  list(): Observable<HeroBanner[]> { return this.store.list(); }
  get all(): HeroBanner[] { return this.store.all; }
  getById(id: string): HeroBanner | undefined { return this.store.getById(id); }
  create(data: Omit<HeroBanner, 'id'>): Observable<HeroBanner> { return this.store.create(data); }
  update(id: string, data: Partial<HeroBanner>): Observable<HeroBanner | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.store.all].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((b) => b.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const tmp = sorted[idx].displayOrder;
    sorted[idx] = { ...sorted[idx], displayOrder: sorted[swapIdx].displayOrder };
    sorted[swapIdx] = { ...sorted[swapIdx], displayOrder: tmp };
    this.store.replaceAll(sorted);
  }
}
