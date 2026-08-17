import { EntityStatus } from './common.model';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentId: string | null;
  sortOrder: number;
  status: EntityStatus;
  description?: string;
}
