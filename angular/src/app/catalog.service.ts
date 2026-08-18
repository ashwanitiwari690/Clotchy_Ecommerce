import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from './models';
import { environment } from '../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ProductFilters {
  category?: string;
  collection?: string;
  search?: string;
  sort?: 'featured' | 'low' | 'high' | 'rating';
  pageSize?: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface CollectionDto {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
}

export interface HeroDto {
  heading: string;
  subheading: string | null;
  description: string | null;
  desktopImage: string | null;
  mobileImage: string | null;
  primaryButtonText: string | null;
  primaryButtonLink: string | null;
  secondaryButtonText: string | null;
  secondaryButtonLink: string | null;
}

export interface CommunityImageDto {
  id: string;
  image: string;
  title: string | null;
  description: string | null;
  socialUrl: string | null;
}

export interface HomeData {
  hero: HeroDto | null;
  categories: CategoryDto[];
  collections: (CollectionDto & { shortDescription: string | null; link: string | null })[];
  bestSellers: Product[];
  community: CommunityImageDto[];
}

const SORT_MAP: Record<string, string> = { low: 'price-asc', high: 'price-desc', rating: 'rating' };

// Reconciles the API's product shape (relations, Decimal-as-string fields,
// tags/status/sku the storefront doesn't care about) into the storefront's own
// lightweight `Product` view model.
const toProduct = (p: Record<string, any>): Product => {
  const sizes = [...new Set<string>((p['variants'] ?? []).map((v: Record<string, any>) => v['size']).filter(Boolean))];
  const colors = [...new Set<string>((p['variants'] ?? []).map((v: Record<string, any>) => v['color']).filter(Boolean))];
  const salePrice = p['salePrice'] != null ? Number(p['salePrice']) : null;

  return {
    id: p['id'],
    name: p['name'],
    category: p['category']?.name ?? '',
    collection: p['collections']?.[0]?.name ?? '',
    price: salePrice ?? Number(p['price']),
    oldPrice: salePrice != null ? Number(p['price']) : undefined,
    rating: Number(p['rating']) || 0,
    reviews: p['reviewCount'] ?? 0,
    image: p['mainImage'] ?? '',
    badge: p['bestSeller'] ? 'BEST SELLER' : p['featured'] ? 'FEATURED' : undefined,
    description: p['description'] || p['shortDescription'] || '',
    sizes: sizes.length ? sizes : ['Free Size'],
    colors: colors.length ? colors : ['Default'],
  };
};

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    const params: Record<string, string> = { pageSize: String(filters.pageSize ?? 50) };
    if (filters.category) params['category'] = filters.category;
    if (filters.collection) params['collection'] = filters.collection;
    if (filters.search) params['search'] = filters.search;
    if (filters.sort && SORT_MAP[filters.sort]) params['sort'] = SORT_MAP[filters.sort];

    return this.http
      .get<ApiEnvelope<Record<string, any>[]>>(`${this.baseUrl}/products`, { params })
      .pipe(map((res) => res.data.map(toProduct)));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<ApiEnvelope<Record<string, any>>>(`${this.baseUrl}/products/${id}`)
      .pipe(map((res) => toProduct(res.data)));
  }

  getCategories(): Observable<CategoryDto[]> {
    return this.http
      .get<ApiEnvelope<CategoryDto[]>>(`${this.baseUrl}/categories`, { params: { status: 'active' } })
      .pipe(map((res) => res.data));
  }

  getCollections(): Observable<CollectionDto[]> {
    return this.http
      .get<ApiEnvelope<CollectionDto[]>>(`${this.baseUrl}/collections`, { params: { status: 'active' } })
      .pipe(map((res) => res.data));
  }

  getHome(): Observable<HomeData> {
    return this.http.get<ApiEnvelope<Record<string, any>>>(`${this.baseUrl}/home`).pipe(
      map((res) => ({
        hero: res.data['hero'],
        categories: res.data['categories'],
        collections: res.data['collections'],
        bestSellers: (res.data['bestSellers'] ?? []).map(toProduct),
        community: res.data['community'],
      })),
    );
  }
}
