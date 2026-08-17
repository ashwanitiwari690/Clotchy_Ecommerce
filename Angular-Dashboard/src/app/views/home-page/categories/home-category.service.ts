import { Injectable } from '@angular/core';
import { HomeCategoryFeature } from '../../../core/models/homepage.model';
import { HOME_CATEGORY_FEATURES_MOCK } from '../../../core/mock-data/home-page.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class HomeCategoryService {
  private readonly store = new MockCrudStore<HomeCategoryFeature>(HOME_CATEGORY_FEATURES_MOCK, 'hcf');

  get all(): HomeCategoryFeature[] { return this.store.all; }

  add(categoryId: string): void {
    const maxOrder = Math.max(0, ...this.store.all.map((f) => f.displayOrder));
    this.store.create({ categoryId, displayOrder: maxOrder + 1, status: 'active' }).subscribe();
  }

  remove(id: string): void {
    this.store.delete(id).subscribe();
  }

  toggleStatus(feature: HomeCategoryFeature): void {
    this.store.update(feature.id, { status: feature.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

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
