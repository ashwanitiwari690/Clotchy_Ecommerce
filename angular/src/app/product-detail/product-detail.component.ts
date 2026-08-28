import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CatalogService } from '../catalog.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { ReviewService, ProductReview } from '../review.service';
import { Product } from '../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  readonly product = signal<Product | undefined>(undefined);
  readonly loading = signal(true);

  selectedSize = signal('');
  selectedColor = signal('');
  quantity = signal(1);
  added = signal(false);

  readonly reviews = signal<ProductReview[]>([]);
  readonly reviewsAverage = signal(0);
  readonly reviewsCount = signal(0);
  readonly loadingReviews = signal(true);

  readonly reviewRating = signal(0);
  readonly reviewComment = signal('');
  readonly submittingReview = signal(false);
  readonly reviewError = signal('');
  readonly reviewSubmitted = signal(false);

  constructor(
    private route: ActivatedRoute,
    private catalog: CatalogService,
    public cart: CartService,
    public auth: AuthService,
    private reviewSvc: ReviewService,
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this.loading.set(true);
      this.catalog.getProduct(id).subscribe({
        next: (product) => {
          this.product.set(product);
          this.selectedSize.set(product.sizes[0] ?? '');
          this.selectedColor.set(product.colors[0] ?? '');
          this.quantity.set(1);
          this.loading.set(false);
        },
        error: () => {
          this.product.set(undefined);
          this.loading.set(false);
        },
      });
      this.loadReviews(id);
    });
  }

  private loadReviews(productId: string): void {
    this.loadingReviews.set(true);
    this.reviewSubmitted.set(false);
    this.reviewSvc.list(productId).subscribe({
      next: (res) => {
        this.reviews.set(res.reviews);
        this.reviewsAverage.set(res.average);
        this.reviewsCount.set(res.count);
        this.loadingReviews.set(false);
      },
      error: () => this.loadingReviews.set(false),
    });
  }

  get hasReviewed(): boolean {
    const userId = this.auth.user()?.id;
    return !!userId && this.reviews().some((r) => r.customerId === userId);
  }

  setReviewRating(value: number): void {
    this.reviewRating.set(value);
  }

  onReviewCommentInput(e: Event): void {
    this.reviewComment.set((e.target as HTMLTextAreaElement).value);
  }

  submitReview(): void {
    const product = this.product();
    if (!product) return;
    if (this.reviewRating() < 1) {
      this.reviewError.set('Please select a star rating.');
      return;
    }
    if (!this.reviewComment().trim()) {
      this.reviewError.set('Please write a short review.');
      return;
    }
    this.reviewError.set('');
    this.submittingReview.set(true);
    this.reviewSvc.submit(product.id, this.reviewRating(), this.reviewComment().trim()).subscribe({
      next: () => {
        this.submittingReview.set(false);
        this.reviewSubmitted.set(true);
        this.reviewRating.set(0);
        this.reviewComment.set('');
        this.loadReviews(product.id);
      },
      error: (err: HttpErrorResponse) => {
        this.submittingReview.set(false);
        this.reviewError.set(err.error?.message ?? 'Could not submit your review. Please try again.');
      },
    });
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;
    for (let i = 0; i < this.quantity(); i++) this.cart.add(product, this.selectedSize(), this.selectedColor());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2200);
  }

  changeQuantity(delta: number): void {
    this.quantity.update((q) => Math.max(1, q + delta));
  }
}
