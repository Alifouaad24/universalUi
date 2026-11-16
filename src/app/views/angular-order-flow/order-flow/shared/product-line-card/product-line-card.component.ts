import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { ProductLine } from '../../order-flow.models';
import {
  detectedColor,
  detectedSize,
  discountPercent,
  extraOptions,
  money,
  productImage,
  productName,
  retailPrice,
} from '../../order-flow.utils';
import { OfIconComponent } from '../of-icon.component';

/** كارت منتج: صورة قابلة للتكبير + الاسم + اللون والمقاس + السعر الأصلي والخصم. */
@Component({
  selector: 'of-product-line-card',
  imports: [OfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-line-card.component.html',
  styleUrl: './product-line-card.component.scss',
  host: { '(document:keydown.escape)': 'zoomed.set(false)' },
})
export class ProductLineCardComponent {
  readonly line = input.required<ProductLine>();
  readonly remove = output<void>();

  readonly zoomed = signal(false);
  readonly imageFailed = signal(false);

  readonly name = computed(() => productName(this.line()) ?? 'منتج بدون اسم');
  readonly image = computed(() => productImage(this.line()));
  readonly color = computed(() => detectedColor(this.line()));
  readonly size = computed(() => detectedSize(this.line()));
  readonly extras = computed(() => extraOptions(this.line()));
  readonly discount = computed(() => discountPercent(this.line()));
  readonly retail = computed(() => {
    const r = retailPrice(this.line());
    const p = this.line().originalPrice ?? 0;
    return r && r > p ? r : null;
  });
  readonly link = computed(() => {
    const l = this.line().raw['link'];
    return typeof l === 'string' && l ? l : null;
  });

  readonly money = money;
}
