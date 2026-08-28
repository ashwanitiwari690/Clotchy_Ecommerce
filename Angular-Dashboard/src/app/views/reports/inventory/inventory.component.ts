import { Component, inject, signal } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { ReportService, InventoryReport } from '../report.service';
import { CategoryService } from '../../categories/category.service';
import { Product } from '../../../core/models/product.model';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './inventory.component.html',
})
export class InventoryReportComponent {
  private readonly svc = inject(ReportService);
  private readonly categorySvc = inject(CategoryService);

  readonly report = signal<InventoryReport | null>(null);
  readonly stockByCategoryChart = signal<IChartProps | null>(null);

  constructor() {
    this.svc.getInventory().subscribe((report) => {
      this.report.set(report);
      this.stockByCategoryChart.set({
        type: 'bar',
        data: {
          labels: report.stockByCategory.map((c) => c.label),
          datasets: [{ label: 'Stock', data: report.stockByCategory.map((c) => c.value), backgroundColor: '#d3a04e', borderRadius: 4 }],
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
    });
  }

  productStatus(p: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (p.stock === 0) return 'out-of-stock';
    if (p.stock <= p.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  }

  categoryName(id: string): string {
    return this.categorySvc.getById(id)?.name ?? '—';
  }
}
