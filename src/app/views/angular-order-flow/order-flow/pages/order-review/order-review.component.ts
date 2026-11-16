import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ORDER_FLOW_CONFIG } from '../../order-flow.config';
import { addressText, apiErrorMessage, filterDigits, money, toWhatsAppNumber } from '../../order-flow.utils';
import { OrderApiService } from '../../services/order-api.service';
import { OrderDraftStore } from '../../services/order-draft.store';
import { OrderToastService } from '../../services/order-toast.service';
import { OfIconComponent } from '../../shared/of-icon.component';

/**
 * الخطوة 3 — مراجعة الطلب: ملخص الزبون والحساب + رسوم التوصيل
 * ← «حفظ» (statusSavedId) أو «إرسال» (statusSentId + واتساب).
 */
@Component({
  selector: 'of-order-review',
  imports: [OfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-review.component.html',
})
export class OrderReviewComponent {
  readonly store = inject(OrderDraftStore);
  readonly cfg = inject(ORDER_FLOW_CONFIG);
  private readonly api = inject(OrderApiService);
  private readonly toast = inject(OrderToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  /** أي زر يحفظ الآن (حتى يظهر التحميل على الزر الصحيح فقط) */
  readonly savingStatusId = signal<number | null>(null);
  readonly done = signal(false);
  readonly busy = computed(() => this.savingStatusId() !== null || this.done());

  readonly address = computed(() => {
    const c = this.store.customer();
    return c ? addressText(c) : '';
  });

  readonly money = money;

  onDeliveryInput(el: HTMLInputElement): void {
    const clean = filterDigits(el.value);
    if (el.value !== clean) el.value = clean;
    this.store.setDeliveryFee(clean);
  }

  back(): void {
    this.router.navigate(['create'], { relativeTo: this.route.parent });
  }

  save(statusId: number): void {
    if (this.busy()) return;

    const error = this.store.validate();
    if (error) {
      this.toast.warning(error);
      return;
    }
    if (this.store.currentBusinessId() === null) {
      this.toast.error('تعذّر تحديد النشاط الحالي، أعد تسجيل الدخول');
      return;
    }

    const isSend = statusId === this.cfg.statusSentId;
    // نفتح نافذة الواتساب الآن (أثناء ضغطة الزر) حتى لا يمنعها المتصفح بعد انتهاء الطلب
    const waWindow = isSend ? window.open('', '_blank') : null;

    this.savingStatusId.set(statusId);
    this.api
      .addOrder(this.store.buildRequest(statusId))
      .pipe(
        finalize(() => this.savingStatusId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          if (isSend) this.openWhatsApp(waWindow);
          this.toast.success(isSend ? 'تم حفظ الطلب وإرساله' : 'تم حفظ الطلب بنجاح');
          this.done.set(true);
          setTimeout(() => {
            this.store.reset();
            this.router.navigateByUrl(this.cfg.afterSaveUrl);
          }, 1200);
        },
        error: (e) => {
          waWindow?.close();
          this.toast.error(apiErrorMessage(e));
        },
      });
  }

  private openWhatsApp(win: Window | null): void {
    const url =
      `https://wa.me/${toWhatsAppNumber(this.cfg.whatsappNumber)}` +
      `?text=${encodeURIComponent(this.store.whatsappMessage())}`;

    if (win && !win.closed) {
      win.opener = null;
      win.location.href = url;
      return;
    }
    if (!window.open(url, '_blank', 'noopener')) {
      this.toast.warning('تم حفظ الطلب، لكن تعذّر فتح الواتساب');
    }
  }
}
