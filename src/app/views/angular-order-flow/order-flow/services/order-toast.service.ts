import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

/** تنبيهات خفيفة تظهر أسفل الشاشة (بديل AppSnack). */
@Injectable({ providedIn: 'root' })
export class OrderToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(kind: ToastKind, text: string, ms = 3800): void {
    const id = ++this.nextId;
    this.toasts.update((t) => [...t.slice(-2), { id, kind, text }]);
    setTimeout(() => this.dismiss(id), ms);
  }

  success(text: string): void { this.show('success', text); }
  error(text: string): void { this.show('error', text, 5000); }
  warning(text: string): void { this.show('warning', text); }
  info(text: string): void { this.show('info', text); }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
