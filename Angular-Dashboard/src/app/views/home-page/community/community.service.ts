import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityImage } from '../../../core/models/homepage.model';
import { COMMUNITY_IMAGES_MOCK } from '../../../core/mock-data/home-page.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private readonly store = new MockCrudStore<CommunityImage>(COMMUNITY_IMAGES_MOCK, 'comm');

  list(): Observable<CommunityImage[]> { return this.store.list(); }
  get all(): CommunityImage[] { return this.store.all; }
  create(data: Omit<CommunityImage, 'id'>): Observable<CommunityImage> { return this.store.create(data); }
  update(id: string, data: Partial<CommunityImage>): Observable<CommunityImage | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.store.all].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const tmp = sorted[idx].displayOrder;
    sorted[idx] = { ...sorted[idx], displayOrder: sorted[swapIdx].displayOrder };
    sorted[swapIdx] = { ...sorted[swapIdx], displayOrder: tmp };
    this.store.replaceAll(sorted);
  }
}
