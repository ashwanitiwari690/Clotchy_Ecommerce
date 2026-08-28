import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MarketingBanner } from '../../../core/models/marketing.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MarketingBannerService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<MarketingBanner>(this.http, `${environment.ECOMMERCE_API}marketing-banners`);

  list(): Observable<MarketingBanner[]> { return this.store.list(); }
  get all(): MarketingBanner[] { return this.store.all; }
  getById(id: string): MarketingBanner | undefined { return this.store.getById(id); }
  create(data: Omit<MarketingBanner, 'id'>): Observable<MarketingBanner> { return this.store.create(data); }
  update(id: string, data: Partial<MarketingBanner>): Observable<MarketingBanner | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
