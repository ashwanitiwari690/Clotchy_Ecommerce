import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  displayOrder: number;
  status: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  private readonly http = inject(HttpClient);

  faqs = signal<Faq[]>([]);
  loading = signal(true);
  openId = signal<string | null>(null);

  constructor() {
    this.http.get<{ success: boolean; data: Faq[] }>(`${environment.apiUrl}/faqs`).subscribe({
      next: (res) => {
        this.faqs.set(res.data.filter((f) => f.status === 'active').sort((a, b) => a.displayOrder - b.displayOrder));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggle(id: string): void {
    this.openId.set(this.openId() === id ? null : id);
  }
}
