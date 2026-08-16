import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from './models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'clotchcy-cart';
  readonly items = signal<CartItem[]>(this.read());

  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));
  readonly shipping = computed(() => this.subtotal() >= 999 || this.subtotal() === 0 ? 0 : 79);
  readonly total = computed(() => this.subtotal() + this.shipping());

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

  updateQuantity(id: number, quantity: number, size: string, color: string): void {
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