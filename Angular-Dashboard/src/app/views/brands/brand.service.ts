import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../core/models/brand.model';
import { BRANDS_MOCK } from '../../core/mock-data/brands.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private readonly store = new MockCrudStore<Brand>(BRANDS_MOCK, 'brand');

  list(): Observable<Brand[]> { return this.store.list(); }
  get all(): Brand[] { return this.store.all; }
  getById(id: string): Brand | undefined { return this.store.getById(id); }
  create(data: Omit<Brand, 'id'>): Observable<Brand> { return this.store.create(data); }
  update(id: string, data: Partial<Brand>): Observable<Brand | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
