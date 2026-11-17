import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { TariffOption } from '../../order-flow.models';
import { plainNumber } from '../../order-flow.utils';
import { OfIconComponent } from '../of-icon.component';

/**
 * حقل اختيار تعريفة الشحن (مثل TariffSelector بنسخة Flutter):
 * بطاقة تفتح قائمة منسدلة فيها بحث وبطاقات الخطوط
 * — على الشاشات الصغيرة تظهر كـ Bottom Sheet.
 */
@Component({
  selector: 'of-tariff-select',
  imports: [OfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tariff-select.component.html',
  styleUrl: './tariff-select.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close()',
  },
})
export class TariffSelectComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly items = input<TariffOption[]>([]);
  readonly selected = input<TariffOption | null>(null);
  readonly loading = input(false);
  readonly disabled = input(false);

  readonly selectedChange = output<TariffOption | null>();
  /** عند عدم وجود تعريفات والضغط على الحقل */
  readonly retry = output<void>();

  readonly open = signal(false);
  readonly query = signal('');

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.items();
    if (!q) return list;
    return list.filter(
      (t) => t.label.toLowerCase().includes(q) || t.currency.toLowerCase().includes(q),
    );
  });

  toggle(): void {
    if (this.loading() || this.disabled()) return;
    if (this.items().length === 0) {
      this.retry.emit();
      return;
    }
    this.query.set('');
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  pick(t: TariffOption | null): void {
    this.selectedChange.emit(t);
    this.close();
  }

  onDocumentClick(e: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(e.target as Node)) this.close();
  }

  icon(t: TariffOption | null): string {
    if (!t) return 'truck';
    return t.mode === 'air' ? 'plane' : t.mode === 'sea' ? 'ship' : 'truck';
  }

  priceText(t: TariffOption): string {
    return `${plainNumber(t.price)} ${t.currency}`.trim();
  }
}
