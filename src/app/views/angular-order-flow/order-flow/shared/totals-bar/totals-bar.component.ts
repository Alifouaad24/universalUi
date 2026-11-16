import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { money } from '../../order-flow.utils';
import { OfIconComponent } from '../of-icon.component';

/** الشريط السفلي: الإجمالي بالدولار والدينار + زر إجراء (يُخفى إذا actionLabel = null). */
@Component({
  selector: 'of-totals-bar',
  imports: [OfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './totals-bar.component.html',
})
export class TotalsBarComponent {
  readonly units = input.required<number>();
  readonly usd = input.required<number>();
  readonly iqd = input.required<number>();
  readonly actionLabel = input<string | null>(null);
  readonly actionIcon = input('arrow-left');
  readonly disabled = input(false);

  readonly action = output<void>();

  readonly money = money;

  readonly caption = computed(() => {
    const n = this.units();
    if (n === 0) return 'الإجمالي';
    if (n === 1) return 'الإجمالي • منتج واحد';
    return `الإجمالي • ${n} منتجات`;
  });
}
