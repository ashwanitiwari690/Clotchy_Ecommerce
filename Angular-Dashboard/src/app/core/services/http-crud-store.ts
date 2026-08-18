import { HttpClient } from '@angular/common/http';
import { WritableSignal, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

/**
 * Drop-in replacement for `MockCrudStore` with the same public surface
 * (list/all/getById/create/update/delete/replaceAll), backed by `HttpClient`
 * against a real REST resource instead of a static in-memory array. Every
 * mutation refetches the full list afterwards, so the cached signal never
 * drifts from the server - simple and correct for the list sizes this admin
 * panel deals with.
 */
export class HttpCrudStore<T extends { id: string }> {
  private readonly items: WritableSignal<T[]> = signal<T[]>([]);

  constructor(private readonly http: HttpClient, private readonly baseUrl: string) {
    this.refresh();
  }

  refresh(): void {
    this.http.get<ApiEnvelope<T[]>>(this.baseUrl, { withCredentials: true }).subscribe((res) => this.items.set(res.data));
  }

  list(): Observable<T[]> {
    return this.http.get<ApiEnvelope<T[]>>(this.baseUrl, { withCredentials: true }).pipe(
      tap((res) => this.items.set(res.data)),
      map((res) => res.data),
    );
  }

  get all(): T[] {
    return this.items();
  }

  getById(id: string): T | undefined {
    return this.items().find((i) => i.id === id);
  }

  /** For detail/edit pages that may be opened before the list has loaded (direct navigation). */
  getByIdAsync(id: string): Observable<T> {
    return this.http
      .get<ApiEnvelope<T>>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(map((res) => res.data));
  }

  create(data: Omit<T, 'id'>): Observable<T> {
    return this.http.post<ApiEnvelope<T>>(this.baseUrl, data, { withCredentials: true }).pipe(
      tap(() => this.refresh()),
      map((res) => res.data),
    );
  }

  update(id: string, data: Partial<T>): Observable<T | undefined> {
    return this.http.patch<ApiEnvelope<T>>(`${this.baseUrl}/${id}`, data, { withCredentials: true }).pipe(
      tap(() => this.refresh()),
      map((res) => res.data),
    );
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true }).pipe(
      tap(() => this.refresh()),
      map(() => true),
    );
  }

  replaceAll(list: T[]): void {
    this.items.set([...list]);
  }
}
