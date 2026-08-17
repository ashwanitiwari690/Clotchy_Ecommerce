import { Component, inject } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { HomeCategoryService } from './home-category.service';
import { CATEGORIES_MOCK, getCategoryById } from '../../../core/mock-data/categories.mock';
import { PRODUCTS_MOCK } from '../../../core/mock-data/products.mock';
import { HomeCategoryFeature } from '../../../core/models/homepage.model';
import { ToastService } from '../../../layout/toasts/toast.service';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [SharedUIModule, IconDirective],
  templateUrl: './home-categories.component.html',
})
export class HomeCategoriesComponent {
  private readonly svc = inject(HomeCategoryService);
  private readonly toast = inject(ToastService);

  get features(): HomeCategoryFeature[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  get availableCategories() {
    const featuredIds = new Set(this.svc.all.map((f) => f.categoryId));
    return CATEGORIES_MOCK.filter((c) => !featuredIds.has(c.id));
  }

  categoryName(id: string): string { return getCategoryById(id)?.name ?? '—'; }
  categoryImage(id: string): string { return getCategoryById(id)?.image ?? ''; }
  productCount(id: string): number { return PRODUCTS_MOCK.filter((p) => p.categoryId === id).length; }

  add(categoryId: string): void {
    this.svc.add(categoryId);
    this.toast.success('Category added to homepage.');
  }

  remove(feature: HomeCategoryFeature): void {
    this.svc.remove(feature.id);
    this.toast.success('Category removed from homepage.');
  }

  toggleStatus(feature: HomeCategoryFeature): void {
    this.svc.toggleStatus(feature);
  }

  move(feature: HomeCategoryFeature, direction: 'up' | 'down'): void {
    this.svc.move(feature.id, direction);
  }
}
