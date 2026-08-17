import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (svc.state | async; as c) {
      <div class="confirm-backdrop" (click)="svc.respond(false)">
        <div class="confirm-box" (click)="$event.stopPropagation()">
          <h5 class="mb-2">{{ c.opts.title || 'Please Confirm' }}</h5>
          <p class="text-body-secondary mb-4">{{ c.opts.message }}</p>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" (click)="svc.respond(false)">
              {{ c.opts.cancelText || 'Cancel' }}
            </button>
            <button
              type="button"
              class="btn"
              [class.btn-danger]="c.opts.danger"
              [class.btn-primary]="!c.opts.danger"
              (click)="svc.respond(true)"
            >
              {{ c.opts.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1080;
    }
    .confirm-box {
      background: var(--cui-body-bg);
      color: var(--cui-body-color);
      border-radius: 0.5rem;
      padding: 1.5rem;
      width: 380px;
      max-width: 90vw;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
    }
  `],
})
export class ConfirmDialogComponent {
  protected svc = inject(ConfirmDialogService);
}
