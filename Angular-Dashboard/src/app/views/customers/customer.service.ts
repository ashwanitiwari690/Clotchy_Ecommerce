import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../core/models/customer.model';
import { CUSTOMERS_MOCK } from '../../core/mock-data/customers.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly store = new MockCrudStore<Customer>(CUSTOMERS_MOCK, 'cust');

  list(): Observable<Customer[]> { return this.store.list(); }
  get all(): Customer[] { return this.store.all; }
  getById(id: string): Customer | undefined { return this.store.getById(id); }
  update(id: string, data: Partial<Customer>): Observable<Customer | undefined> { return this.store.update(id, data); }
}
