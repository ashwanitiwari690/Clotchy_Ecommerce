import { EntityStatus } from './common.model';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: EntityStatus;
  featured: boolean;
  /** Populated by the API on read; ignored on write. */
  productCount?: number;
}
