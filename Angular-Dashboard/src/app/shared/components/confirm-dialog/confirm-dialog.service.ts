import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export interface ConfirmState {
  opts: ConfirmOptions;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly state$ = new BehaviorSubject<ConfirmState | null>(null);

  get state(): Observable<ConfirmState | null> {
    return this.state$.asObservable();
  }

  confirm(opts: ConfirmOptions): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.state$.next({
        opts,
        resolve: (value: boolean) => {
          subscriber.next(value);
          subscriber.complete();
          this.state$.next(null);
        },
      });
    });
  }

  respond(value: boolean): void {
    this.state$.value?.resolve(value);
  }
}
