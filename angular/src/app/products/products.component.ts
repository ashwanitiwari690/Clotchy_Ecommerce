import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CatalogService, ProductFilters } from '../catalog.service';
import { Product } from '../models';

const toSlug = (value: string) => value.toLowerCase().trim().replace(/\s+/g, '-');

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  category = signal('');
  collection = signal('');
  search = signal('');
  sort = signal<NonNullable<ProductFilters['sort']>>('featured');
  loading = signal(true);
  filtered = signal<Product[]>([]);

  constructor(private catalog: CatalogService, route: ActivatedRoute) {
    route.queryParamMap.subscribe((params) => {
      this.category.set(params.get('category') ?? '');
      this.collection.set(params.get('collection') ?? '');
      const sortParam = params.get('sort');
      this.sort.set(
        sortParam === 'new' ? 'featured' : ((sortParam as NonNullable<ProductFilters['sort']>) ?? 'featured'),
      );
    });

    // Re-fetches from the API whenever any filter signal changes (query-param
    // driven or from the filter buttons below), instead of filtering a
    // preloaded array client-side.
    effect(() => {
      const filters: ProductFilters = {
        category: this.category() ? toSlug(this.category()) : undefined,
        collection: this.collection() ? toSlug(this.collection()) : undefined,
        search: this.search() || undefined,
        sort: this.sort(),
      };
      this.loading.set(true);
      this.catalog.getProducts(filters).subscribe((products) => {
        this.filtered.set(products);
        this.loading.set(false);
      });
    });
  }
}
