import { Injectable, signal } from '@angular/core';
import { InventoryItem, InventoryMovement } from '../../core/models/inventory.model';
import { INVENTORY_MOCK } from '../../core/mock-data/inventory.mock';
import { generateId } from '../../core/models/common.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly items = signal<InventoryItem[]>([...INVENTORY_MOCK]);

  get all(): InventoryItem[] {
    return this.items();
  }

  getByProductId(productId: string): InventoryItem | undefined {
    return this.items().find((i) => i.productId === productId);
  }

  adjustStock(productId: string, delta: number, note: string): void {
    this.items.update((list) => list.map((item) => {
      if (item.productId !== productId) return item;
      const movement: InventoryMovement = {
        id: generateId('mv'),
        date: new Date().toISOString().slice(0, 10),
        type: 'adjustment',
        quantity: delta,
        note: note || 'Manual stock adjustment.',
      };
      return {
        ...item,
        availableStock: Math.max(0, item.availableStock + delta),
        history: [movement, ...item.history],
      };
    }));
  }

  bulkUpdate(updates: { productId: string; availableStock: number }[]): void {
    const map = new Map(updates.map((u) => [u.productId, u.availableStock]));
    this.items.update((list) => list.map((item) => (map.has(item.productId) ? { ...item, availableStock: map.get(item.productId)! } : item)));
  }
}
