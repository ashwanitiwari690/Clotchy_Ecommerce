export interface StoreSettings {
  general: {
    storeName: string;
    logo: string;
    favicon: string;
    email: string;
    phone: string;
    address: string;
  };
  shipping: {
    methods: { name: string; charge: number }[];
    freeShippingThreshold: number;
  };
  payment: {
    methods: string[];
    currency: string;
    taxRate: number;
  };
  tax: {
    taxName: string;
    taxRate: number;
    pricesIncludeTax: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    orderNotifications: boolean;
    customerNotifications: boolean;
  };
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  adminProfile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}
