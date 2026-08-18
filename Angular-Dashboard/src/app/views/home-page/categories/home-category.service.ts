import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HomeCategoryFeature } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HomeCategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}home/categories`;
  private readonly store = new HttpCrudStore<HomeCategoryFeature>(this.http, this.baseUrl);

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
    this.http.post(`${this.baseUrl}/${id}/move`, { direction }).subscribe(() => this.store.refresh());
  }
}
