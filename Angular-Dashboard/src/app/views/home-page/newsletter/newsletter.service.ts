import { Injectable, signal } from '@angular/core';
import { NewsletterConfig } from '../../../core/models/homepage.model';
import { NEWSLETTER_CONFIG_MOCK } from '../../../core/mock-data/home-page.mock';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly _config = signal<NewsletterConfig>(NEWSLETTER_CONFIG_MOCK);
  readonly config = this._config.asReadonly();

  get value(): NewsletterConfig {
    return this._config();
  }

  update(patch: Partial<NewsletterConfig>): void {
    this._config.update((current) => ({ ...current, ...patch }));
  }
}
