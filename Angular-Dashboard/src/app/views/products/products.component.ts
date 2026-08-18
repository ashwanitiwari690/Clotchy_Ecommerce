import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { ProductService } from './product.service';
import { CategoryService } from '../categories/category.service';
import { Product } from '../../core/models/product.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedUIModule, RouterLink, IconDirective, DecimalPipe],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private readonly svc = inject(ProductService);
  private readonly categorySvc = inject(CategoryService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  categoryFilter = '';
  statusFilter = '';
  currentPage = signal(1);
  pageSize = 10;
  selectedIds = signal<Set<string>>(new Set());
  previewProduct = signal<Product | null>(null);

  get categories() {
    return this.categorySvc.all;
  }

  get filtered(): Product[] {
    const term = this.search.trim().toLowerCase();
    return this.svc.all.filter((p) => {
      const matchesTerm = !term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
      const matchesCategory = !this.categoryFilter || p.categoryId === this.categoryFilter;
      const matchesStatus = !this.statusFilter || p.status === this.statusFilter;
      return matchesTerm && matchesCategory && matchesStatus;
    });
  }

  get paged(): Product[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  categoryName(id: string): string { return this.categorySvc.getById(id)?.name ?? '—'; }

  onSearch(value: string): void { this.search = value; this.currentPage.set(1); }
  onPageChange(page: number): void { this.currentPage.set(page); }

  isSelected(id: string): boolean { return this.selectedIds().has(id); }

  toggleSelect(id: string): void {
    const next = new Set(this.selectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedIds.set(next);
  }

  toggleSelectAll(): void {
    const allOnPage = this.paged.map((p) => p.id);
    const allSelected = allOnPage.every((id) => this.selectedIds().has(id));
    const next = new Set(this.selectedIds());
    allOnPage.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
    this.selectedIds.set(next);
  }

  view(product: Product): void {
    this.previewProduct.set(product);
  }

  duplicate(product: Product): void {
    this.svc.duplicate(product.id).subscribe(() => this.toast.success(`Duplicated "${product.name}".`));
  }

  toggleStatus(product: Product): void {
    this.svc.toggleStatus(product).subscribe(() => this.toast.success('Product status updated.'));
  }

  toggleFeatured(product: Product): void {
    this.svc.toggleFeatured(product).subscribe();
  }

  remove(product: Product): void {
    this.confirm.confirm({ message: `Delete "${product.name}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(product.id).subscribe(() => this.toast.success('Product deleted.'));
      });
  }

  bulkDelete(): void {
    const ids = [...this.selectedIds()];
    if (!ids.length) return;
    this.confirm.confirm({ message: `Delete ${ids.length} selected product(s)?`, danger: true, confirmText: 'Delete All' })
      .subscribe((ok) => {
        if (ok) {
          ids.forEach((id) => this.svc.delete(id).subscribe());
          this.selectedIds.set(new Set());
          this.toast.success('Selected products deleted.');
        }
      });
  }

  bulkSetStatus(status: 'published' | 'draft'): void {
    const ids = [...this.selectedIds()];
    ids.forEach((id) => this.svc.update(id, { status }).subscribe());
    this.selectedIds.set(new Set());
    this.toast.success('Selected products updated.');
  }
}
