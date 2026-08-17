import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconDirective],
  template: `
    <div class="empty-state text-center py-5">
      <svg cIcon [name]="icon" width="48" height="48" class="text-body-secondary mb-3"></svg>
      <h6 class="mb-1">{{ title }}</h6>
      @if (message) {
        <p class="text-body-secondary small mb-3">{{ message }}</p>
      }
      @if (actionLabel) {
        <button type="button" class="btn btn-primary btn-sm" (click)="action.emit()">{{ actionLabel }}</button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'cilInbox';
  @Input() title = 'Nothing here yet';
  @Input() message?: string;
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
