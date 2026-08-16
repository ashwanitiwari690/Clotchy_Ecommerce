import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PRODUCTS } from '../data';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private readonly id = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id')))),
    { requireSync: true },
  );

  readonly product = computed(() => PRODUCTS.find(p => p.id === this.id()));

  selectedSize = signal('');
  selectedColor = signal('');
  quantity = signal(1);
  added = signal(false);

  constructor(private route: ActivatedRoute, public cart: CartService) {
    const applyDefaults = (product: ReturnType<typeof this.product>) => {
      this.selectedSize.set(product?.sizes[0] ?? '');
      this.selectedColor.set(product?.colors[0] ?? '');
      this.quantity.set(1);
    };
    applyDefaults(this.product());
    this.route.paramMap.subscribe(() => applyDefaults(this.product()));
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;
    for (let i = 0; i < this.quantity(); i++) this.cart.add(product, this.selectedSize(), this.selectedColor());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2200);
  }

  changeQuantity(delta: number): void {
    this.quantity.update(q => Math.max(1, q + delta));
  }
}
