import { Component } from '@angular/core';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { PRODUCTS_MOCK } from '../../../core/mock-data/products.mock';
import { CATEGORIES_MOCK, getCategoryById } from '../../../core/mock-data/categories.mock';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent],
  templateUrl: './inventory.component.html',
})
export class InventoryReportComponent {
  readonly totalSkus = PRODUCTS_MOCK.length;
  readonly inStockCount = PRODUCTS_MOCK.filter((p) => p.stock > p.lowStockThreshold).length;
  readonly lowStockCount = PRODUCTS_MOCK.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  readonly outOfStockCount = PRODUCTS_MOCK.filter((p) => p.stock === 0).length;

  readonly stockByCategoryChart: IChartProps = this.buildChart();

  private buildChart(): IChartProps {
    const totals = new Map<string, number>();
    for (const p of PRODUCTS_MOCK) {
      totals.set(p.categoryId, (totals.get(p.categoryId) ?? 0) + p.stock);
    }
    return {
      type: 'bar',
      data: {
        labels: CATEGORIES_MOCK.map((c) => c.name),
        datasets: [{ label: 'Stock', data: CATEGORIES_MOCK.map((c) => totals.get(c.id) ?? 0), backgroundColor: '#d3a04e', borderRadius: 4 }],
      },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
    };
  }

  productStatus(p: (typeof PRODUCTS_MOCK)[number]): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (p.stock === 0) return 'out-of-stock';
    if (p.stock <= p.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  }

  categoryName(id: string): string {
    return getCategoryById(id)?.name ?? '—';
  }

  readonly products = PRODUCTS_MOCK;
}
