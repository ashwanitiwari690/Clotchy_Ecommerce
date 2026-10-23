import { StoreSettings } from '../models/settings.model';
import { placeholderImage } from '../models/common.model';

export const STORE_SETTINGS_MOCK: StoreSettings = {
  general: {
    storeName: 'Cotloom',
    logo: placeholderImage('cotloom-logo', 200, 80),
    favicon: placeholderImage('cotloom-favicon', 64, 64),
    email: 'support@cotloom.com',
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
    instagram: 'https://instagram.com/cotloom',
    facebook: 'https://facebook.com/cotloom',
    youtube: 'https://youtube.com/@cotloom',
    twitter: 'https://x.com/cotloom',
  },
  adminProfile: {
    name: 'Admin User',
    email: 'admin@cotloom.com',
    phone: '+91 98765 00000',
    avatar: placeholderImage('admin-profile', 150, 150),
  },
};
