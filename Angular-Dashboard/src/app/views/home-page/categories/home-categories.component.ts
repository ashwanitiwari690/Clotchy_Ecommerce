import { Component, inject } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { HomeCategoryService } from './home-category.service';
import { CategoryService } from '../../categories/category.service';
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
  private readonly categorySvc = inject(CategoryService);
  private readonly toast = inject(ToastService);

  get features(): HomeCategoryFeature[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  get availableCategories() {
    const featuredIds = new Set(this.svc.all.map((f) => f.categoryId));
    return this.categorySvc.all.filter((c) => !featuredIds.has(c.id));
  }

  categoryName(id: string): string { return this.categorySvc.getById(id)?.name ?? '—'; }
  categoryImage(id: string): string { return this.categorySvc.getById(id)?.image ?? ''; }
  productCount(id: string): number { return this.categorySvc.productCount(id); }

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
