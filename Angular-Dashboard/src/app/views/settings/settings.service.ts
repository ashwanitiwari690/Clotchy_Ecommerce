import { Injectable, signal } from '@angular/core';
import { StoreSettings } from '../../core/models/settings.model';
import { STORE_SETTINGS_MOCK } from '../../core/mock-data/settings.mock';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _settings = signal<StoreSettings>(STORE_SETTINGS_MOCK);
  readonly settings = this._settings.asReadonly();

  get value(): StoreSettings {
    return this._settings();
  }

  update(patch: Partial<StoreSettings>): void {
    this._settings.update((current) => ({
      ...current,
      general: { ...current.general, ...patch.general },
      shipping: { ...current.shipping, ...patch.shipping },
      payment: { ...current.payment, ...patch.payment },
      tax: { ...current.tax, ...patch.tax },
      notifications: { ...current.notifications, ...patch.notifications },
      social: { ...current.social, ...patch.social },
      adminProfile: { ...current.adminProfile, ...patch.adminProfile },
    }));
  }
}
