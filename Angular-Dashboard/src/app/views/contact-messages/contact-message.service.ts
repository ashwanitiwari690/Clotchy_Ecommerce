import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactMessage } from '../../core/models/ticket.model';
import { CONTACT_MESSAGES_MOCK } from '../../core/mock-data/helpdesk.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly store = new MockCrudStore<ContactMessage>(CONTACT_MESSAGES_MOCK, 'cm');

  list(): Observable<ContactMessage[]> { return this.store.list(); }
  get all(): ContactMessage[] { return this.store.all; }
  getById(id: string): ContactMessage | undefined { return this.store.getById(id); }
  update(id: string, data: Partial<ContactMessage>): Observable<ContactMessage | undefined> { return this.store.update(id, data); }
}
