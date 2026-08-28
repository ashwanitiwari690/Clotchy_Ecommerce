import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactMessage } from '../../core/models/ticket.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<ContactMessage>(this.http, `${environment.ECOMMERCE_API}contact-messages`);

  list(): Observable<ContactMessage[]> { return this.store.list(); }
  get all(): ContactMessage[] { return this.store.all; }
  getById(id: string): ContactMessage | undefined { return this.store.getById(id); }
  update(id: string, data: Partial<ContactMessage>): Observable<ContactMessage | undefined> { return this.store.update(id, data); }
}
