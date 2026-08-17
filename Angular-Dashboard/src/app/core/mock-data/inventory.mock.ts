import { InventoryItem } from '../models/inventory.model';
import { PRODUCTS_MOCK } from './products.mock';

export const INVENTORY_MOCK: InventoryItem[] = PRODUCTS_MOCK.map((p, i) => ({
  productId: p.id,
  availableStock: p.stock,
  reservedStock: Math.round(p.stock * 0.08),
  lowStockThreshold: p.lowStockThreshold,
  history: [
    { id: `${p.id}-mv1`, date: '2026-07-01', type: 'restock', quantity: Math.round(p.stock * 0.6) + 20, note: 'Initial stock received from warehouse.' },
    { id: `${p.id}-mv2`, date: '2026-07-20', type: 'sale', quantity: -(p.unitsSold % 20 || 5), note: 'Online orders fulfilled.' },
    { id: `${p.id}-mv3`, date: '2026-08-05', type: i % 3 === 0 ? 'return' : 'adjustment', quantity: i % 3 === 0 ? 3 : -2, note: i % 3 === 0 ? 'Customer return restocked.' : 'Manual stock count correction.' },
  ],
}));
