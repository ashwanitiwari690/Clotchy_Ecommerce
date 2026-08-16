import { Product } from './models';

export const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Indian Army Brave Tee', category: 'T-Shirts', collection: 'Warrior',
    price: 849, rating: 4.8, reviews: 154, badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
    description: 'Premium cotton tee with a bold warrior-inspired front graphic. Soft, durable and made for everyday confidence.',
    sizes: ['S','M','L','XL','XXL'], colors: ['Olive','Black']
  },
  {
    id: 2, name: 'Commandos Black Tee', category: 'T-Shirts', collection: 'Warrior',
    price: 959, rating: 4.7, reviews: 92,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85',
    description: 'A structured black graphic tee with a rugged military mood and premium finish.',
    sizes: ['S','M','L','XL'], colors: ['Black']
  },
  {
    id: 3, name: 'Wanderlust Oversized Tee', category: 'Oversized', collection: 'Wanderlust',
    price: 659, rating: 4.9, reviews: 126, badge: 'TRENDING',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85',
    description: 'Relaxed oversized silhouette for travel days, city walks and weekend plans.',
    sizes: ['S','M','L','XL','XXL'], colors: ['Sand','White','Black']
  },
  {
    id: 4, name: 'Om Spiritual Hoodie', category: 'Hoodies', collection: 'Spiritual',
    price: 1199, rating: 4.9, reviews: 88,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
    description: 'Heavyweight comfort hoodie with a minimal spiritual-inspired statement.',
    sizes: ['M','L','XL','XXL'], colors: ['Black','Charcoal']
  },
  {
    id: 5, name: 'DC Batman Graphic Tee', category: 'T-Shirts', collection: 'DC Universe',
    price: 659, rating: 4.8, reviews: 211, badge: 'FAN FAVOURITE',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85',
    description: 'A clean superhero-inspired tee for fans who like their style dark, simple and iconic.',
    sizes: ['S','M','L','XL'], colors: ['Navy','Black']
  },
  {
    id: 6, name: 'Marvel Iron Man Tee', category: 'T-Shirts', collection: 'Marvel Universe',
    price: 699, rating: 4.7, reviews: 167,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85',
    description: 'Statement graphic tee inspired by the energy of superhero culture.',
    sizes: ['S','M','L','XL','XXL'], colors: ['Red','Black']
  },
  {
    id: 7, name: 'Urban Cargo Utility Pants', category: 'Cargo Pants', collection: 'Warrior',
    price: 1499, rating: 4.6, reviews: 74, badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',
    description: 'Utility-inspired cargo pants with practical pockets and a modern tapered fit.',
    sizes: ['30','32','34','36','38'], colors: ['Black','Khaki']
  },
  {
    id: 8, name: 'Street Utility Jacket', category: 'Jackets', collection: 'Wanderlust',
    price: 1899, oldPrice: 2199, rating: 4.8, reviews: 51, badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
    description: 'Layer-ready utility jacket combining clean streetwear styling with everyday function.',
    sizes: ['M','L','XL'], colors: ['Black','Olive']
  },
  {
    id: 9, name: 'Classic Polo Essential', category: 'Polo Shirts', collection: 'Designs',
    price: 799, rating: 4.6, reviews: 63,
    image: 'https://images.unsplash.com/photo-1625910513413-5fc45f4b1b48?auto=format&fit=crop&w=900&q=85',
    description: 'A polished polo with a comfortable fit that works from casual Fridays to evenings out.',
    sizes: ['S','M','L','XL','XXL'], colors: ['White','Black','Navy']
  },
  {
    id: 10, name: 'Adventure Dad Cap', category: 'Caps', collection: 'Wanderlust',
    price: 499, rating: 4.5, reviews: 48,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85',
    description: 'Everyday six-panel cap with a relaxed adventure aesthetic.',
    sizes: ['Free Size'], colors: ['Black','Beige']
  },
  {
    id: 11, name: 'Performance Training Shorts', category: 'Workout', collection: 'Workout',
    price: 899, rating: 4.7, reviews: 42,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85',
    description: 'Lightweight training shorts designed for gym sessions and active weekends.',
    sizes: ['S','M','L','XL'], colors: ['Black','Grey']
  },
  {
    id: 12, name: 'Premium Graphic Sweatshirt', category: 'Hoodies', collection: 'Designs',
    price: 1399, rating: 4.8, reviews: 97,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    description: 'Soft premium sweatshirt with a bold front graphic and relaxed streetwear fit.',
    sizes: ['M','L','XL','XXL'], colors: ['Black','Cream']
  }
];

export const CATEGORIES = [
  { name: 'T-Shirts', icon: '◉' }, { name: 'Polo Shirts', icon: '◇' },
  { name: 'Hoodies', icon: '♢' }, { name: 'Oversized', icon: '◎' },
  { name: 'Cargo Pants', icon: '▥' }, { name: 'Jackets', icon: '◇' },
  { name: 'Caps', icon: '⌒' }, { name: 'Boots', icon: '◫' }, { name: 'Accessories', icon: '▣' }
];

export const COLLECTIONS = [
  { name: 'Wanderlust', subtitle: 'EXPLORE MORE', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85' },
  { name: 'Designs', subtitle: 'MAKE A STATEMENT', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85' },
  { name: 'Spiritual', subtitle: 'FIND YOUR BALANCE', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85' },
  { name: 'Marvel Universe', subtitle: 'HERO MODE', image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=900&q=85' },
  { name: 'DC Universe', subtitle: 'DARK & ICONIC', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85' },
  { name: 'Workout', subtitle: 'TRAIN HARD', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85' }
];