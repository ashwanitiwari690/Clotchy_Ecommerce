import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAttribute } from '../../core/models/brand.model';
import { ATTRIBUTES_MOCK } from '../../core/mock-data/brands.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class AttributeService {
  private readonly store = new MockCrudStore<ProductAttribute>(ATTRIBUTES_MOCK, 'attr');

  list(): Observable<ProductAttribute[]> { return this.store.list(); }
  get all(): ProductAttribute[] { return this.store.all; }
  getById(id: string): ProductAttribute | undefined { return this.store.getById(id); }
  create(data: Omit<ProductAttribute, 'id'>): Observable<ProductAttribute> { return this.store.create(data); }
  update(id: string, data: Partial<ProductAttribute>): Observable<ProductAttribute | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
