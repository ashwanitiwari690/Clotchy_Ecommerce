import { Component, inject, signal } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ReportService, CustomersReport } from '../report.service';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-customer-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './customers.component.html',
})
export class CustomerReportComponent {
  private readonly svc = inject(ReportService);

  readonly report = signal<CustomersReport | null>(null);
  readonly topCustomersChart = signal<IChartProps | null>(null);

  constructor() {
    this.svc.getCustomers().subscribe((report) => {
      this.report.set(report);
      const top5 = report.topCustomers.slice(0, 5);
      this.topCustomersChart.set({
        type: 'bar',
        data: {
          labels: top5.map((c) => c.name),
          datasets: [{ label: 'Total Spent', data: top5.map((c) => c.totalSpent), backgroundColor: '#d3a04e', borderRadius: 4 }],
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
    });
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
