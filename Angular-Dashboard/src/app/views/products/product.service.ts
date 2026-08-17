import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { PRODUCTS_MOCK } from '../../core/mock-data/products.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly store = new MockCrudStore<Product>(PRODUCTS_MOCK, 'prod');

  list(): Observable<Product[]> { return this.store.list(); }
  get all(): Product[] { return this.store.all; }
  getById(id: string): Product | undefined { return this.store.getById(id); }
  create(data: Omit<Product, 'id'>): Observable<Product> { return this.store.create(data); }
  update(id: string, data: Partial<Product>): Observable<Product | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  duplicate(id: string): Observable<Product | undefined> {
    const source = this.getById(id);
    if (!source) return this.update(id, {});
    const { id: _drop, ...rest } = source;
    return this.create({
      ...rest,
      name: `${source.name} (Copy)`,
      sku: `${source.sku}-COPY`,
      status: 'draft',
      featured: false,
      bestSeller: false,
      unitsSold: 0,
      revenue: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  toggleStatus(product: Product): Observable<Product | undefined> {
    const next = product.status === 'published' ? 'draft' : 'published';
    return this.update(product.id, { status: next });
  }

  toggleFeatured(product: Product): Observable<Product | undefined> {
    return this.update(product.id, { featured: !product.featured });
  }
}
