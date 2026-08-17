import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IChartProps } from '../../../views/dashboard/dashboard-charts-data';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, ChartjsComponent],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() chart!: IChartProps;
  @Input() height = 260;
  @Input() periods: string[] = [];
  @Input() activePeriod = '';
  @Output() periodChange = new EventEmitter<string>();
}
