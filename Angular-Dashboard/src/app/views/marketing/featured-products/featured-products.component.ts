import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ProductService } from '../../products/product.service';
import { Product } from '../../../core/models/product.model';
import { getCategoryById } from '../../../core/mock-data/categories.mock';
import { ToastService } from '../../../layout/toasts/toast.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [SharedUIModule, DecimalPipe],
  templateUrl: './featured-products.component.html',
})
export class FeaturedProductsComponent {
  private readonly svc = inject(ProductService);
  private readonly toast = inject(ToastService);

  search = '';

  get products(): Product[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => Number(b.featured) - Number(a.featured));
    return term ? list.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)) : list;
  }

  get featuredCount(): number {
    return this.svc.all.filter((p) => p.featured).length;
  }

  categoryName(id: string): string {
    return getCategoryById(id)?.name ?? '—';
  }

  onSearch(value: string): void {
    this.search = value;
  }

  toggleFeatured(product: Product): void {
    this.svc.toggleFeatured(product).subscribe(() => {
      this.toast.success(product.featured ? 'Removed from Featured Products.' : 'Added to Featured Products.');
    });
  }
}
