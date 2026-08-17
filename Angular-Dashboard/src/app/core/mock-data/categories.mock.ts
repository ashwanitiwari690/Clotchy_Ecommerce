import { Category } from '../models/category.model';
import { placeholderImage } from '../models/common.model';

export const CATEGORIES_MOCK: Category[] = [
  { id: 'cat-tshirts', name: 'T-Shirts', slug: 't-shirts', image: placeholderImage('cat-tshirts', 400, 400), parentId: null, sortOrder: 1, status: 'active', description: 'Everyday essential tees.' },
  { id: 'cat-shirts', name: 'Shirts', slug: 'shirts', image: placeholderImage('cat-shirts', 400, 400), parentId: null, sortOrder: 2, status: 'active', description: 'Formal and casual shirts.' },
  { id: 'cat-jeans', name: 'Jeans', slug: 'jeans', image: placeholderImage('cat-jeans', 400, 400), parentId: null, sortOrder: 3, status: 'active', description: 'Denim for every fit.' },
  { id: 'cat-jackets', name: 'Jackets', slug: 'jackets', image: placeholderImage('cat-jackets', 400, 400), parentId: null, sortOrder: 4, status: 'active', description: 'Outerwear for every season.' },
  { id: 'cat-hoodies', name: 'Hoodies', slug: 'hoodies', image: placeholderImage('cat-hoodies', 400, 400), parentId: null, sortOrder: 5, status: 'active', description: 'Cozy streetwear staples.' },
  { id: 'cat-dresses', name: 'Dresses', slug: 'dresses', image: placeholderImage('cat-dresses', 400, 400), parentId: null, sortOrder: 6, status: 'active', description: 'Dresses for every occasion.' },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', image: placeholderImage('cat-accessories', 400, 400), parentId: null, sortOrder: 7, status: 'active', description: 'Bags, belts and more.' },
  { id: 'cat-footwear', name: 'Footwear', slug: 'footwear', image: placeholderImage('cat-footwear', 400, 400), parentId: null, sortOrder: 8, status: 'active', description: 'Sneakers and shoes.' },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES_MOCK.find(c => c.id === id);
}
