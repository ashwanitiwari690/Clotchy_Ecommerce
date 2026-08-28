import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { StoreSettings } from '../../core/models/settings.model';
import { STORE_SETTINGS_MOCK } from '../../core/mock-data/settings.mock';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

/** Shape of the `settings` row as the backend stores/returns it - flat, unlike the frontend's nested `StoreSettings`. */
interface FlatStoreSettings {
  storeName: string;
  logo: string | null;
  favicon: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  shippingMethods: { name: string; charge: number }[];
  freeShippingThreshold: number | string;
  paymentMethods: string[];
  currency: string;
  taxName: string;
  taxRate: number | string;
  pricesIncludeTax: boolean;
  emailNotifications: boolean;
  orderNotifications: boolean;
  customerNotifications: boolean;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  twitter: string | null;
}

// adminProfile has no backend counterpart (it's the logged-in admin's own
// profile, not a store setting) so it's threaded through untouched here.
function toFrontendShape(flat: FlatStoreSettings, adminProfile: StoreSettings['adminProfile']): StoreSettings {
  const taxRate = Number(flat.taxRate) || 0;
  return {
    general: {
      storeName: flat.storeName ?? '',
      logo: flat.logo ?? '',
      favicon: flat.favicon ?? '',
      email: flat.contactEmail ?? '',
      phone: flat.contactPhone ?? '',
      address: flat.address ?? '',
    },
    shipping: {
      methods: flat.shippingMethods ?? [],
      freeShippingThreshold: Number(flat.freeShippingThreshold) || 0,
    },
    payment: {
      methods: flat.paymentMethods ?? [],
      currency: flat.currency ?? '',
      // The backend only tracks one tax rate - the frontend's payment tab and
      // tax tab both read/write it via their own nested path.
      taxRate,
    },
    tax: {
      taxName: flat.taxName ?? '',
      taxRate,
      pricesIncludeTax: !!flat.pricesIncludeTax,
    },
    notifications: {
      emailNotifications: !!flat.emailNotifications,
      orderNotifications: !!flat.orderNotifications,
      customerNotifications: !!flat.customerNotifications,
    },
    social: {
      instagram: flat.instagram ?? '',
      facebook: flat.facebook ?? '',
      youtube: flat.youtube ?? '',
      twitter: flat.twitter ?? '',
    },
    adminProfile,
  };
}

function toBackendShape(patch: Partial<StoreSettings>): Partial<FlatStoreSettings> {
  const out: Partial<FlatStoreSettings> = {};

  if (patch.general) {
    const g = patch.general;
    if (g.storeName !== undefined) out.storeName = g.storeName;
    if (g.logo !== undefined) out.logo = g.logo;
    if (g.favicon !== undefined) out.favicon = g.favicon;
    if (g.email !== undefined) out.contactEmail = g.email;
    if (g.phone !== undefined) out.contactPhone = g.phone;
    if (g.address !== undefined) out.address = g.address;
  }
  if (patch.shipping) {
    const s = patch.shipping;
    if (s.methods !== undefined) out.shippingMethods = s.methods;
    if (s.freeShippingThreshold !== undefined) out.freeShippingThreshold = s.freeShippingThreshold;
  }
  if (patch.payment) {
    const p = patch.payment;
    if (p.methods !== undefined) out.paymentMethods = p.methods;
    if (p.currency !== undefined) out.currency = p.currency;
    if (p.taxRate !== undefined) out.taxRate = p.taxRate;
  }
  if (patch.tax) {
    const t = patch.tax;
    if (t.taxName !== undefined) out.taxName = t.taxName;
    if (t.taxRate !== undefined) out.taxRate = t.taxRate;
    if (t.pricesIncludeTax !== undefined) out.pricesIncludeTax = t.pricesIncludeTax;
  }
  if (patch.notifications) {
    const n = patch.notifications;
    if (n.emailNotifications !== undefined) out.emailNotifications = n.emailNotifications;
    if (n.orderNotifications !== undefined) out.orderNotifications = n.orderNotifications;
    if (n.customerNotifications !== undefined) out.customerNotifications = n.customerNotifications;
  }
  if (patch.social) {
    const so = patch.social;
    if (so.instagram !== undefined) out.instagram = so.instagram;
    if (so.facebook !== undefined) out.facebook = so.facebook;
    if (so.youtube !== undefined) out.youtube = so.youtube;
    if (so.twitter !== undefined) out.twitter = so.twitter;
  }

  return out;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.ECOMMERCE_API}settings`;

  // Seeded with the mock's shape (including adminProfile, which the backend
  // never returns) so any synchronous reads before the GET resolves still
  // have sensible defaults to render.
  private readonly _settings = signal<StoreSettings>(STORE_SETTINGS_MOCK);
  readonly settings = this._settings.asReadonly();

  constructor() {
    this.http.get<ApiEnvelope<FlatStoreSettings>>(this.baseUrl, { withCredentials: true }).subscribe((res) => {
      this._settings.update((current) => toFrontendShape(res.data, current.adminProfile));
    });
  }

  get value(): StoreSettings {
    return this._settings();
  }

  update(patch: Partial<StoreSettings>): void {
    if (patch.adminProfile) {
      // Not a real store-settings field - keep it purely local rather than
      // sending it to /settings.
      this._settings.update((current) => ({ ...current, adminProfile: { ...current.adminProfile, ...patch.adminProfile } }));
    }

    const body = toBackendShape(patch);
    if (Object.keys(body).length === 0) return;

    this.http
      .put<ApiEnvelope<FlatStoreSettings>>(this.baseUrl, body, { withCredentials: true })
      .pipe(tap((res) => this._settings.update((current) => toFrontendShape(res.data, current.adminProfile))))
      .subscribe();
  }
}
