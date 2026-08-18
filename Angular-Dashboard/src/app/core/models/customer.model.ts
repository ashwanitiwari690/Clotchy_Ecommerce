export interface CustomerAddress {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registeredAt: string;
  groupId: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  addresses: CustomerAddress[];
  wishlistProductIds: string[];
  /** Only populated on the customer-detail read, not the list. */
  orders?: import('./order.model').Order[];
}

export interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  customerCount: number;
}
