export type ProductStatus = 'draft' | 'published' | 'out-of-stock' | 'archived';

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  material?: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  brandId: string | null;
  categoryId: string;
  collectionIds: string[];
  tags: string[];

  price: number;
  salePrice: number | null;
  costPrice: number;
  tax: number;
  discount: number;

  stock: number;
  lowStockThreshold: number;
  availability: 'in-stock' | 'out-of-stock' | 'backorder';
  allowBackorder: boolean;

  mainImage: string;
  thumbnail: string;
  gallery: string[];

  variants: ProductVariant[];

  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  keywords: string;

  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;

  unitsSold: number;
  revenue: number;
  rating: number;
  reviewCount: number;

  createdAt: string;
}
