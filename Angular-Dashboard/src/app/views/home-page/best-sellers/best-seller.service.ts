import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BestSellerFeature } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BestSellerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}home/best-sellers`;
  private readonly store = new HttpCrudStore<BestSellerFeature>(this.http, this.baseUrl);

  get all(): BestSellerFeature[] { return this.store.all; }

  add(productId: string): void {
    const maxOrder = Math.max(0, ...this.store.all.map((f) => f.displayOrder));
    this.store.create({ productId, displayOrder: maxOrder + 1, status: 'active' }).subscribe();
  }

  remove(id: string): void {
    this.store.delete(id).subscribe();
  }

  toggleStatus(feature: BestSellerFeature): void {
    this.store.update(feature.id, { status: feature.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  move(id: string, direction: 'up' | 'down'): void {
    this.http.post(`${this.baseUrl}/${id}/move`, { direction }).subscribe(() => this.store.refresh());
  }
}
