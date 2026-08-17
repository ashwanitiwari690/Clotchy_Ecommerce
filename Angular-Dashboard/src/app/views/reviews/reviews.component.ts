import { Component, inject, signal } from '@angular/core';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { ReviewService } from './review.service';
import { Review } from '../../core/models/review.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';

type ReviewFilter = 'all' | 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [SharedUIModule],
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent {
  private readonly svc = inject(ReviewService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  activeFilter = signal<ReviewFilter>('all');
  readonly stars = [1, 2, 3, 4, 5];

  get reviews(): Review[] {
    const term = this.search.trim().toLowerCase();
    const filter = this.activeFilter();
    return [...this.svc.all]
      .filter((r) => filter === 'all' || r.status === filter)
      .filter((r) => !term || r.customerName.toLowerCase().includes(term) || r.productName.toLowerCase().includes(term) || r.comment.toLowerCase().includes(term))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  get counts(): Record<ReviewFilter, number> {
    const all = this.svc.all;
    return {
      all: all.length,
      pending: all.filter((r) => r.status === 'pending').length,
      approved: all.filter((r) => r.status === 'approved').length,
      rejected: all.filter((r) => r.status === 'rejected').length,
    };
  }

  setFilter(filter: ReviewFilter): void {
    this.activeFilter.set(filter);
  }

  onSearch(value: string): void {
    this.search = value;
  }

  approve(review: Review): void {
    this.svc.updateStatus(review.id, 'approved').subscribe(() => this.toast.success('Review approved.'));
  }

  reject(review: Review): void {
    this.svc.updateStatus(review.id, 'rejected').subscribe(() => this.toast.success('Review rejected.'));
  }

  remove(review: Review): void {
    this.confirm.confirm({ message: `Delete this review from ${review.customerName}? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(review.id).subscribe(() => this.toast.success('Review deleted.'));
      });
  }
}
