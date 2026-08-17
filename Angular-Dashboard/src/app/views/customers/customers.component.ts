import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CustomerService } from './customer.service';
import { Customer } from '../../core/models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [SharedUIModule, RouterLink],
  templateUrl: './customers.component.html',
})
export class CustomersComponent {
  private readonly svc = inject(CustomerService);

  search = '';
  currentPage = signal(1);
  pageSize = 10;

  get filtered(): Customer[] {
    const term = this.search.trim().toLowerCase();
    return [...this.svc.all]
      .filter((c) => !term || c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
  }

  get paged(): Customer[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(value: string): void {
    this.search = value;
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
