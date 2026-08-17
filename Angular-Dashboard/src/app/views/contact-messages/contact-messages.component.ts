import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { ContactMessageService } from './contact-message.service';
import { ContactMessage } from '../../core/models/ticket.model';
import { ToastService } from '../../layout/toasts/toast.service';

@Component({
  selector: 'app-contact-messages',
  standalone: true,
  imports: [SharedUIModule, FormsModule],
  templateUrl: './contact-messages.component.html',
})
export class ContactMessagesComponent {
  private readonly svc = inject(ContactMessageService);
  private readonly toast = inject(ToastService);

  search = '';
  statusFilter = '';
  selected = signal<ContactMessage | null>(null);
  replyText = '';

  get messages(): ContactMessage[] {
    const term = this.search.trim().toLowerCase();
    return [...this.svc.all]
      .filter((m) => !this.statusFilter || m.status === this.statusFilter)
      .filter((m) => !term || m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term) || m.subject.toLowerCase().includes(term))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  truncate(text: string, len = 60): string {
    return text.length > len ? text.slice(0, len) + '…' : text;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  view(msg: ContactMessage): void {
    this.selected.set(msg);
    this.replyText = '';
    if (msg.status === 'new') {
      this.svc.update(msg.id, { status: 'read' }).subscribe(() => this.selected.set(this.svc.getById(msg.id) ?? null));
    }
  }

  sendReply(): void {
    const msg = this.selected();
    if (!msg || !this.replyText.trim()) return;
    this.svc.update(msg.id, { status: 'replied' }).subscribe((updated) => {
      this.selected.set(updated ?? null);
      this.replyText = '';
      this.toast.success('Reply sent.');
    });
  }

  setStatus(status: ContactMessage['status']): void {
    const msg = this.selected();
    if (!msg) return;
    this.svc.update(msg.id, { status }).subscribe((updated) => {
      this.selected.set(updated ?? null);
      this.toast.success('Message status updated.');
    });
  }
}
