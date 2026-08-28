import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';

export interface OrderStatusBucket {
  label: string;
  value: number;
  color: string;
}

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year';

export interface DashboardTrend {
  labels: string[];
  revenue: number[];
  orders: number[];
}

/** Lighter than the full `Customer` model - matches exactly what `GET /dashboard/stats` returns for recentCustomers. */
export interface DashboardRecentCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  todaysSales: number;
  openTickets: number;
  orderStatusBuckets: OrderStatusBucket[];
  revenueByCategory: { label: string; value: number }[];
  topSellingProducts: Product[];
  lowStockProducts: Product[];
  recentOrders: Order[];
  recentCustomers: DashboardRecentCustomer[];
  trend: DashboardTrend;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

const EMPTY_STATS: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  pendingOrders: 0,
  todaysSales: 0,
  openTickets: 0,
  orderStatusBuckets: [],
  revenueByCategory: [],
  topSellingProducts: [],
  lowStockProducts: [],
  recentOrders: [],
  recentCustomers: [],
  trend: { labels: [], revenue: [], orders: [] },
};

@Injectable({ providedIn: 'root' })
export class DashboardKpiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}dashboard/stats`;
  private readonly stats = signal<DashboardStats>(EMPTY_STATS);

  readonly period = signal<DashboardPeriod>('month');

  constructor() {
    this.setPeriod(this.period()).subscribe();
  }

  /** Refetches `/dashboard/stats` for the given period and updates every KPI getter below. */
  setPeriod(period: DashboardPeriod): Observable<DashboardStats> {
    this.period.set(period);
    return this.http.get<ApiEnvelope<DashboardStats>>(this.baseUrl, { params: { period } }).pipe(
      map((res) => res.data),
      tap((data) => this.stats.set(data)),
    );
  }

  get totalRevenue(): number {
    return this.stats().totalRevenue;
  }

  get totalOrders(): number {
    return this.stats().totalOrders;
  }

  get totalCustomers(): number {
    return this.stats().totalCustomers;
  }

  get totalProducts(): number {
    return this.stats().totalProducts;
  }

  get pendingOrders(): number {
    return this.stats().pendingOrders;
  }

  get lowStockProducts(): Product[] {
    return this.stats().lowStockProducts;
  }

  get openTickets(): number {
    return this.stats().openTickets;
  }

  get todaysSales(): number {
    return this.stats().todaysSales;
  }

  get orderStatusBuckets(): OrderStatusBucket[] {
    return this.stats().orderStatusBuckets;
  }

  get revenueByCategory(): { label: string; value: number }[] {
    return this.stats().revenueByCategory;
  }

  get topSellingProducts(): Product[] {
    return this.stats().topSellingProducts;
  }

  get recentOrders(): Order[] {
    return this.stats().recentOrders;
  }

  get recentCustomers(): DashboardRecentCustomer[] {
    return this.stats().recentCustomers;
  }

  get trend(): DashboardTrend {
    return this.stats().trend;
  }
}
