import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { OrderService } from './order.service';
import { Order, ORDER_STATUSES, OrderStatus } from '../../core/models/order.model';
import { ToastService } from '../../layout/toasts/toast.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [SharedUIModule, FormsModule],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc = inject(OrderService);
  private readonly toast = inject(ToastService);

  readonly orderId = this.route.snapshot.paramMap.get('id')!;
  readonly statuses = ORDER_STATUSES;
  order = signal<Order | undefined>(this.svc.getById(this.orderId));

  updateStatus(status: string): void {
    this.svc.setStatus(this.orderId, status as OrderStatus).subscribe((updated) => {
      this.order.set(updated);
      this.toast.success('Order status updated.');
    });
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
