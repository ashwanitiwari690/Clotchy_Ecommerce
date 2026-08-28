import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { CartItem, Product } from './models';
import { environment } from '../environments/environment';

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  discount?: number;
  couponCode?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface CouponValidation {
  discount: number;
  freeShipping: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'clotchcy-cart';
  readonly items = signal<CartItem[]>(this.read());

  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));

  readonly couponCode = signal('');
  readonly discount = signal(0);
  readonly freeShippingFromCoupon = signal(false);
  readonly couponError = signal('');
  readonly applyingCoupon = signal(false);

  readonly shipping = computed(() => {
    if (this.freeShippingFromCoupon()) return 0;
    return this.subtotal() >= 999 || this.subtotal() === 0 ? 0 : 79;
  });
  readonly total = computed(() => Math.max(0, this.subtotal() - this.discount() + this.shipping()));

  add(product: Product, size = product.sizes[0], color = product.colors[0]): void {
    const current = this.items();
    const index = current.findIndex(i => i.id === product.id && i.selectedSize === size && i.selectedColor === color);
    const next = [...current];
    if (index >= 0) {
      next[index] = { ...next[index], quantity: next[index].quantity + 1 };
    } else {
      next.push({ ...product, quantity: 1, selectedSize: size, selectedColor: color });
    }
    this.save(next);
  }

  updateQuantity(id: string, quantity: number, size: string, color: string): void {
    const next = this.items()
      .map(item => item.id === id && item.selectedSize === size && item.selectedColor === color
        ? { ...item, quantity: Math.max(1, quantity) } : item);
    this.save(next);
  }

  remove(item: CartItem): void {
    this.save(this.items().filter(i => !(i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor)));
  }

  clear(): void {
    this.save([]);
    this.couponCode.set('');
    this.discount.set(0);
    this.freeShippingFromCoupon.set(false);
    this.couponError.set('');
  }

  // Previews a coupon's discount against the current subtotal without
  // creating an order - actual redemption/usage-tracking happens server-side
  // inside `checkout()` once the order is actually placed.
  applyCoupon(code: string): void {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    this.couponError.set('');
    this.applyingCoupon.set(true);
    this.http
      .post<ApiEnvelope<CouponValidation>>(`${environment.apiUrl}/coupons/validate`, { code: trimmed, subtotal: this.subtotal() }, { withCredentials: true })
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.applyingCoupon.set(false);
          this.couponCode.set(trimmed);
          this.discount.set(res.discount);
          this.freeShippingFromCoupon.set(res.freeShipping);
        },
        error: (err) => {
          this.applyingCoupon.set(false);
          this.couponCode.set('');
          this.discount.set(0);
          this.freeShippingFromCoupon.set(false);
          this.couponError.set(err.error?.message ?? 'Could not apply this coupon.');
        },
      });
  }

  removeCoupon(): void {
    this.couponCode.set('');
    this.discount.set(0);
    this.freeShippingFromCoupon.set(false);
    this.couponError.set('');
  }

  // Places the current cart as a real order (requires a logged-in user with a
  // saved shipping address - server rejects otherwise) and empties the cart on
  // success. Prices are recomputed server-side from the product catalog, never
  // trusted from the client.
  checkout(): Observable<PlacedOrder> {
    const payload = {
      items: this.items().map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.selectedSize || undefined,
        color: item.selectedColor || undefined,
      })),
      couponCode: this.couponCode() || undefined,
    };
    return this.http.post<ApiEnvelope<PlacedOrder>>(`${environment.apiUrl}/orders`, payload, { withCredentials: true }).pipe(
      map((res) => res.data),
      tap(() => this.clear()),
    );
  }

  private save(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private read(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]') as CartItem[];
    } catch {
      return [];
    }
  }
}