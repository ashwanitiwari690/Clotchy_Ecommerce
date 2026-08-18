import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { BestSellerService } from './best-seller.service';
import { ProductService } from '../../products/product.service';
import { CategoryService } from '../../categories/category.service';
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
  private readonly productSvc = inject(ProductService);
  private readonly categorySvc = inject(CategoryService);
  private readonly toast = inject(ToastService);

  autoSelect = signal(false);

  get features(): BestSellerFeature[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  get availableProducts() {
    const featuredIds = new Set(this.svc.all.map((f) => f.productId));
    return this.productSvc.all.filter((p) => !featuredIds.has(p.id));
  }

  product(id: string) { return this.productSvc.getById(id); }
  categoryName(id: string): string { return this.categorySvc.getById(id)?.name ?? '—'; }

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
