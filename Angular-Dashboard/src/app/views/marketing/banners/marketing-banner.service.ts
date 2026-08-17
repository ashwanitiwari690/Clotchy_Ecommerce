import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarketingBanner } from '../../../core/models/marketing.model';
import { MARKETING_BANNERS_MOCK } from '../../../core/mock-data/marketing.mock';
import { MockCrudStore } from '../../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class MarketingBannerService {
  private readonly store = new MockCrudStore<MarketingBanner>(MARKETING_BANNERS_MOCK, 'mb');

  list(): Observable<MarketingBanner[]> { return this.store.list(); }
  get all(): MarketingBanner[] { return this.store.all; }
  getById(id: string): MarketingBanner | undefined { return this.store.getById(id); }
  create(data: Omit<MarketingBanner, 'id'>): Observable<MarketingBanner> { return this.store.create(data); }
  update(id: string, data: Partial<MarketingBanner>): Observable<MarketingBanner | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
