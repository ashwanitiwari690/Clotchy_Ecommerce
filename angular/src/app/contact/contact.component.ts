import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly http = inject(HttpClient);

  name = signal('');
  email = signal('');
  message = signal('');
  error = signal('');
  submitting = signal(false);
  submitted = signal(false);

  onNameInput(e: Event): void { this.name.set((e.target as HTMLInputElement).value); }
  onEmailInput(e: Event): void { this.email.set((e.target as HTMLInputElement).value); }
  onMessageInput(e: Event): void { this.message.set((e.target as HTMLTextAreaElement).value); }

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
    this.submitting.set(true);
    this.http
      .post(`${environment.apiUrl}/contact-messages`, {
        name: this.name().trim(),
        email: this.email().trim(),
        message: this.message().trim(),
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.error.set(err.error?.message ?? 'Could not send your message. Please try again.');
        },
      });
  }

  sendAnother(): void {
    this.name.set('');
    this.email.set('');
    this.message.set('');
    this.submitted.set(false);
  }
}
