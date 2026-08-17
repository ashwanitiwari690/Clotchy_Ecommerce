export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  variant?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

export const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'packed', 'shipped',
  'out-for-delivery', 'delivered', 'cancelled', 'returned', 'refunded'
];
