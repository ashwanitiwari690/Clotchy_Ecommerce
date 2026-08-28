import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomePromotion } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HomePromotionService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<HomePromotion>(this.http, `${environment.ECOMMERCE_API}home-promotions`);

  list(): Observable<HomePromotion[]> { return this.store.list(); }
  get all(): HomePromotion[] { return this.store.all; }
  getById(id: string): HomePromotion | undefined { return this.store.getById(id); }
  create(data: Omit<HomePromotion, 'id'>): Observable<HomePromotion> { return this.store.create(data); }
  update(id: string, data: Partial<HomePromotion>): Observable<HomePromotion | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
