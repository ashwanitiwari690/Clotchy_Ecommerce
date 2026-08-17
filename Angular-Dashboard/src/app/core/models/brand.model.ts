import { EntityStatus } from './common.model';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  status: EntityStatus;
}



export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}
