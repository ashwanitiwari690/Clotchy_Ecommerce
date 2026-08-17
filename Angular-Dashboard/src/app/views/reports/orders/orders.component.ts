import { Component } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ORDERS_MOCK } from '../../../core/mock-data/orders.mock';
import { ORDER_STATUSES } from '../../../core/models/order.model';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-order-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './orders.component.html',
})
export class OrderReportComponent {
  readonly orders = [...ORDERS_MOCK].sort((a, b) => b.date.localeCompare(a.date));

  readonly statusSummary = ORDER_STATUSES.map((status) => ({
    status,
    count: ORDERS_MOCK.filter((o) => o.status === status).length,
    revenue: ORDERS_MOCK.filter((o) => o.status === status).reduce((s, o) => s + o.total, 0),
  }));

  readonly statusChart: IChartProps = {
    type: 'doughnut',
    data: {
      labels: this.statusSummary.map((s) => s.status),
      datasets: [{
        data: this.statusSummary.map((s) => s.count),
        backgroundColor: ['#f9b115', '#3399ff', '#20a8d8', '#6f42c1', '#0dcaf0', '#fd7e14', '#2eb85c', '#e55353', '#d63384', '#6c757d'],
      }],
    },
    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
  };

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
