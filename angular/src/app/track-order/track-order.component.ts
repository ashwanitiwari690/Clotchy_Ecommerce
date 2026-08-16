import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface TrackingStep {
  label: string;
  date: string;
  done: boolean;
}

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackOrderComponent {
  orderId = signal('');
  phone = signal('');
  error = signal('');
  tracked = signal(false);

  // No Orders API exists yet - this always shows the same illustrative dummy
  // timeline once both fields are filled, so the page/UX is ready to wire up
  // to a real endpoint once order tracking is built.
  readonly steps: TrackingStep[] = [
    { label: 'Order Placed', date: '12 Aug, 10:42 AM', done: true },
    { label: 'Order Confirmed', date: '12 Aug, 11:05 AM', done: true },
    { label: 'Shipped', date: '13 Aug, 06:20 PM', done: true },
    { label: 'Out for Delivery', date: '15 Aug, 09:10 AM', done: false },
    { label: 'Delivered', date: 'Expected 15 Aug', done: false },
  ];

  onOrderIdInput(e: Event): void { this.orderId.set((e.target as HTMLInputElement).value); }
  onPhoneInput(e: Event): void {
    this.phone.set((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10));
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
    this.tracked.set(true);
  }

  reset(): void {
    this.orderId.set('');
    this.phone.set('');
    this.tracked.set(false);
  }
}
