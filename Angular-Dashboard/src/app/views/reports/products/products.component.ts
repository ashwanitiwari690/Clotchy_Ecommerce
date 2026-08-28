import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ReportService, ProductsReport } from '../report.service';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-product-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent, DecimalPipe],
  templateUrl: './products.component.html',
})
export class ProductReportComponent {
  private readonly svc = inject(ReportService);

  readonly report = signal<ProductsReport | null>(null);
  readonly categoryChart = signal<IChartProps | null>(null);

  private static readonly COLORS = ['#d3a04e', '#3399ff', '#2eb85c', '#e55353', '#f9b115', '#20a8d8', '#6f42c1', '#e83e8c'];

  constructor() {
    this.svc.getProducts().subscribe((report) => {
      this.report.set(report);
      this.categoryChart.set({
        type: 'doughnut',
        data: {
          labels: report.countByCategory.map((c) => c.label),
          datasets: [{ data: report.countByCategory.map((c) => c.value), backgroundColor: ProductReportComponent.COLORS }],
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      });
    });
  }
}
