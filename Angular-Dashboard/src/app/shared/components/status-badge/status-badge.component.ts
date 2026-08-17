import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

const DEFAULT_STATUS_COLORS: Record<string, string> = {
  active: 'success', published: 'success', paid: 'success', approved: 'success',
  delivered: 'success', resolved: 'success', 'in-stock': 'success',
  inactive: 'secondary', draft: 'secondary', archived: 'secondary', closed: 'secondary',
  read: 'secondary', hidden: 'secondary', low: 'secondary',
  pending: 'warning', 'low-stock': 'warning', 'waiting-customer': 'warning', high: 'warning',
  processing: 'info', confirmed: 'info', packed: 'info', shipped: 'info',
  'out-for-delivery': 'info', 'in-progress': 'info', medium: 'info', replied: 'info',
  open: 'primary', new: 'primary',
  cancelled: 'danger', returned: 'danger', refunded: 'danger', rejected: 'danger',
  failed: 'danger', 'out-of-stock': 'danger', blocked: 'danger', expired: 'danger', urgent: 'danger',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge rounded-pill status-badge" [ngClass]="'text-bg-' + resolvedColor">{{ status | titlecase }}</span>`,
  styles: [`.status-badge { font-weight: 500; padding: 0.4em 0.85em; text-transform: capitalize; }`],
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() statusColorMap?: Record<string, string>;

  get resolvedColor(): string {
    const map = this.statusColorMap ?? DEFAULT_STATUS_COLORS;
    return map[this.status] ?? 'secondary';
  }
}
