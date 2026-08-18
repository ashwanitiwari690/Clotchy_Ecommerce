import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService, Address } from '../auth.service';
import { CartService, PlacedOrder } from '../cart.service';

interface NominatimAddress {
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  readonly address = signal<Address | null>(null);
  readonly loadingAddress = signal(true);
  readonly placing = signal(false);
  readonly error = signal('');
  readonly placedOrder = signal<PlacedOrder | null>(null);

  // Inline address form
  readonly editingAddress = signal(false);
  readonly fullName = signal('');
  readonly addrPhone = signal('');
  readonly line1 = signal('');
  readonly line2 = signal('');
  readonly city = signal('');
  readonly state = signal('');
  readonly pincode = signal('');
  readonly country = signal('India');
  readonly addressFormError = signal('');
  readonly savingAddress = signal(false);
  readonly locating = signal(false);
  readonly locateError = signal('');

  constructor(public cart: CartService, private auth: AuthService, private http: HttpClient) {
    this.auth.getAddress().subscribe({
      next: (res) => {
        this.address.set(res.data);
        this.loadingAddress.set(false);
      },
      error: () => this.loadingAddress.set(false),
    });
  }

  toggleAddressForm(): void {
    if (this.editingAddress()) {
      this.cancelEditAddress();
    } else {
      this.startEditAddress();
    }
  }

  startEditAddress(): void {
    const addr = this.address();
    this.fullName.set(addr?.fullName ?? this.auth.user()?.name ?? '');
    this.addrPhone.set(addr?.phone ?? this.auth.user()?.phone ?? '');
    this.line1.set(addr?.line1 ?? '');
    this.line2.set(addr?.line2 ?? '');
    this.city.set(addr?.city ?? '');
    this.state.set(addr?.state ?? '');
    this.pincode.set(addr?.pincode ?? '');
    this.country.set(addr?.country ?? 'India');
    this.addressFormError.set('');
    this.locateError.set('');
    this.editingAddress.set(true);
  }

  cancelEditAddress(): void {
    this.editingAddress.set(false);
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

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locateError.set('Geolocation is not supported by your browser.');
      return;
    }
    this.locateError.set('');
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.http
          .get<NominatimResponse>('https://nominatim.openstreetmap.org/reverse', {
            params: { format: 'jsonv2', lat: `${latitude}`, lon: `${longitude}` },
          })
          .subscribe({
            next: (res) => {
              this.locating.set(false);
              const a = res.address;
              if (!a) {
                this.locateError.set('Could not detect your address from this location. Please fill in manually.');
                return;
              }
              this.line1.set([a.house_number, a.road].filter(Boolean).join(' '));
              this.line2.set(a.suburb ?? a.neighbourhood ?? '');
              this.city.set(a.city ?? a.town ?? a.village ?? a.county ?? '');
              this.state.set(a.state ?? '');
              this.pincode.set((a.postcode ?? '').replace(/\D/g, '').slice(0, 6));
              this.country.set(a.country ?? 'India');
            },
            error: () => {
              this.locating.set(false);
              this.locateError.set('Could not detect your address from this location. Please fill in manually.');
            },
          });
      },
      (err) => {
        this.locating.set(false);
        this.locateError.set(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Please fill in your address manually.'
            : 'Could not get your current location. Please fill in your address manually.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  saveAddressForm(): void {
    if (!this.fullName().trim() || !this.line1().trim() || !this.city().trim() || !this.state().trim()) {
      this.addressFormError.set('Please fill in all required address fields');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(this.addrPhone())) {
      this.addressFormError.set('Enter a valid 10-digit mobile number');
      return;
    }
    if (!/^\d{6}$/.test(this.pincode())) {
      this.addressFormError.set('Enter a valid 6-digit pincode');
      return;
    }

    this.addressFormError.set('');
    this.savingAddress.set(true);
    this.auth
      .saveAddress({
        fullName: this.fullName().trim(),
        phone: this.addrPhone(),
        line1: this.line1().trim(),
        line2: this.line2().trim() || undefined,
        city: this.city().trim(),
        state: this.state().trim(),
        pincode: this.pincode(),
        country: this.country().trim() || 'India',
      })
      .subscribe({
        next: (res) => {
          this.savingAddress.set(false);
          this.address.set(res.data);
          this.editingAddress.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.savingAddress.set(false);
          this.addressFormError.set(err.error?.message ?? 'Could not save the address. Please try again.');
        },
      });
  }

  placeOrder(): void {
    if (!this.address() || this.cart.items().length === 0) return;
    this.error.set('');
    this.placing.set(true);
    this.cart.checkout().subscribe({
      next: (order) => {
        this.placing.set(false);
        this.placedOrder.set(order);
      },
      error: (err: HttpErrorResponse) => {
        this.placing.set(false);
        this.error.set(err.error?.message ?? 'Could not place your order. Please try again.');
      },
    });
  }
}
