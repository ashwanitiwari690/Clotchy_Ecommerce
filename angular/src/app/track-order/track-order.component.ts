import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface TrackedOrder {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  total: number;
}

interface TrackingStep {
  label: string;
  done: boolean;
}

const STEP_LABELS = ['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

// Maps the backend's 10-value status enum onto the 5 display steps below.
const STEP_INDEX_FOR_STATUS: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 1,
  packed: 1,
  shipped: 2,
  'out-for-delivery': 3,
  delivered: 4,
};

const TERMINAL_ISSUE_STATUSES = new Set(['cancelled', 'returned', 'refunded']);

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackOrderComponent {
  orderId = signal('');
  phone = signal('');
  error = signal('');
  loading = signal(false);
  order = signal<TrackedOrder | null>(null);

  constructor(private http: HttpClient) {}

  onOrderIdInput(e: Event): void {
    this.orderId.set((e.target as HTMLInputElement).value.trim().toUpperCase());
  }

  onPhoneInput(e: Event): void {
    this.phone.set((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10));
  }

  get steps(): TrackingStep[] {
    const order = this.order();
    if (!order) return [];
    const displayIdx = STEP_INDEX_FOR_STATUS[order.status] ?? -1;
    return STEP_LABELS.map((label, i) => ({ label, done: displayIdx >= i }));
  }

  get hasTerminalIssue(): boolean {
    return TERMINAL_ISSUE_STATUSES.has(this.order()?.status ?? '');
  }

  track(): void {
    if (!this.orderId().trim()) {
      this.error.set('Enter your order ID');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(this.phone())) {
      this.error.set('Enter a valid 10-digit mobile number');
      return;
    }
    this.error.set('');
    this.loading.set(true);
    this.http
      .get<{ success: boolean; data: TrackedOrder }>(`${environment.apiUrl}/orders/track`, {
        params: { orderNumber: this.orderId(), phone: this.phone() },
      })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.order.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(err.error?.message ?? 'No order found matching those details.');
        },
      });
  }

  reset(): void {
    this.orderId.set('');
    this.phone.set('');
    this.order.set(null);
    this.error.set('');
  }
}
