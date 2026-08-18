import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InventoryMovement } from '../../core/models/inventory.model';
import { environment } from '../../../environments/environment';

export interface InventoryRow {
  productId: string;
  productName: string;
  sku: string;
  thumbnail: string;
  categoryName: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  history: InventoryMovement[];
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface InventoryApiRow {
  productId: string;
  productName: string;
  sku: string;
  categoryName: string | null;
  thumbnail?: string | null;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
}

interface MovementApi {
  id: string;
  type: string;
  quantity: number;
  note: string | null;
  createdAt: string;
}

const toMovement = (m: MovementApi): InventoryMovement => ({
  id: m.id,
  date: m.createdAt.slice(0, 10),
  type: m.type as InventoryMovement['type'],
  quantity: m.quantity,
  note: m.note ?? '',
});

const toRow = (r: InventoryApiRow): InventoryRow => ({
  productId: r.productId,
  productName: r.productName,
  sku: r.sku,
  thumbnail: r.thumbnail ?? '',
  categoryName: r.categoryName ?? '—',
  availableStock: r.availableStock,
  reservedStock: r.reservedStock,
  lowStockThreshold: r.lowStockThreshold,
  history: [],
});

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}inventory`;
  private readonly rows = signal<InventoryRow[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.http.get<ApiEnvelope<InventoryApiRow[]>>(this.baseUrl).subscribe((res) => this.rows.set(res.data.map(toRow)));
  }

  get all(): InventoryRow[] {
    return this.rows();
  }

  getHistory(productId: string): Observable<InventoryMovement[]> {
    return this.http
      .get<ApiEnvelope<InventoryApiRow & { history: MovementApi[] }>>(`${this.baseUrl}/${productId}`)
      .pipe(map((res) => res.data.history.map(toMovement)));
  }

  adjustStock(productId: string, delta: number, note: string): void {
    this.http.post(`${this.baseUrl}/${productId}/adjust`, { delta, note }).subscribe(() => this.refresh());
  }

  bulkUpdate(updates: { productId: string; availableStock: number }[]): void {
    this.http.patch(`${this.baseUrl}/bulk`, updates).subscribe(() => this.refresh());
  }
}
