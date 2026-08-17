import { Injectable } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType, PluginOptionsByType, ScaleOptions, TooltipLabelStyle } from 'chart.js';
import { DeepPartial } from './utils';
import { getStyle } from '@coreui/utils';
import { OrderStatusBucket } from './dashboard-kpi.service';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

export type SalesPeriod = 'Today' | 'Week' | 'Month' | 'Year';

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: SalesPeriod = 'Month') {
    const brandPrimary = getStyle('--cui-primary') ?? '#d3a04e';
    const brandPrimaryBg = `rgba(${getStyle('--cui-primary-rgb')}, .12)`;
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';

    let labels: string[] = [];
    let elements = 12;

    switch (period) {
      case 'Today':
        labels = Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`);
        elements = 12;
        break;
      case 'Week':
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        elements = 7;
        break;
      case 'Year':
        const currentYear = new Date().getFullYear();
        labels = Array.from({ length: 5 }, (_, i) => `${currentYear - 4 + i}`);
        elements = 5;
        break;
      case 'Month':
      default:
        labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        elements = 12;
        break;
    }

    this.mainChart['elements'] = elements;
    this.mainChart['Data1'] = Array.from({ length: elements }, () => this.random(20000, 95000));
    this.mainChart['Data2'] = Array.from({ length: elements }, () => this.random(80, 320));

    const datasets: ChartDataset[] = [
      {
        data: this.mainChart['Data1'],
        label: 'Revenue (₹)',
        backgroundColor: brandPrimaryBg,
        borderColor: brandPrimary,
        pointHoverBackgroundColor: brandPrimary,
        borderWidth: 2,
        fill: true,
        yAxisID: 'y',
      },
      {
        data: this.mainChart['Data2'],
        label: 'Orders',
        backgroundColor: 'transparent',
        borderColor: brandInfo,
        pointHoverBackgroundColor: '#fff',
        borderDash: [6, 4],
        yAxisID: 'y1',
      },
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: { display: true, position: 'bottom' as const },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: { color: colorBorderTranslucent, drawOnChartArea: false },
          ticks: { color: colorBody },
        },
        y: {
          type: 'linear',
          position: 'left',
          border: { color: colorBorderTranslucent },
          grid: { color: colorBorderTranslucent },
          beginAtZero: true,
          ticks: { color: colorBody, maxTicksLimit: 5 },
        },
        y1: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: { color: colorBody, maxTicksLimit: 5 },
        },
      },
      elements: {
        line: { tension: 0.4 },
        point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = { datasets, labels };
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      x: {
        grid: { color: colorBorderTranslucent, drawOnChartArea: false },
        ticks: { color: colorBody }
      },
      y: {
        border: { color: colorBorderTranslucent },
        grid: { color: colorBorderTranslucent },
        beginAtZero: true,
        ticks: { color: colorBody, maxTicksLimit: 5 }
      },
      y1: {
        grid: { drawOnChartArea: false },
        ticks: { color: colorBody, maxTicksLimit: 5 }
      }
    };
    return scales;
  }

  buildOrderStatusChart(buckets: OrderStatusBucket[]): IChartProps {
    return {
      type: 'doughnut',
      data: {
        labels: buckets.map(b => b.label),
        datasets: [{
          data: buckets.map(b => b.value),
          backgroundColor: buckets.map(b => b.color),
          hoverBackgroundColor: buckets.map(b => b.color),
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    };
  }

  buildRevenueByCategoryChart(data: { label: string; value: number }[]): IChartProps {
    const brandPrimary = getStyle('--cui-primary') ?? '#d3a04e';
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    return {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label: 'Revenue (₹)',
          data: data.map(d => d.value),
          backgroundColor: brandPrimary,
          borderRadius: 4,
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: colorBody } },
          y: { grid: { color: colorBorderTranslucent }, ticks: { color: colorBody }, beginAtZero: true },
        },
      },
    };
  }
}
