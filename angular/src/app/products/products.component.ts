import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PRODUCTS } from '../data';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  products = PRODUCTS;
  category = signal('');
  collection = signal('');
  search = signal('');
  sort = signal('featured');

  filtered = computed(() => {
    let result = [...this.products];
    if (this.category()) result = result.filter(p => p.category.toLowerCase() === this.category().toLowerCase());
    if (this.collection()) result = result.filter(p => p.collection.toLowerCase() === this.collection().toLowerCase());
    const term = this.search().trim().toLowerCase();
    if (term) result = result.filter(p => `${p.name} ${p.category} ${p.collection}`.toLowerCase().includes(term));
    if (this.sort() === 'low') result.sort((a,b) => a.price-b.price);
    if (this.sort() === 'high') result.sort((a,b) => b.price-a.price);
    if (this.sort() === 'rating') result.sort((a,b) => b.rating-a.rating);
    return result;
  });

  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe(params => {
      this.category.set(params.get('category') ?? '');
      this.collection.set(params.get('collection') ?? '');
      this.sort.set(params.get('sort') === 'new' ? 'featured' : (params.get('sort') ?? 'featured'));
    });
  }
}