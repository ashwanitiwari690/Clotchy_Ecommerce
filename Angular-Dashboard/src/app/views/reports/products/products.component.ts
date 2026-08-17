import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent } from '@coreui/angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { PRODUCTS_MOCK } from '../../../core/mock-data/products.mock';
import { CATEGORIES_MOCK, getCategoryById } from '../../../core/mock-data/categories.mock';
import { IChartProps } from '../../dashboard/dashboard-charts-data';

@Component({
  selector: 'app-product-report',
  standalone: true,
  imports: [SharedUIModule, CardComponent, CardBodyComponent, CardHeaderComponent, RowComponent, ColComponent, DecimalPipe],
  templateUrl: './products.component.html',
})
export class ProductReportComponent {
  readonly bestSelling = [...PRODUCTS_MOCK].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 6);

  readonly mostViewed = PRODUCTS_MOCK
    .map((p) => ({ ...p, views: p.unitsSold * 7 + 120 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  readonly lowStock = PRODUCTS_MOCK.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);

  readonly categoryChart: IChartProps = this.buildCategoryChart();

  private buildCategoryChart(): IChartProps {
    const counts = new Map<string, number>();
    for (const p of PRODUCTS_MOCK) {
      counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
    }
    const colors = ['#d3a04e', '#3399ff', '#2eb85c', '#e55353', '#f9b115', '#20a8d8', '#6f42c1', '#e83e8c'];
    return {
      type: 'doughnut',
      data: {
        labels: CATEGORIES_MOCK.map((c) => c.name),
        datasets: [{ data: CATEGORIES_MOCK.map((c) => counts.get(c.id) ?? 0), backgroundColor: colors }],
      },
      options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
    };
  }

  categoryName(id: string): string {
    return getCategoryById(id)?.name ?? '—';
  }
}
