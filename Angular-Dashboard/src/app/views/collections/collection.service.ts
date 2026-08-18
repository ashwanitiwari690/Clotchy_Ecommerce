import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection } from '../../core/models/collection.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<Collection>(this.http, `${environment.ECOMMERCE_API}collections`);

  list(): Observable<Collection[]> { return this.store.list(); }
  get all(): Collection[] { return this.store.all; }
  getById(id: string): Collection | undefined { return this.store.getById(id); }
  getByIdAsync(id: string): Observable<Collection> { return this.store.getByIdAsync(id); }
  create(data: Omit<Collection, 'id'>): Observable<Collection> { return this.store.create(data); }
  update(id: string, data: Partial<Collection>): Observable<Collection | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  productCount(collectionId: string): number {
    return this.store.getById(collectionId)?.productCount ?? 0;
  }
}
