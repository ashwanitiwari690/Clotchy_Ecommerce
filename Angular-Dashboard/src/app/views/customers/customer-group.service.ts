import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerGroup } from '../../core/models/customer.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerGroupService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<CustomerGroup>(this.http, `${environment.ECOMMERCE_API}customer-groups`);

  list(): Observable<CustomerGroup[]> { return this.store.list(); }
  get all(): CustomerGroup[] { return this.store.all; }
  getById(id: string): CustomerGroup | undefined { return this.store.getById(id); }
  create(data: Omit<CustomerGroup, 'id'>): Observable<CustomerGroup> { return this.store.create(data); }
  update(id: string, data: Partial<CustomerGroup>): Observable<CustomerGroup | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }
}
