import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection } from '../../core/models/collection.model';
import { COLLECTIONS_MOCK } from '../../core/mock-data/collections.mock';
import { PRODUCTS_MOCK } from '../../core/mock-data/products.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private readonly store = new MockCrudStore<Collection>(COLLECTIONS_MOCK, 'col');

  list(): Observable<Collection[]> { return this.store.list(); }
  get all(): Collection[] { return this.store.all; }
  getById(id: string): Collection | undefined { return this.store.getById(id); }
  create(data: Omit<Collection, 'id'>): Observable<Collection> { return this.store.create(data); }
  update(id: string, data: Partial<Collection>): Observable<Collection | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  productCount(collectionId: string): number {
    return PRODUCTS_MOCK.filter((p) => p.collectionIds?.includes(collectionId)).length;
  }
}
