import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeCollectionFeature } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HomeCollectionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}home/collections`;
  private readonly store = new HttpCrudStore<HomeCollectionFeature>(this.http, this.baseUrl);

  get all(): HomeCollectionFeature[] { return this.store.all; }
  update(id: string, data: Partial<HomeCollectionFeature>): Observable<HomeCollectionFeature | undefined> {
    return this.store.update(id, data);
  }

  add(collectionId: string, shortDescription: string, link: string): void {
    const maxOrder = Math.max(0, ...this.store.all.map((f) => f.displayOrder));
    this.store.create({ collectionId, shortDescription, link, displayOrder: maxOrder + 1, status: 'active' }).subscribe();
  }

  remove(id: string): void {
    this.store.delete(id).subscribe();
  }

  toggleStatus(feature: HomeCollectionFeature): void {
    this.store.update(feature.id, { status: feature.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  move(id: string, direction: 'up' | 'down'): void {
    this.http.post(`${this.baseUrl}/${id}/move`, { direction }).subscribe(() => this.store.refresh());
  }
}
