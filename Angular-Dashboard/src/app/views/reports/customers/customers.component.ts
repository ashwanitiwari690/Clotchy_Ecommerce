import { Component } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { CUSTOMERS_MOCK } from '../../../core/mock-data/customers.mock';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-customer-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './customers.component.html',
})
export class CustomerReportComponent {
  readonly newCustomers = [...CUSTOMERS_MOCK].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, 6);
  readonly returningCustomers = CUSTOMERS_MOCK.filter((c) => c.totalOrders > 1);
  readonly topCustomers = [...CUSTOMERS_MOCK].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 6);

  readonly topCustomersChart: IChartProps = {
    type: 'bar',
    data: {
      labels: this.topCustomers.slice(0, 5).map((c) => c.name),
      datasets: [{ label: 'Total Spent', data: this.topCustomers.slice(0, 5).map((c) => c.totalSpent), backgroundColor: '#d3a04e', borderRadius: 4 }],
    },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
  };

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
