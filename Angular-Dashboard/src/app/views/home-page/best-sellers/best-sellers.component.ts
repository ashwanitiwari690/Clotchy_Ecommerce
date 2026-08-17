import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { BestSellerService } from './best-seller.service';
import { PRODUCTS_MOCK, getProductById } from '../../../core/mock-data/products.mock';
import { getCategoryById } from '../../../core/mock-data/categories.mock';
import { BestSellerFeature } from '../../../core/models/homepage.model';
import { ToastService } from '../../../layout/toasts/toast.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [SharedUIModule, IconDirective, DecimalPipe],
  templateUrl: './best-sellers.component.html',
})
export class BestSellersComponent {
  private readonly svc = inject(BestSellerService);
  private readonly toast = inject(ToastService);

  autoSelect = signal(false);

  get features(): BestSellerFeature[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  get availableProducts() {
    const featuredIds = new Set(this.svc.all.map((f) => f.productId));
    return PRODUCTS_MOCK.filter((p) => !featuredIds.has(p.id));
  }

  product(id: string) { return getProductById(id); }
  categoryName(id: string): string { return getCategoryById(id)?.name ?? '—'; }

  add(productId: string): void {
    this.svc.add(productId);
    this.toast.success('Product added to Best Sellers.');
  }

  remove(feature: BestSellerFeature): void {
    this.svc.remove(feature.id);
    this.toast.success('Product removed from Best Sellers.');
  }

  toggleStatus(feature: BestSellerFeature): void {
    this.svc.toggleStatus(feature);
  }

  move(feature: BestSellerFeature, direction: 'up' | 'down'): void {
    this.svc.move(feature.id, direction);
  }

  toggleAutoSelect(): void {
    this.autoSelect.update((v) => !v);
    this.toast.info('Automatic best-seller selection is a preview feature — manual curation still applies.');
  }
}
