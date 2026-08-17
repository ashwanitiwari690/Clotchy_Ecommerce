import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CustomerService } from './customer.service';
import { ORDERS_MOCK } from '../../core/mock-data/orders.mock';
import { REVIEWS_MOCK } from '../../core/mock-data/reviews.mock';
import { TICKETS_MOCK } from '../../core/mock-data/helpdesk.mock';
import { getProductById } from '../../core/mock-data/products.mock';

type TabId = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'reviews' | 'tickets' | 'history';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [SharedUIModule, RouterLink, DecimalPipe],
  templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(CustomerService);

  readonly customerId = this.route.snapshot.paramMap.get('id')!;
  customer = signal(this.svc.getById(this.customerId));

  activeTab = signal<TabId>('profile');

  readonly tabs: { id: TabId; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'tickets', label: 'Support Tickets' },
    { id: 'history', label: 'Purchase History' },
  ];

  get orders() {
    return ORDERS_MOCK.filter((o) => o.customerId === this.customerId).sort((a, b) => b.date.localeCompare(a.date));
  }

  get reviews() {
    return REVIEWS_MOCK.filter((r) => r.customerId === this.customerId);
  }

  get tickets() {
    return TICKETS_MOCK.filter((t) => t.customerId === this.customerId);
  }

  get wishlistProducts() {
    const c = this.customer();
    if (!c) return [];
    return c.wishlistProductIds.map((id) => getProductById(id)).filter((p) => !!p);
  }

  get purchaseHistory() {
    return this.orders.flatMap((o) => o.items.map((item) => ({ ...item, date: o.date, orderId: o.id })));
  }

  selectTab(id: TabId): void {
    this.activeTab.set(id);
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
