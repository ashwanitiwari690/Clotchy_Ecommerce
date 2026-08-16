import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toast$ | async as toast">
      <div class="toast" [ngClass]="toast.type">
        {{ toast.message }}
        <button class="close-btn" id="closetoast" (click)="close()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 20px; right: 20px; width: 300px; z-index: 9999; }
    .toast { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 5px; color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
    .success { background-color: #4caf50; }
    .error { background-color: #f44336; }
    .info { background-color: #2196f3; }
    .warning { background-color: #ff9800; }
    .close-btn { background: transparent; border: none; color: #fff; font-size: 18px; cursor: pointer; }
  `]
})
export class ToastComponent {
  
  toast$ = this.toastService.getToast();

  constructor(private toastService: ToastService) {}
  close(): void {
    this.toastService.clear();
  }
}
