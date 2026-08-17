import { Brand, ProductAttribute } from '../models/brand.model';
import { placeholderImage } from '../models/common.model';

export const BRANDS_MOCK: Brand[] = [
  { id: 'brand-clotchy-originals', name: 'Clotchy Originals', slug: 'clotchy-originals', logo: placeholderImage('brand-co', 200, 200), status: 'active' },
  { id: 'brand-urban-edge', name: 'Urban Edge', slug: 'urban-edge', logo: placeholderImage('brand-ue', 200, 200), status: 'active' },
  { id: 'brand-noir-label', name: 'Noir Label', slug: 'noir-label', logo: placeholderImage('brand-nl', 200, 200), status: 'active' },
  { id: 'brand-denim-co', name: 'Denim Co.', slug: 'denim-co', logo: placeholderImage('brand-dc', 200, 200), status: 'inactive' },
];

export function getBrandById(id: string | null): Brand | undefined {
  return id ? BRANDS_MOCK.find(b => b.id === id) : undefined;
}

export const ATTRIBUTES_MOCK: ProductAttribute[] = [
  { id: 'attr-size', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'attr-color', name: 'Color', values: ['Black', 'White', 'Blue', 'Grey', 'Olive', 'Beige'] },
  { id: 'attr-material', name: 'Material', values: ['Cotton', 'Denim', 'Polyester', 'Fleece', 'Linen'] },
];
