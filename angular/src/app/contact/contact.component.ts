import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  name = signal('');
  email = signal('');
  message = signal('');
  error = signal('');
  submitted = signal(false);

  onNameInput(e: Event): void { this.name.set((e.target as HTMLInputElement).value); }
  onEmailInput(e: Event): void { this.email.set((e.target as HTMLInputElement).value); }
  onMessageInput(e: Event): void { this.message.set((e.target as HTMLTextAreaElement).value); }

  // No backend endpoint exists yet for contact submissions - this validates and
  // shows a confirmation locally so the UI/UX is ready to wire up to a real API later.
  submit(): void {
    if (!this.name().trim() || !this.email().trim() || !this.message().trim()) {
      this.error.set('Please fill in all fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
      this.error.set('Enter a valid email address');
      return;
    }
    this.error.set('');
    this.submitted.set(true);
  }

  sendAnother(): void {
    this.name.set('');
    this.email.set('');
    this.message.set('');
    this.submitted.set(false);
  }
}
