import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { SettingsService } from './settings.service';
import { ToastService } from '../../layout/toasts/toast.service';
import { UploadedImage } from '../../shared/components/image-uploader/image-uploader.component';

const PAYMENT_METHOD_OPTIONS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery', 'PayPal', 'Wallet'];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsSvc = inject(SettingsService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tabs = [
    { id: 'general', label: 'General' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'tax', label: 'Tax' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'social', label: 'Social Media' },
    { id: 'profile', label: 'Admin Profile' },
  ];

  activeTab = signal('general');
  readonly paymentOptions = PAYMENT_METHOD_OPTIONS;

  logoImages = signal<UploadedImage[]>([{ url: this.settingsSvc.value.general.logo, name: 'logo' }]);
  faviconImages = signal<UploadedImage[]>([{ url: this.settingsSvc.value.general.favicon, name: 'favicon' }]);
  avatarImages = signal<UploadedImage[]>([{ url: this.settingsSvc.value.adminProfile.avatar, name: 'avatar' }]);

  shippingMethods = signal(this.settingsSvc.value.shipping.methods.map((m) => ({ ...m })));
  checkedPaymentMethods = signal(new Set(this.settingsSvc.value.payment.methods));

  generalForm = this.fb.nonNullable.group({
    storeName: [this.settingsSvc.value.general.storeName, Validators.required],
    email: [this.settingsSvc.value.general.email, Validators.required],
    phone: [this.settingsSvc.value.general.phone],
    address: [this.settingsSvc.value.general.address],
  });

  shippingForm = this.fb.nonNullable.group({
    freeShippingThreshold: [this.settingsSvc.value.shipping.freeShippingThreshold],
  });

  paymentForm = this.fb.nonNullable.group({
    currency: [this.settingsSvc.value.payment.currency],
    taxRate: [this.settingsSvc.value.payment.taxRate],
  });

  taxForm = this.fb.nonNullable.group({
    taxName: [this.settingsSvc.value.tax.taxName],
    taxRate: [this.settingsSvc.value.tax.taxRate],
    pricesIncludeTax: [this.settingsSvc.value.tax.pricesIncludeTax],
  });

  notificationsForm = this.fb.nonNullable.group({
    emailNotifications: [this.settingsSvc.value.notifications.emailNotifications],
    orderNotifications: [this.settingsSvc.value.notifications.orderNotifications],
    customerNotifications: [this.settingsSvc.value.notifications.customerNotifications],
  });

  socialForm = this.fb.nonNullable.group({
    instagram: [this.settingsSvc.value.social.instagram],
    facebook: [this.settingsSvc.value.social.facebook],
    youtube: [this.settingsSvc.value.social.youtube],
    twitter: [this.settingsSvc.value.social.twitter],
  });

  profileForm = this.fb.nonNullable.group({
    name: [this.settingsSvc.value.adminProfile.name, Validators.required],
    email: [this.settingsSvc.value.adminProfile.email],
    phone: [this.settingsSvc.value.adminProfile.phone],
  });

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.activeTab.set(params['tab'] ?? 'general');
    });
  }

  selectTab(id: string): void {
    this.router.navigate([], { queryParams: { tab: id }, queryParamsHandling: 'merge' });
  }

  addShippingMethod(): void {
    this.shippingMethods.update((list) => [...list, { name: '', charge: 0 }]);
  }

  removeShippingMethod(index: number): void {
    this.shippingMethods.update((list) => list.filter((_, i) => i !== index));
  }

  updateShippingMethod(index: number, field: 'name' | 'charge', value: string | number): void {
    this.shippingMethods.update((list) => list.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  togglePaymentMethod(method: string): void {
    this.checkedPaymentMethods.update((set) => {
      const next = new Set(set);
      next.has(method) ? next.delete(method) : next.add(method);
      return next;
    });
  }

  saveGeneral(): void {
    this.settingsSvc.update({ general: { ...this.generalForm.getRawValue(), logo: this.logoImages()[0]?.url ?? '', favicon: this.faviconImages()[0]?.url ?? '' } });
    this.toast.success('Settings saved.');
  }

  saveShipping(): void {
    this.settingsSvc.update({ shipping: { methods: this.shippingMethods(), freeShippingThreshold: this.shippingForm.getRawValue().freeShippingThreshold } });
    this.toast.success('Settings saved.');
  }

  savePayment(): void {
    this.settingsSvc.update({ payment: { ...this.paymentForm.getRawValue(), methods: [...this.checkedPaymentMethods()] } });
    this.toast.success('Settings saved.');
  }

  saveTax(): void {
    this.settingsSvc.update({ tax: this.taxForm.getRawValue() });
    this.toast.success('Settings saved.');
  }

  saveNotifications(): void {
    this.settingsSvc.update({ notifications: this.notificationsForm.getRawValue() });
    this.toast.success('Settings saved.');
  }

  saveSocial(): void {
    this.settingsSvc.update({ social: this.socialForm.getRawValue() });
    this.toast.success('Settings saved.');
  }

  saveProfile(): void {
    this.settingsSvc.update({ adminProfile: { ...this.profileForm.getRawValue(), avatar: this.avatarImages()[0]?.url ?? '' } });
    this.toast.success('Settings saved.');
  }
}
