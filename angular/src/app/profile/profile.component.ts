import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  // Details
  name = signal(this.authService.user()?.name ?? '');
  email = signal(this.authService.user()?.email ?? '');
  detailsError = signal('');
  detailsSuccess = signal('');
  savingDetails = signal(false);

  // Shipping address
  fullName = signal('');
  addrPhone = signal('');
  line1 = signal('');
  line2 = signal('');
  city = signal('');
  state = signal('');
  pincode = signal('');
  country = signal('India');
  addressError = signal('');
  addressSuccess = signal('');
  savingAddress = signal(false);
  loadingAddress = signal(true);

  get phone(): string {
    return this.authService.user()?.phone ?? '';
  }

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getAddress().subscribe({
      next: (res) => {
        this.loadingAddress.set(false);
        const address = res.data;
        if (address) {
          this.fullName.set(address.fullName);
          this.addrPhone.set(address.phone);
          this.line1.set(address.line1);
          this.line2.set(address.line2 ?? '');
          this.city.set(address.city);
          this.state.set(address.state);
          this.pincode.set(address.pincode);
          this.country.set(address.country);
        } else {
          this.fullName.set(this.authService.user()?.name ?? '');
          this.addrPhone.set(this.authService.user()?.phone ?? '');
        }
      },
      error: () => this.loadingAddress.set(false)
    });
  }

  onNameInput(e: Event): void {
    this.name.set((e.target as HTMLInputElement).value);
  }

  onEmailInput(e: Event): void {
    this.email.set((e.target as HTMLInputElement).value);
  }

  saveDetails(): void {
    if (!this.name().trim()) {
      this.detailsError.set('Enter your full name');
      this.detailsSuccess.set('');
      return;
    }
    this.detailsError.set('');
    this.detailsSuccess.set('');
    this.savingDetails.set(true);
    this.authService.updateProfile(this.name().trim(), this.email().trim()).subscribe({
      next: () => {
        this.savingDetails.set(false);
        this.detailsSuccess.set('Your details have been updated.');
      },
      error: (err: HttpErrorResponse) => {
        this.savingDetails.set(false);
        this.detailsError.set(err.error?.message ?? 'Could not update your details. Please try again.');
      }
    });
  }

  onFullNameInput(e: Event): void { this.fullName.set((e.target as HTMLInputElement).value); }
  onAddrPhoneInput(e: Event): void {
    this.addrPhone.set((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10));
  }
  onLine1Input(e: Event): void { this.line1.set((e.target as HTMLInputElement).value); }
  onLine2Input(e: Event): void { this.line2.set((e.target as HTMLInputElement).value); }
  onCityInput(e: Event): void { this.city.set((e.target as HTMLInputElement).value); }
  onStateInput(e: Event): void { this.state.set((e.target as HTMLInputElement).value); }
  onPincodeInput(e: Event): void {
    this.pincode.set((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6));
  }
  onCountryInput(e: Event): void { this.country.set((e.target as HTMLInputElement).value); }

  saveAddress(): void {
    if (!this.fullName().trim() || !this.line1().trim() || !this.city().trim() || !this.state().trim()) {
      this.addressError.set('Please fill in all required address fields');
      this.addressSuccess.set('');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(this.addrPhone())) {
      this.addressError.set('Enter a valid 10-digit mobile number');
      this.addressSuccess.set('');
      return;
    }
    if (!/^\d{6}$/.test(this.pincode())) {
      this.addressError.set('Enter a valid 6-digit pincode');
      this.addressSuccess.set('');
      return;
    }

    this.addressError.set('');
    this.addressSuccess.set('');
    this.savingAddress.set(true);
    this.authService.saveAddress({
      fullName: this.fullName().trim(),
      phone: this.addrPhone(),
      line1: this.line1().trim(),
      line2: this.line2().trim() || undefined,
      city: this.city().trim(),
      state: this.state().trim(),
      pincode: this.pincode(),
      country: this.country().trim() || 'India',
    }).subscribe({
      next: () => {
        this.savingAddress.set(false);
        this.addressSuccess.set('Shipping address saved.');
      },
      error: (err: HttpErrorResponse) => {
        this.savingAddress.set(false);
        this.addressError.set(err.error?.message ?? 'Could not save the address. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigateByUrl('/'));
  }
}
