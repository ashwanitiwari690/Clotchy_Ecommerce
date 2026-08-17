import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';

export interface StatDelta {
  value: number;
  direction: 'up' | 'down';
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon = 'cilChartLine';
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark' = 'primary';
  @Input() delta?: StatDelta;
}
