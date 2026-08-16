import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  // styleUrl: './app.component.scss'
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  mobileMenu = signal(false);
  searchOpen = signal(false);

  constructor(public cart: CartService, public auth: AuthService, private router: Router) {}

  closeMenu(): void {
    this.mobileMenu.set(false);
  }

  toggleSearch(): void {
    this.searchOpen.update(v => !v);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/'));
  }
}
