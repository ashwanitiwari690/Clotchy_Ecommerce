import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../core/models/category.model';
import { CATEGORIES_MOCK } from '../../core/mock-data/categories.mock';
import { PRODUCTS_MOCK } from '../../core/mock-data/products.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly store = new MockCrudStore<Category>(CATEGORIES_MOCK, 'cat');

  list(): Observable<Category[]> { return this.store.list(); }
  get all(): Category[] { return this.store.all; }
  getById(id: string): Category | undefined { return this.store.getById(id); }
  create(data: Omit<Category, 'id'>): Observable<Category> { return this.store.create(data); }
  update(id: string, data: Partial<Category>): Observable<Category | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  productCount(categoryId: string): number {
    return PRODUCTS_MOCK.filter((p) => p.categoryId === categoryId).length;
  }

  move(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.store.all].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const tmp = sorted[idx].sortOrder;
    sorted[idx] = { ...sorted[idx], sortOrder: sorted[swapIdx].sortOrder };
    sorted[swapIdx] = { ...sorted[swapIdx], sortOrder: tmp };
    this.store.replaceAll(sorted);
  }
}
