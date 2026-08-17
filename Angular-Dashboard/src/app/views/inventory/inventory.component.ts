import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { Product } from '../../core/models/product.model';
import { getProductById } from '../../core/mock-data/products.mock';
import { getCategoryById } from '../../core/mock-data/categories.mock';
import { ToastService } from '../../layout/toasts/toast.service';

interface InventoryRow {
  item: InventoryItem;
  product: Product;
  categoryName: string;
  total: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [SharedUIModule, FormsModule, IconDirective],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {
  private readonly svc = inject(InventoryService);
  private readonly toast = inject(ToastService);

  search = '';
  selectedRow = signal<InventoryRow | null>(null);

  adjustDelta = 0;
  adjustNote = '';

  bulkEdits = signal<Record<string, number>>({});

  private statusOf(item: InventoryItem): InventoryRow['status'] {
    if (item.availableStock === 0) return 'out-of-stock';
    if (item.availableStock <= item.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  }

  get rows(): InventoryRow[] {
    const term = this.search.trim().toLowerCase();
    return this.svc.all
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        const row: InventoryRow = {
          item,
          product,
          categoryName: getCategoryById(product.categoryId)?.name ?? '—',
          total: item.availableStock + item.reservedStock,
          status: this.statusOf(item),
        };
        return row;
      })
      .filter((r): r is InventoryRow => !!r)
      .filter((r) => !term || r.product.name.toLowerCase().includes(term) || r.product.sku.toLowerCase().includes(term));
  }

  get bulkRows(): { productId: string; name: string; sku: string }[] {
    return this.svc.all.map((item) => {
      const product = getProductById(item.productId);
      return { productId: item.productId, name: product?.name ?? item.productId, sku: product?.sku ?? '' };
    });
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdjust(row: InventoryRow): void {
    this.selectedRow.set(row);
    this.adjustDelta = 0;
    this.adjustNote = '';
  }

  saveAdjust(): void {
    const row = this.selectedRow();
    if (!row || this.adjustDelta === 0) return;
    this.svc.adjustStock(row.item.productId, this.adjustDelta, this.adjustNote);
    this.toast.success('Stock adjusted.');
  }

  openHistory(row: InventoryRow): void {
    this.selectedRow.set(row);
  }

  openBulk(): void {
    const map: Record<string, number> = {};
    this.svc.all.forEach((item) => (map[item.productId] = item.availableStock));
    this.bulkEdits.set(map);
  }

  onBulkChange(productId: string, value: number): void {
    this.bulkEdits.update((map) => ({ ...map, [productId]: value }));
  }

  saveBulk(): void {
    const updates = Object.entries(this.bulkEdits()).map(([productId, availableStock]) => ({ productId, availableStock }));
    this.svc.bulkUpdate(updates);
    this.toast.success('Inventory updated.');
  }
}
