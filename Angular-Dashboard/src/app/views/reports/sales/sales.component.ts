import { Component } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ORDERS_MOCK } from '../../../core/mock-data/orders.mock';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './sales.component.html',
})
export class SalesReportComponent {
  readonly orders = [...ORDERS_MOCK].sort((a, b) => b.date.localeCompare(a.date));

  readonly revenue = ORDERS_MOCK.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  readonly orderCount = ORDERS_MOCK.length;
  readonly aov = this.orderCount ? Math.round(this.revenue / this.orderCount) : 0;
  readonly refunds = ORDERS_MOCK.filter((o) => o.paymentStatus === 'refunded').reduce((s, o) => s + o.total, 0);
  readonly discounts = ORDERS_MOCK.reduce((s, o) => s + o.discount, 0);

  readonly revenueChart: IChartProps = this.buildRevenueChart();

  private buildRevenueChart(): IChartProps {
    const byDate = new Map<string, number>();
    for (const o of ORDERS_MOCK) {
      byDate.set(o.date, (byDate.get(o.date) ?? 0) + o.total);
    }
    const labels = [...byDate.keys()].sort();
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Revenue', data: labels.map((d) => byDate.get(d)!), backgroundColor: '#d3a04e', borderRadius: 4 }],
      },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
    };
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
