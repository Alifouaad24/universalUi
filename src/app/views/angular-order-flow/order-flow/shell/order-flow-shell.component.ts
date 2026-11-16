import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { OrderToastService } from '../services/order-toast.service';
import { OfIconComponent } from '../shared/of-icon.component';

/**
 * الحاوية المشتركة للشاشات الثلاث: مؤشر الخطوات + التنبيهات + التصميم العام.
 * التصميم كله داخل .of-root فقط (لا يؤثر على باقي المشروع).
 */
@Component({
  selector: 'of-order-flow-shell',
  imports: [RouterOutlet, OfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './order-flow-shell.component.html',
  styleUrl: './order-flow-shell.component.scss',
})
export class OrderFlowShellComponent {
  private readonly router = inject(Router);
  readonly toast = inject(OrderToastService);

  readonly steps = ['تسعير السلة', 'بيانات الطلب', 'مراجعة الطلب'];
  readonly step = signal(1);

  constructor() {
    this.syncStep();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.syncStep());
  }

  private syncStep(): void {
    const path = this.router.url.split(/[?#]/)[0];
    this.step.set(path.endsWith('/review') ? 3 : path.endsWith('/create') ? 2 : 1);
  }

  toastIcon(kind: string): string {
    return kind === 'success' ? 'check' : kind === 'info' ? 'info' : 'alert';
  }
}
