import { Component, DestroyRef, DOCUMENT, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';

import { SharedUIModule } from '../../shared/shared-ui.module';
import { DashboardChartsData, IChartProps, SalesPeriod } from './dashboard-charts-data';
import { DashboardKpiService } from './dashboard-kpi.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    SharedUIModule,
    RouterLink,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    TableDirective,
  ],
})
export class DashboardComponent implements OnInit {
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  readonly kpi = inject(DashboardKpiService);

  readonly salesPeriods: SalesPeriod[] = ['Today', 'Week', 'Month', 'Year'];
  activePeriod: SalesPeriod = 'Month';

  salesChart: IChartProps = { type: 'line' };
  orderStatusChart!: IChartProps;
  revenueByCategoryChart!: IChartProps;

  ngOnInit(): void {
    this.setSalesPeriod('Month');
    this.orderStatusChart = this.#chartsData.buildOrderStatusChart(this.kpi.orderStatusBuckets);
    this.revenueByCategoryChart = this.#chartsData.buildRevenueByCategoryChart(this.kpi.revenueByCategory);
    this.updateChartOnColorModeChange();
  }

  setSalesPeriod(period: string): void {
    this.activePeriod = period as SalesPeriod;
    this.#chartsData.initMainChart(this.activePeriod);
    this.salesChart = { ...this.#chartsData.mainChart };
  }

  updateChartOnColorModeChange(): void {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setSalesPeriod(this.activePeriod);
      this.orderStatusChart = this.#chartsData.buildOrderStatusChart(this.kpi.orderStatusBuckets);
      this.revenueByCategoryChart = this.#chartsData.buildRevenueByCategoryChart(this.kpi.revenueByCategory);
    });

    this.#destroyRef.onDestroy(() => unListen());
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
