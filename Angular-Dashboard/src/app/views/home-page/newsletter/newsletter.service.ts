import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { NewsletterConfig } from '../../../core/models/homepage.model';
import { NEWSLETTER_CONFIG_MOCK } from '../../../core/mock-data/home-page.mock';
import { environment } from '../../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}newsletter-config`;

  // Seeded with the same shape as the mock so any synchronous reads before
  // the GET resolves still have sensible defaults to render.
  private readonly _config = signal<NewsletterConfig>(NEWSLETTER_CONFIG_MOCK);
  readonly config = this._config.asReadonly();

  constructor() {
    this.http.get<ApiEnvelope<NewsletterConfig>>(this.baseUrl, { withCredentials: true }).subscribe((res) => this._config.set(res.data));
  }

  get value(): NewsletterConfig {
    return this._config();
  }

  update(patch: Partial<NewsletterConfig>): void {
    this.http
      .put<ApiEnvelope<NewsletterConfig>>(this.baseUrl, patch, { withCredentials: true })
      .pipe(tap((res) => this._config.set(res.data)))
      .subscribe();
  }
}
