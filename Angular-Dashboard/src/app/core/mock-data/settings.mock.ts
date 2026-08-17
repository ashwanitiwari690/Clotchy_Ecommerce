import { StoreSettings } from '../models/settings.model';
import { placeholderImage } from '../models/common.model';

export const STORE_SETTINGS_MOCK: StoreSettings = {
  general: {
    storeName: 'Clotchy',
    logo: placeholderImage('clotchy-logo', 200, 80),
    favicon: placeholderImage('clotchy-favicon', 64, 64),
    email: 'support@clotchy.com',
    phone: '+91 1800 123 4567',
    address: '4th Floor, Fashion House, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
  },
  shipping: {
    methods: [
      { name: 'Standard Delivery', charge: 99 },
      { name: 'Express Delivery', charge: 199 },
    ],
    freeShippingThreshold: 1999,
  },
  payment: {
    methods: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'],
    currency: 'INR',
    taxRate: 5,
  },
  tax: {
    taxName: 'GST',
    taxRate: 5,
    pricesIncludeTax: false,
  },
  notifications: {
    emailNotifications: true,
    orderNotifications: true,
    customerNotifications: true,
  },
  social: {
    instagram: 'https://instagram.com/clotchy',
    facebook: 'https://facebook.com/clotchy',
    youtube: 'https://youtube.com/@clotchy',
    twitter: 'https://x.com/clotchy',
  },
  adminProfile: {
    name: 'Admin User',
    email: 'admin@clotchy.com',
    phone: '+91 98765 00000',
    avatar: placeholderImage('admin-profile', 150, 150),
  },
};
