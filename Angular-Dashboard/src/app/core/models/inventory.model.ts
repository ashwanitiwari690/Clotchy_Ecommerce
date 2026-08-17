export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface InventoryMovement {
  id: string;
  date: string;
  type: 'adjustment' | 'sale' | 'restock' | 'return';
  quantity: number;
  note: string;
}

export interface InventoryItem {
  productId: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  history: InventoryMovement[];
}
