import { BestSellerFeature, CommunityImage, HeroBanner, HomeCategoryFeature, HomeCollectionFeature, HomePromotion, NewsletterConfig, Testimonial } from '../models/homepage.model';
import { placeholderImage } from '../models/common.model';

export const HERO_BANNERS_MOCK: HeroBanner[] = [
  {
    id: 'hero-001',
    desktopImage: placeholderImage('hero-legend-desktop', 1920, 800),
    mobileImage: placeholderImage('hero-legend-mobile', 900, 1200),
    heading: 'LEGENDARY LOOKS. FOR EVERY LEGEND.',
    subheading: 'New Season Drop',
    description: 'Premium fashion essentials engineered for the streets and beyond.',
    primaryButtonText: 'Shop Now', primaryButtonLink: '/shop',
    secondaryButtonText: 'Explore Collections', secondaryButtonLink: '/collections',
    startDate: '2026-08-01', endDate: '2026-09-30', status: 'active', displayOrder: 1,
  },
  {
    id: 'hero-002',
    desktopImage: placeholderImage('hero-winter-desktop', 1920, 800),
    mobileImage: placeholderImage('hero-winter-mobile', 900, 1200),
    heading: 'WINTER ARMOR. BUILT TO LAST.',
    subheading: 'Winter Collection',
    description: 'Layer up with premium fleece and shearling pieces.',
    primaryButtonText: 'Shop Winter', primaryButtonLink: '/collections/winter-collection',
    secondaryButtonText: '', secondaryButtonLink: '',
    startDate: '2026-11-01', endDate: '2027-01-31', status: 'inactive', displayOrder: 2,
  },
];

export const HOME_CATEGORY_FEATURES_MOCK: HomeCategoryFeature[] = [
  { id: 'hcf-001', categoryId: 'cat-tshirts', displayOrder: 1, status: 'active' },
  { id: 'hcf-002', categoryId: 'cat-hoodies', displayOrder: 2, status: 'active' },
  { id: 'hcf-003', categoryId: 'cat-jeans', displayOrder: 3, status: 'active' },
  { id: 'hcf-004', categoryId: 'cat-jackets', displayOrder: 4, status: 'active' },
  { id: 'hcf-005', categoryId: 'cat-footwear', displayOrder: 5, status: 'active' },
  { id: 'hcf-006', categoryId: 'cat-accessories', displayOrder: 6, status: 'active' },
];

export const HOME_COLLECTION_FEATURES_MOCK: HomeCollectionFeature[] = [
  { id: 'hcl-001', collectionId: 'col-streetwear', shortDescription: 'Bold silhouettes for the city.', link: '/collections/streetwear', displayOrder: 1, status: 'active' },
  { id: 'hcl-002', collectionId: 'col-new-arrivals', shortDescription: 'Fresh drops, every week.', link: '/collections/new-arrivals', displayOrder: 2, status: 'active' },
  { id: 'hcl-003', collectionId: 'col-premium', shortDescription: 'Elevated fabrics, refined cuts.', link: '/collections/premium-collection', displayOrder: 3, status: 'active' },
  { id: 'hcl-004', collectionId: 'col-winter', shortDescription: 'Layered warmth without losing the edge.', link: '/collections/winter-collection', displayOrder: 4, status: 'inactive' },
];

export const BEST_SELLER_FEATURES_MOCK: BestSellerFeature[] = [
  { id: 'bsf-001', productId: 'prod-010', displayOrder: 1, status: 'active' },
  { id: 'bsf-002', productId: 'prod-004', displayOrder: 2, status: 'active' },
  { id: 'bsf-003', productId: 'prod-003', displayOrder: 3, status: 'active' },
  { id: 'bsf-004', productId: 'prod-001', displayOrder: 4, status: 'active' },
  { id: 'bsf-005', productId: 'prod-015', displayOrder: 5, status: 'active' },
  { id: 'bsf-006', productId: 'prod-006', displayOrder: 6, status: 'active' },
];

export const HOME_PROMOTIONS_MOCK: HomePromotion[] = [
  { id: 'promo-001', title: 'Flat 50% Off', description: 'On select streetwear essentials, this week only.', bannerImage: placeholderImage('promo-flat50', 1600, 700), buttonText: 'Shop the Sale', buttonUrl: '/sale', discount: '50%', startDate: '2026-08-10', endDate: '2026-08-24', status: 'active' },
  { id: 'promo-002', title: 'Free Shipping', description: 'On all orders above ₹1999, no code needed.', bannerImage: placeholderImage('promo-freeship', 1600, 700), buttonText: 'Start Shopping', buttonUrl: '/shop', discount: 'Free Shipping', startDate: '2026-08-01', endDate: '2026-12-31', status: 'active' },
  { id: 'promo-003', title: 'New Collection', description: 'Discover the Trending Collection before everyone else.', bannerImage: placeholderImage('promo-newcol', 1600, 700), buttonText: 'Explore', buttonUrl: '/collections/trending-collection', discount: '', startDate: '2026-07-15', endDate: '2026-09-15', status: 'inactive' },
];

export const TESTIMONIALS_MOCK: Testimonial[] = [
  { id: 'test-001', customerName: 'Ananya Sharma', customerImage: placeholderImage('cust-001', 150, 150), rating: 5, review: 'Clotchy completely changed how I think about everyday fashion. The fit and fabric quality is unmatched.', date: '2026-07-30', status: 'approved', displayOrder: 1 },
  { id: 'test-002', customerName: 'Karan Malhotra', customerImage: placeholderImage('cust-010', 150, 150), rating: 5, review: 'Fast delivery, premium packaging, and the hoodie is honestly the best I own.', date: '2026-07-22', status: 'approved', displayOrder: 2 },
  { id: 'test-003', customerName: 'Priya Nair', customerImage: placeholderImage('cust-003', 150, 150), rating: 4, review: 'Love the streetwear drops — always something fresh worth adding to cart.', date: '2026-07-10', status: 'approved', displayOrder: 3 },
  { id: 'test-004', customerName: 'Rohan Mehta', customerImage: placeholderImage('cust-002', 150, 150), rating: 5, review: 'The denim quality rivals brands twice the price. Customer for life.', date: '2026-06-28', status: 'pending', displayOrder: 4 },
  { id: 'test-005', customerName: 'Kavya Reddy', customerImage: placeholderImage('cust-005', 150, 150), rating: 4, review: 'Sizing guide was spot on, and returns were completely hassle-free.', date: '2026-06-15', status: 'approved', displayOrder: 5 },
];

export const COMMUNITY_IMAGES_MOCK: CommunityImage[] = [
  { id: 'comm-001', image: placeholderImage('community-1', 500, 500), title: 'Streetwear season', description: 'Tagged by @rohanwears', socialUrl: 'https://instagram.com/clotchy', displayOrder: 1, status: 'active' },
  { id: 'comm-002', image: placeholderImage('community-2', 500, 500), title: 'City nights', description: 'Tagged by @kavya.style', socialUrl: 'https://instagram.com/clotchy', displayOrder: 2, status: 'active' },
  { id: 'comm-003', image: placeholderImage('community-3', 500, 500), title: 'Denim on denim', description: 'Tagged by @karan.m', socialUrl: 'https://instagram.com/clotchy', displayOrder: 3, status: 'active' },
  { id: 'comm-004', image: placeholderImage('community-4', 500, 500), title: 'Weekend fits', description: 'Tagged by @priya.n', socialUrl: 'https://instagram.com/clotchy', displayOrder: 4, status: 'active' },
  { id: 'comm-005', image: placeholderImage('community-5', 500, 500), title: 'Layer game strong', description: 'Tagged by @ishita.v', socialUrl: 'https://instagram.com/clotchy', displayOrder: 5, status: 'active' },
  { id: 'comm-006', image: placeholderImage('community-6', 500, 500), title: 'Minimal mood', description: 'Tagged by @arjun.k', socialUrl: 'https://instagram.com/clotchy', displayOrder: 6, status: 'inactive' },
];

export const NEWSLETTER_CONFIG_MOCK: NewsletterConfig = {
  title: 'Join the Clotchy family!',
  description: 'Sign up for early access to new drops, exclusive discounts and style edits.',
  backgroundImage: placeholderImage('newsletter-bg', 1600, 600),
  buttonText: 'Subscribe',
  placeholderText: 'Enter your email address',
  status: 'active',
};
