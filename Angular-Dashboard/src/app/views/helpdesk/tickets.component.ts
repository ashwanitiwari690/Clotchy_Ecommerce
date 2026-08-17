import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { TicketService } from './ticket.service';
import { Ticket } from '../../core/models/ticket.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [SharedUIModule, FormsModule, RouterLink],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent {
  private readonly svc = inject(TicketService);

  search = '';
  statusFilter = '';
  priorityFilter = '';

  get tickets(): Ticket[] {
    const term = this.search.trim().toLowerCase();
    return [...this.svc.all]
      .filter((t) => !this.statusFilter || t.status === this.statusFilter)
      .filter((t) => !this.priorityFilter || t.priority === this.priorityFilter)
      .filter((t) => !term || t.subject.toLowerCase().includes(term) || t.customerName.toLowerCase().includes(term))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  onSearch(value: string): void {
    this.search = value;
  }
}
