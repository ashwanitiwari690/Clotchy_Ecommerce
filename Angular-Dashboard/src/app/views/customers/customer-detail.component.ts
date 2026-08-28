import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CustomerService } from './customer.service';
import { ReviewService } from '../reviews/review.service';
import { TicketService } from '../helpdesk/ticket.service';
import { ProductService } from '../products/product.service';

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
  private readonly productSvc = inject(ProductService);
  private readonly reviewSvc = inject(ReviewService);
  private readonly ticketSvc = inject(TicketService);

  readonly customerId = this.route.snapshot.paramMap.get('id')!;
  customer = signal<ReturnType<CustomerService['getById']>>(undefined);

  constructor() {
    this.svc.getByIdAsync(this.customerId).subscribe((customer) => this.customer.set(customer));
  }

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
    return [...(this.customer()?.orders ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  }

  get reviews() {
    return this.reviewSvc.all.filter((r) => r.customerId === this.customerId);
  }

  get tickets() {
    return this.ticketSvc.all.filter((t) => t.customerId === this.customerId);
  }

  get wishlistProducts() {
    const c = this.customer();
    if (!c) return [];
    return c.wishlistProductIds.map((id) => this.productSvc.getById(id)).filter((p) => !!p);
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
