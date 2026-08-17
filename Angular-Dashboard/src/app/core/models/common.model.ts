export type EntityStatus = 'active' | 'inactive';

export interface StatusColorMap {
  [status: string]: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PagedResult<T> {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length };
}

/** Deterministic seeded placeholder image (no local assets required). */
export function placeholderImage(seed: string, w = 600, h = 800): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
