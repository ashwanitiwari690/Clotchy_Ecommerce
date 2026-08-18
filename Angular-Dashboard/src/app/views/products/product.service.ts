import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Product, ProductVariant } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

// The API's shape (slug/taxPercent/discountPercent/collections[]) doesn't match
// the dashboard's Product model 1:1 (urlSlug/tax/discount/collectionIds, plus
// Decimal fields that arrive as strings over JSON) - this service is the one
// place that reconciles the two so every component keeps using the existing
// `Product` interface unchanged.
const fromApi = (p: Record<string, any>): Product => ({
  id: p['id'],
  name: p['name'],
  sku: p['sku'],
  description: p['description'] ?? '',
  shortDescription: p['shortDescription'] ?? '',
  brandId: null,
  categoryId: p['categoryId'] ?? '',
  collectionIds: (p['collections'] ?? []).map((c: { id: string }) => c.id),
  tags: p['tags'] ?? [],
  price: Number(p['price']),
  salePrice: p['salePrice'] != null ? Number(p['salePrice']) : null,
  costPrice: p['costPrice'] != null ? Number(p['costPrice']) : 0,
  tax: Number(p['taxPercent'] ?? 0),
  discount: Number(p['discountPercent'] ?? 0),
  stock: p['stock'],
  lowStockThreshold: p['lowStockThreshold'],
  availability: p['availability'],
  allowBackorder: p['allowBackorder'],
  mainImage: p['mainImage'] ?? '',
  thumbnail: p['thumbnail'] ?? '',
  gallery: p['gallery'] ?? [],
  variants: (p['variants'] ?? []).map(
    (v: Record<string, any>): ProductVariant => ({
      id: v['id'],
      size: v['size'] ?? undefined,
      color: v['color'] ?? undefined,
      material: v['material'] ?? undefined,
      sku: v['sku'],
      price: Number(v['price']),
      stock: v['stock'],
    }),
  ),
  metaTitle: p['metaTitle'] ?? '',
  metaDescription: p['metaDescription'] ?? '',
  urlSlug: p['slug'],
  keywords: p['keywords'] ?? '',
  status: p['status'],
  featured: p['featured'],
  bestSeller: p['bestSeller'],
  unitsSold: p['unitsSold'],
  revenue: Number(p['revenue']),
  rating: Number(p['rating']),
  reviewCount: p['reviewCount'],
  createdAt: p['createdAt'],
});

const toApi = (data: Partial<Product>): Record<string, unknown> => {
  const { brandId: _brandId, tax, discount, urlSlug, id: _id, variants, ...rest } = data;
  const payload: Record<string, unknown> = { ...rest };
  if (urlSlug !== undefined) payload['slug'] = urlSlug;
  if (tax !== undefined) payload['taxPercent'] = tax;
  if (discount !== undefined) payload['discountPercent'] = discount;
  if (variants !== undefined) payload['variants'] = variants.map(({ id: _variantId, ...v }) => v);
  return payload;
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}products`;
  private readonly items = signal<Product[]>([]);

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.list().subscribe();
  }

  list(): Observable<Product[]> {
    return this.http.get<ApiEnvelope<Record<string, any>[]>>(this.baseUrl, { params: { pageSize: '50' } }).pipe(
      map((res) => res.data.map(fromApi)),
      tap((list) => this.items.set(list)),
    );
  }

  get all(): Product[] {
    return this.items();
  }

  getById(id: string): Product | undefined {
    return this.items().find((p) => p.id === id);
  }

  getByIdAsync(id: string): Observable<Product> {
    return this.http.get<ApiEnvelope<Record<string, any>>>(`${this.baseUrl}/${id}`).pipe(map((res) => fromApi(res.data)));
  }

  create(data: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<ApiEnvelope<Record<string, any>>>(this.baseUrl, toApi(data)).pipe(
      map((res) => fromApi(res.data)),
      tap(() => this.refresh()),
    );
  }

  update(id: string, data: Partial<Product>): Observable<Product | undefined> {
    return this.http.patch<ApiEnvelope<Record<string, any>>>(`${this.baseUrl}/${id}`, toApi(data)).pipe(
      map((res) => fromApi(res.data)),
      tap(() => this.refresh()),
    );
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => true),
      tap(() => this.refresh()),
    );
  }

  duplicate(id: string): Observable<Product | undefined> {
    const source = this.getById(id);
    if (!source) return this.update(id, {});
    const { id: _drop, ...rest } = source;
    return this.create({
      ...rest,
      name: `${source.name} (Copy)`,
      sku: `${source.sku}-COPY-${Date.now()}`,
      urlSlug: `${source.urlSlug}-copy-${Date.now()}`,
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
