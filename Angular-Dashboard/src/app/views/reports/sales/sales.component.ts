import { Component, inject, signal } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ReportService, SalesReport } from '../report.service';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './sales.component.html',
})
export class SalesReportComponent {
  private readonly svc = inject(ReportService);

  readonly report = signal<SalesReport | null>(null);
  readonly revenueChart = signal<IChartProps | null>(null);

  constructor() {
    this.svc.getSales().subscribe((report) => {
      this.report.set(report);
      this.revenueChart.set(this.buildRevenueChart(report.revenueByDate));
    });
  }

  private buildRevenueChart(revenueByDate: { date: string; value: number }[]): IChartProps {
    return {
      type: 'bar',
      data: {
        labels: revenueByDate.map((d) => d.date),
        datasets: [{ label: 'Revenue', data: revenueByDate.map((d) => d.value), backgroundColor: '#d3a04e', borderRadius: 4 }],
      },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
    };
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
