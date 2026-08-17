import { Collection } from '../models/collection.model';
import { placeholderImage } from '../models/common.model';

export const COLLECTIONS_MOCK: Collection[] = [
  { id: 'col-winter', name: 'Winter Collection', slug: 'winter-collection', description: 'Layered warmth without losing the edge.', image: placeholderImage('col-winter', 800, 600), startDate: '2026-11-01', endDate: '2027-02-28', status: 'active', featured: true },
  { id: 'col-summer', name: 'Summer Collection', slug: 'summer-collection', description: 'Lightweight fits for the heat.', image: placeholderImage('col-summer', 800, 600), startDate: '2026-04-01', endDate: '2026-08-31', status: 'active', featured: false },
  { id: 'col-streetwear', name: 'Streetwear', slug: 'streetwear', description: 'Bold silhouettes for the city.', image: placeholderImage('col-streetwear', 800, 600), startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', featured: true },
  { id: 'col-new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', description: 'Fresh drops, every week.', image: placeholderImage('col-new', 800, 600), startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', featured: true },
  { id: 'col-premium', name: 'Premium Collection', slug: 'premium-collection', description: 'Elevated fabrics, refined cuts.', image: placeholderImage('col-premium', 800, 600), startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', featured: false },
  { id: 'col-trending', name: 'Trending Collection', slug: 'trending-collection', description: 'What everyone is wearing right now.', image: placeholderImage('col-trending', 800, 600), startDate: '2026-01-01', endDate: '2026-12-31', status: 'inactive', featured: false },
];

export function getCollectionById(id: string): Collection | undefined {
  return COLLECTIONS_MOCK.find(c => c.id === id);
}
