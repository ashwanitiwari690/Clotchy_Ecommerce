import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: string;
}

// Renders any admin-managed content page (Help, Shipping Policy, Return Policy, ...)
// by slug - the route supplies `slug`/`label` via its `data`, the body comes from the backend.
@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './static-page.component.html',
  styleUrl: './static-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticPageComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  label = this.route.snapshot.data['label'] as string;
  page = signal<StaticPage | null>(null);
  loading = signal(true);
  notFound = signal(false);

  constructor() {
    const slug = this.route.snapshot.data['slug'] as string;
    this.http.get<{ success: boolean; data: StaticPage }>(`${environment.apiUrl}/static-pages/slug/${slug}`).subscribe({
      next: (res) => {
        this.page.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }
}
