import { Coupon, Discount, MarketingBanner, MarketingCampaign } from '../models/marketing.model';
import { placeholderImage } from '../models/common.model';

export const COUPONS_MOCK: Coupon[] = [
  { id: 'cpn-001', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrder: 999, maxDiscount: 500, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 1000, usedCount: 412, status: 'active' },
  { id: 'cpn-002', code: 'FLAT200', discountType: 'fixed', discountValue: 200, minOrder: 1499, maxDiscount: null, startDate: '2026-06-01', endDate: '2026-09-30', usageLimit: 500, usedCount: 288, status: 'active' },
  { id: 'cpn-003', code: 'FREESHIP', discountType: 'free-shipping', discountValue: 0, minOrder: 0, maxDiscount: null, startDate: '2026-08-01', endDate: '2026-08-31', usageLimit: 2000, usedCount: 940, status: 'active' },
  { id: 'cpn-004', code: 'SUMMER25', discountType: 'percentage', discountValue: 25, minOrder: 1999, maxDiscount: 1000, startDate: '2026-04-01', endDate: '2026-07-31', usageLimit: 800, usedCount: 800, status: 'expired' },
  { id: 'cpn-005', code: 'VIP500', discountType: 'fixed', discountValue: 500, minOrder: 3999, maxDiscount: null, startDate: '2026-08-01', endDate: '2026-12-31', usageLimit: 200, usedCount: 34, status: 'inactive' },
];

export const DISCOUNTS_MOCK: Discount[] = [
  { id: 'disc-001', name: 'Hoodies Season Discount', type: 'percentage', value: 15, appliesTo: 'category', targetName: 'Hoodies', startDate: '2026-08-01', endDate: '2026-08-31', status: 'active' },
  { id: 'disc-002', name: 'Footwear Clearance', type: 'fixed', value: 300, appliesTo: 'category', targetName: 'Footwear', startDate: '2026-08-10', endDate: '2026-09-10', status: 'active' },
  { id: 'disc-003', name: 'Sitewide Independence Sale', type: 'percentage', value: 20, appliesTo: 'all', targetName: 'All Products', startDate: '2026-08-10', endDate: '2026-08-17', status: 'inactive' },
];

export const MARKETING_BANNERS_MOCK: MarketingBanner[] = [
  { id: 'mb-001', title: 'Top Bar — Free Shipping Over ₹1999', image: placeholderImage('mb-top', 1600, 200), link: '/shop', position: 'top', startDate: '2026-08-01', endDate: '2026-12-31', status: 'active' },
  { id: 'mb-002', title: 'Sidebar — Refer a Friend', image: placeholderImage('mb-sidebar', 400, 600), link: '/referral', position: 'sidebar', startDate: '2026-08-01', endDate: '2026-12-31', status: 'active' },
  { id: 'mb-003', title: 'Popup — First Order Discount', image: placeholderImage('mb-popup', 800, 900), link: '/shop', position: 'popup', startDate: '2026-08-01', endDate: '2026-09-30', status: 'inactive' },
];

export const MARKETING_CAMPAIGNS_MOCK: MarketingCampaign[] = [
  { id: 'camp-001', name: 'Independence Day Sale', description: 'Sitewide promotion across app, email and social.', startDate: '2026-08-10', endDate: '2026-08-17', status: 'active' },
  { id: 'camp-002', name: 'Back to Campus', description: 'Targeted promotion for the campus/streetwear segment.', startDate: '2026-08-20', endDate: '2026-09-05', status: 'inactive' },
];
