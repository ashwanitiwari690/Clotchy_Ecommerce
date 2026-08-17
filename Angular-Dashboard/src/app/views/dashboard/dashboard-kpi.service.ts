import { Injectable } from '@angular/core';
import { PRODUCTS_MOCK } from '../../core/mock-data/products.mock';
import { ORDERS_MOCK } from '../../core/mock-data/orders.mock';
import { CUSTOMERS_MOCK } from '../../core/mock-data/customers.mock';
import { TICKETS_MOCK } from '../../core/mock-data/helpdesk.mock';
import { CATEGORIES_MOCK } from '../../core/mock-data/categories.mock';
import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { Customer } from '../../core/models/customer.model';

export interface OrderStatusBucket {
  label: string;
  value: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardKpiService {
  get totalRevenue(): number {
    return ORDERS_MOCK.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  }

  get totalOrders(): number {
    return ORDERS_MOCK.length;
  }

  get totalCustomers(): number {
    return CUSTOMERS_MOCK.length;
  }

  get totalProducts(): number {
    return PRODUCTS_MOCK.length;
  }

  get pendingOrders(): number {
    return ORDERS_MOCK.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  }

  get lowStockProducts(): Product[] {
    return PRODUCTS_MOCK.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  }

  get openTickets(): number {
    return TICKETS_MOCK.filter(t => t.status === 'open' || t.status === 'in-progress').length;
  }

  get todaysSales(): number {
    const latestDate = [...ORDERS_MOCK].sort((a, b) => b.date.localeCompare(a.date))[0]?.date;
    return ORDERS_MOCK.filter(o => o.date === latestDate).reduce((sum, o) => sum + o.total, 0);
  }

  get orderStatusBuckets(): OrderStatusBucket[] {
    const buckets: Record<string, { statuses: Order['status'][]; color: string }> = {
      Pending: { statuses: ['pending', 'confirmed'], color: '#f9b115' },
      Processing: { statuses: ['processing', 'packed'], color: '#3399ff' },
      Shipped: { statuses: ['shipped', 'out-for-delivery'], color: '#20a8d8' },
      Delivered: { statuses: ['delivered'], color: '#2eb85c' },
      Cancelled: { statuses: ['cancelled', 'returned', 'refunded'], color: '#e55353' },
    };
    return Object.entries(buckets).map(([label, cfg]) => ({
      label,
      value: ORDERS_MOCK.filter(o => cfg.statuses.includes(o.status)).length,
      color: cfg.color,
    }));
  }

  get revenueByCategory(): { label: string; value: number }[] {
    return CATEGORIES_MOCK.map(cat => ({
      label: cat.name,
      value: PRODUCTS_MOCK.filter(p => p.categoryId === cat.id).reduce((sum, p) => sum + p.revenue, 0),
    })).sort((a, b) => b.value - a.value);
  }

  get topSellingProducts(): Product[] {
    return [...PRODUCTS_MOCK].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
  }

  get recentOrders(): Order[] {
    return [...ORDERS_MOCK].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  }

  get recentCustomers(): Customer[] {
    return [...CUSTOMERS_MOCK].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, 5);
  }
}
