import { signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { generateId } from '../models/common.model';

/** Reusable in-memory CRUD store backing every feature's mock service. Swap internals for HttpClient later without touching component code. */
export class MockCrudStore<T extends { id: string }> {
  private readonly items: WritableSignal<T[]>;

  constructor(initial: T[], private readonly idPrefix: string) {
    this.items = signal<T[]>([...initial]);
  }

  list(): Observable<T[]> {
    return of(this.items());
  }

  get all(): T[] {
    return this.items();
  }

  getById(id: string): T | undefined {
    return this.items().find((i) => i.id === id);
  }

  create(data: Omit<T, 'id'>): Observable<T> {
    const entity = { ...data, id: generateId(this.idPrefix) } as T;
    this.items.update((list) => [entity, ...list]);
    return of(entity);
  }

  update(id: string, data: Partial<T>): Observable<T | undefined> {
    let updated: T | undefined;
    this.items.update((list) => list.map((i) => {
      if (i.id !== id) return i;
      updated = { ...i, ...data };
      return updated;
    }));
    return of(updated);
  }

  delete(id: string): Observable<boolean> {
    this.items.update((list) => list.filter((i) => i.id !== id));
    return of(true);
  }

  replaceAll(list: T[]): void {
    this.items.set([...list]);
  }
}
