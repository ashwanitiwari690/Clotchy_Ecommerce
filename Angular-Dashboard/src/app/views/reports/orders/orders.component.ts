import { Component, inject, signal } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ReportService, OrdersReport } from '../report.service';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-order-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './orders.component.html',
})
export class OrderReportComponent {
  private readonly svc = inject(ReportService);

  readonly report = signal<OrdersReport | null>(null);
  readonly statusChart = signal<IChartProps | null>(null);

  constructor() {
    this.svc.getOrders().subscribe((report) => {
      this.report.set(report);
      this.statusChart.set({
        type: 'doughnut',
        data: {
          labels: report.statusSummary.map((s) => s.status),
          datasets: [{
            data: report.statusSummary.map((s) => s.count),
            backgroundColor: ['#f9b115', '#3399ff', '#20a8d8', '#6f42c1', '#0dcaf0', '#fd7e14', '#2eb85c', '#e55353', '#d63384', '#6c757d'],
          }],
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      });
    });
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
