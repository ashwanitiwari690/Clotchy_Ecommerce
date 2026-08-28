import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  // BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../views/authentication/auth.service';
import { TicketService } from '../../../views/helpdesk/ticket.service';
import { OrderService } from '../../../views/orders/order.service';
import { ProductService } from '../../../views/products/product.service';

export interface HeaderNotification {
  icon: string;
  color: string;
  message: string;
  time: string;
  link: string;
}

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownDividerDirective]
})
export class DefaultHeaderComponent extends HeaderComponent {

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
  ];

  public iduser: any = sessionStorage.getItem("iduser");
  public sidebarId = input('sidebar1');

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  private readonly ticketSvc = inject(TicketService);
  private readonly orderSvc = inject(OrderService);
  private readonly productSvc = inject(ProductService);

  get notifications(): HeaderNotification[] {
    return [
      ...this.ticketSvc.all.filter(t => t.status === 'open').slice(0, 2).map(t => ({
        icon: 'cilHeadphones', color: 'danger', message: `New ticket: ${t.subject}`, time: t.createdAt, link: '/helpdesk',
      })),
      ...this.orderSvc.all.filter(o => o.status === 'pending').slice(0, 2).map(o => ({
        icon: 'cilCart', color: 'warning', message: `New order ${o.id} from ${o.customerName}`, time: o.date, link: '/orders',
      })),
      ...this.productSvc.all.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).slice(0, 2).map(p => ({
        icon: 'cilBasket', color: 'info', message: `Low stock: ${p.name} (${p.stock} left)`, time: 'Today', link: '/inventory',
      })),
    ];
  }

  constructor(protected auth: AuthService,protected router: Router) {
    super();
  }

  get currentUserInitial(): string {
    return (this.auth.user()?.name || '?').trim().charAt(0).toUpperCase();
  }

  ngOnInit() {}

  toggleTheme() {
    const currentMode = this.colorMode();
    this.colorMode.set(currentMode === 'dark' ? 'light' : 'dark');
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/auth']),
      error: () => this.router.navigate(['/auth']),
    });
  }

}
