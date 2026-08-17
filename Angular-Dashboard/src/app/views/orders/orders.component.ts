import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { OrderService } from './order.service';
import { Order } from '../../core/models/order.model';

const STATUS_GROUPS: Record<string, Order['status'][]> = {
  pending: ['pending', 'confirmed'],
  processing: ['processing', 'packed'],
  shipped: ['shipped', 'out-for-delivery'],
  delivered: ['delivered'],
  cancelled: ['cancelled', 'returned', 'refunded'],
};

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [SharedUIModule, FormsModule, RouterLink],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  private readonly svc = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  search = '';
  statusFilter = signal('');
  currentPage = signal(1);
  pageSize = 10;

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.statusFilter.set(params['status'] ?? '');
      this.currentPage.set(1);
    });
  }

  get filtered(): Order[] {
    const term = this.search.trim().toLowerCase();
    const filter = this.statusFilter();
    const group = STATUS_GROUPS[filter];
    return [...this.svc.all]
      .filter((o) => !filter || (group ? group.includes(o.status) : o.status === filter))
      .filter((o) => !term || o.id.toLowerCase().includes(term) || o.customerName.toLowerCase().includes(term))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  get paged(): Order[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(value: string): void {
    this.search = value;
    this.currentPage.set(1);
  }

  onStatusChange(value: string): void {
    this.router.navigate([], { queryParams: { status: value || null }, queryParamsHandling: 'merge' });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
