import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Order, OrderStatus } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface SalesReport {
  orders: Order[];
  revenue: number;
  orderCount: number;
  aov: number;
  refunds: number;
  discounts: number;
  revenueByDate: { date: string; value: number }[];
}

export interface OrderStatusSummary {
  status: OrderStatus;
  count: number;
  revenue: number;
}

export interface OrdersReport {
  orders: Order[];
  statusSummary: OrderStatusSummary[];
}

export interface ProductsReport {
  bestSelling: Product[];
  mostViewed: (Product & { views: number })[];
  lowStock: Product[];
  countByCategory: { label: string; value: number }[];
}

/** Matches the customer shape returned by `GET /reports/customers` - lighter than the full `Customer` model (no `status`, `groupId`, etc). */
export interface ReportCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface CustomersReport {
  newCustomers: ReportCustomer[];
  returningCustomers: ReportCustomer[];
  topCustomers: ReportCustomer[];
}

export interface InventoryReport {
  totalSkus: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  stockByCategory: { label: string; value: number }[];
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}reports`;

  getSales(): Observable<SalesReport> {
    return this.http.get<ApiEnvelope<SalesReport>>(`${this.baseUrl}/sales`).pipe(map((res) => res.data));
  }

  getOrders(): Observable<OrdersReport> {
    return this.http.get<ApiEnvelope<OrdersReport>>(`${this.baseUrl}/orders`).pipe(map((res) => res.data));
  }

  getProducts(): Observable<ProductsReport> {
    return this.http.get<ApiEnvelope<ProductsReport>>(`${this.baseUrl}/products`).pipe(map((res) => res.data));
  }

  getCustomers(): Observable<CustomersReport> {
    return this.http.get<ApiEnvelope<CustomersReport>>(`${this.baseUrl}/customers`).pipe(map((res) => res.data));
  }

  getInventory(): Observable<InventoryReport> {
    return this.http.get<ApiEnvelope<InventoryReport>>(`${this.baseUrl}/inventory`).pipe(map((res) => res.data));
  }
}
