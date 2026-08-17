import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket, TicketMessage } from '../../core/models/ticket.model';
import { TICKETS_MOCK } from '../../core/mock-data/helpdesk.mock';
import { MockCrudStore } from '../../core/services/mock-crud-store';
import { generateId } from '../../core/models/common.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly store = new MockCrudStore<Ticket>(TICKETS_MOCK, 'tkt');

  list(): Observable<Ticket[]> { return this.store.list(); }
  get all(): Ticket[] { return this.store.all; }
  getById(id: string): Ticket | undefined { return this.store.getById(id); }
  create(data: Omit<Ticket, 'id'>): Observable<Ticket> { return this.store.create(data); }
  update(id: string, data: Partial<Ticket>): Observable<Ticket | undefined> { return this.store.update(id, data); }
  delete(id: string): Observable<boolean> { return this.store.delete(id); }

  addMessage(ticketId: string, message: Omit<TicketMessage, 'id'>): Observable<Ticket | undefined> {
    const ticket = this.getById(ticketId);
    if (!ticket) return this.update(ticketId, {});
    const newMessage: TicketMessage = { ...message, id: generateId('msg') };
    return this.update(ticketId, {
      messages: [...ticket.messages, newMessage],
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }
}
