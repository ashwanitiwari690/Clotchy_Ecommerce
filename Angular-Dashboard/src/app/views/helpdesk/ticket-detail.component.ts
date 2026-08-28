import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { TicketService } from './ticket.service';
import { Ticket } from '../../core/models/ticket.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { AdminUserService } from '../admin-users/admin-user.service';

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
  private readonly adminUserSvc = inject(AdminUserService);

  get admins() { return this.adminUserSvc.all; }

  private readonly ticketId = this.route.snapshot.paramMap.get('id')!;
  ticket = signal<Ticket | undefined>(undefined);

  replyText = '';

  constructor() {
    this.svc.getByIdAsync(this.ticketId).subscribe((t) => this.ticket.set(t));
  }

  private refresh(): void {
    this.svc.getByIdAsync(this.ticketId).subscribe((t) => this.ticket.set(t));
  }

  sendReply(): void {
    if (!this.replyText.trim()) return;
    this.svc.addMessage(this.ticketId, this.replyText.trim()).subscribe(() => {
      this.replyText = '';
      this.refresh();
      this.toast.success('Reply sent.');
    });
  }

  updateField(field: 'priority' | 'status' | 'category', value: string): void {
    this.svc.update(this.ticketId, { [field]: value }).subscribe(() => {
      this.refresh();
      this.toast.success('Ticket updated.');
    });
  }

  assignAdmin(adminId: string): void {
    this.svc.update(this.ticketId, { assignedAdminId: adminId || null }).subscribe(() => {
      this.refresh();
      this.toast.success('Ticket updated.');
    });
  }

  goBack(): void {
    this.router.navigate(['/helpdesk']);
  }
}
