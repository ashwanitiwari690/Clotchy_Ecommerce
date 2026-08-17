import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { TicketService } from './ticket.service';
import { Ticket } from '../../core/models/ticket.model';
import { ToastService } from '../../layout/toasts/toast.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [SharedUIModule, FormsModule],
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc = inject(TicketService);
  private readonly toast = inject(ToastService);

  private readonly ticketId = this.route.snapshot.paramMap.get('id')!;
  ticket = signal<Ticket | undefined>(this.svc.getById(this.ticketId));

  replyText = '';

  private refresh(): void {
    this.ticket.set(this.svc.getById(this.ticketId));
  }

  sendReply(): void {
    if (!this.replyText.trim()) return;
    this.svc.addMessage(this.ticketId, {
      sender: 'admin',
      senderName: 'Admin User',
      message: this.replyText.trim(),
      date: new Date().toISOString().slice(0, 10),
    }).subscribe(() => {
      this.replyText = '';
      this.refresh();
      this.toast.success('Reply sent.');
    });
  }

  updateField(field: 'priority' | 'status' | 'assignedAdmin' | 'category', value: string): void {
    this.svc.update(this.ticketId, { [field]: value } as Partial<Ticket>).subscribe(() => {
      this.refresh();
      this.toast.success('Ticket updated.');
    });
  }

  goBack(): void {
    this.router.navigate(['/helpdesk']);
  }
}
