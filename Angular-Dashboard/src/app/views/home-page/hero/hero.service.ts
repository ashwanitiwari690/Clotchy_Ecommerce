import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HeroBanner } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}home/hero`;
  private readonly store = new HttpCrudStore<HeroBanner>(this.http, this.baseUrl);

  list(): Observable<HeroBanner[]> { return this.store.list(); }
  get all(): HeroBanner[] { return this.store.all; }
  getById(id: string): HeroBanner | undefined { return this.store.getById(id); }
  create(data: Omit<HeroBanner, 'id'>): Observable<HeroBanner> { return this.store.create(data); }
  update(id: string, data: Partial<HeroBanner>): Observable<HeroBanner | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    this.http.post(`${this.baseUrl}/${id}/move`, { direction }).subscribe(() => this.store.refresh());
  }
}
