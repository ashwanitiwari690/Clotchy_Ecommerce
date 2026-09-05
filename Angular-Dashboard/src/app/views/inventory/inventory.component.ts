import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { InventoryService, InventoryRow } from './inventory.service';
import { ToastService } from '../../layout/toasts/toast.service';

interface DisplayRow extends InventoryRow {
  total: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [SharedUIModule, FormsModule, RouterLink, IconDirective],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {
  private readonly svc = inject(InventoryService);
  private readonly toast = inject(ToastService);

  search = '';
  selectedRow = signal<DisplayRow | null>(null);

  adjustDelta = 0;
  adjustNote = '';

  bulkEdits = signal<Record<string, number>>({});

  private statusOf(row: InventoryRow): DisplayRow['status'] {
    if (row.availableStock === 0) return 'out-of-stock';
    if (row.availableStock <= row.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  }

  private toDisplayRow(row: InventoryRow): DisplayRow {
    return { ...row, total: row.availableStock + row.reservedStock, status: this.statusOf(row) };
  }

  get rows(): DisplayRow[] {
    const term = this.search.trim().toLowerCase();
    return this.svc.all
      .map((row) => this.toDisplayRow(row))
      .filter((r) => !term || r.productName.toLowerCase().includes(term) || r.sku.toLowerCase().includes(term));
  }

  get bulkRows(): { productId: string; name: string; sku: string }[] {
    return this.svc.all.map((row) => ({ productId: row.productId, name: row.productName, sku: row.sku }));
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdjust(row: DisplayRow): void {
    this.selectedRow.set(row);
    this.adjustDelta = 0;
    this.adjustNote = '';
  }

  saveAdjust(): void {
    const row = this.selectedRow();
    if (!row || this.adjustDelta === 0) return;
    this.svc.adjustStock(row.productId, this.adjustDelta, this.adjustNote);
    this.toast.success('Stock adjusted.');
  }

  openHistory(row: DisplayRow): void {
    this.selectedRow.set(row);
    this.svc.getHistory(row.productId).subscribe((history) => {
      this.selectedRow.set({ ...row, history });
    });
  }

  openBulk(): void {
    const map: Record<string, number> = {};
    this.svc.all.forEach((row) => (map[row.productId] = row.availableStock));
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
