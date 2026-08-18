import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../core/models/category.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<Category>(this.http, `${environment.ECOMMERCE_API}categories`);

  list(): Observable<Category[]> { return this.store.list(); }
  get all(): Category[] { return this.store.all; }
  getById(id: string): Category | undefined { return this.store.getById(id); }
  getByIdAsync(id: string): Observable<Category> { return this.store.getByIdAsync(id); }
  create(data: Omit<Category, 'id'>): Observable<Category> { return this.store.create(data); }
  update(id: string, data: Partial<Category>): Observable<Category | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  productCount(categoryId: string): number {
    return this.store.getById(categoryId)?.productCount ?? 0;
  }

  // Swaps sortOrder with the neighboring category and persists both - the
  // sibling order the list is sorted by has to survive a page refresh, not
  // just live in the local signal.
  move(id: string, direction: 'up' | 'down'): void {
    const sorted = [...this.store.all].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    this.store.replaceAll(
      this.store.all.map((c) => (c.id === a.id ? { ...c, sortOrder: b.sortOrder } : c.id === b.id ? { ...c, sortOrder: a.sortOrder } : c)),
    );
    this.update(a.id, { sortOrder: b.sortOrder }).subscribe();
    this.update(b.id, { sortOrder: a.sortOrder }).subscribe();
  }
}
