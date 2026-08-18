import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityImage } from '../../../core/models/homepage.model';
import { HttpCrudStore } from '../../../core/services/http-crud-store';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}home/community`;
  private readonly store = new HttpCrudStore<CommunityImage>(this.http, this.baseUrl);

  list(): Observable<CommunityImage[]> { return this.store.list(); }
  get all(): CommunityImage[] { return this.store.all; }
  create(data: Omit<CommunityImage, 'id'>): Observable<CommunityImage> { return this.store.create(data); }
  update(id: string, data: Partial<CommunityImage>): Observable<CommunityImage | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  move(id: string, direction: 'up' | 'down'): void {
    this.http.post(`${this.baseUrl}/${id}/move`, { direction }).subscribe(() => this.store.refresh());
  }
}
