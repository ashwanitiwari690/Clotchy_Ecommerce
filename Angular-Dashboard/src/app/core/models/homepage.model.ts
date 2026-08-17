import { EntityStatus } from './common.model';

export interface HeroBanner {
  id: string;
  desktopImage: string;
  mobileImage: string;
  heading: string;
  subheading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  startDate: string;
  endDate: string;
  status: EntityStatus;
  displayOrder: number;
}

export interface HomeCategoryFeature {
  id: string;
  categoryId: string;
  displayOrder: number;
  status: EntityStatus;
}

export interface HomeCollectionFeature {
  id: string;
  collectionId: string;
  shortDescription: string;
  link: string;
  displayOrder: number;
  status: EntityStatus;
}

export interface BestSellerFeature {
  id: string;
  productId: string;
  displayOrder: number;
  status: EntityStatus;
}

export interface HomePromotion {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  buttonText: string;
  buttonUrl: string;
  discount: string;
  startDate: string;
  endDate: string;
  status: EntityStatus;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage: string;
  rating: number;
  review: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
  displayOrder: number;
}

export interface CommunityImage {
  id: string;
  image: string;
  title: string;
  description: string;
  socialUrl: string;
  displayOrder: number;
  status: EntityStatus;
}

export interface NewsletterConfig {
  title: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
  placeholderText: string;
  status: EntityStatus;
}
