export type DiscountType = 'percentage' | 'fixed' | 'free-shipping';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrder: number;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: 'all' | 'category' | 'product';
  targetName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

export interface MarketingBanner {
  id: string;
  title: string;
  image: string;
  link: string;
  position: 'top' | 'sidebar' | 'popup';
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}
