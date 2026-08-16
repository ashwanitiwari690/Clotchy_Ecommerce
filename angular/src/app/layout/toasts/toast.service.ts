import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private toast$ = new BehaviorSubject<Toast | null>(null);
  private timeoutId: any;

  getToast() {
    return this.toast$.asObservable();
  }

  show(message: string, type: ToastType = 'info', duration = 3000): void {
    // clear previous timeout (important)
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toast$.next({ message, type });

    this.timeoutId = setTimeout(() => {
      this.clear();
    }, duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  clear(): void {
    this.toast$.next(null);
  }
}
