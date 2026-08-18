import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../catalog.service';
import { CartService } from '../cart.service';
import { Product } from '../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
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

  constructor(private route: ActivatedRoute, private catalog: CatalogService, public cart: CartService) {
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
