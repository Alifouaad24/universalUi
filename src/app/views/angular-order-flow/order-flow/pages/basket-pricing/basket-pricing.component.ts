import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ProductLine } from '../../order-flow.models';
import { apiErrorMessage, isPriceEdited, money } from '../../order-flow.utils';
import { OrderApiService } from '../../services/order-api.service';
import { OrderDraftStore } from '../../services/order-draft.store';
import { OrderToastService } from '../../services/order-toast.service';
import { OfIconComponent } from '../../shared/of-icon.component';
import { ProductLineCardComponent } from '../../shared/product-line-card/product-line-card.component';
import { TotalsBarComponent } from '../../shared/totals-bar/totals-bar.component';

/**
 * الخطوة 1 — تسعير السلة:
 * رابط السلة ← جلب المنتجات ← تعديل سعر القطعة والكمية ← «إنشاء الطلب».
 *
 * تُفتح مع query params من صفحة المورّد:
 *   ?businessId=&platformId=&serviceId=&providerId=
 */
@Component({
  selector: 'of-basket-pricing',
  imports: [OfIconComponent, ProductLineCardComponent, TotalsBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basket-pricing.component.html',
})
export class BasketPricingComponent implements OnInit {
  readonly store = inject(OrderDraftStore);
  private readonly api = inject(OrderApiService);
  private readonly toast = inject(OrderToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly fetching = signal(false);
  readonly money = money;
  readonly isPriceEdited = isPriceEdited;

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    if (q.has('businessId')) {
      this.store.start({
        businessId: 46,
        platformId: 8,
        serviceId: Number(q.get('serviceId')),
        providerId: 28,
      });
    }
  }

  // ---------- رابط السلة ----------
  onLinkInput(value: string): void {
    this.store.cartLink.set(value);
  }

  async paste(): Promise<void> {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) this.store.cartLink.set(text);
    } catch {
      this.toast.warning('تعذّر الوصول للحافظة، الصق الرابط يدويًا');
    }
  }

  fetchCart(): void {
    const link = this.store.cartLink().trim();
    if (!link || this.fetching()) return;

    this.fetching.set(true);
    this.api
      .extractCart(link)
      .pipe(
        finalize(() => this.fetching.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (lines) => {
          const added = this.store.addProducts(lines);
          if (added === 0) this.toast.warning('لم يتم العثور على منتجات متوفرة في السلة');
          else this.toast.success(added === 1 ? 'تمت إضافة منتج واحد' : `تمت إضافة ${added} منتجات`);
        },
        error: (e) => this.toast.error(apiErrorMessage(e)),
      });
  }

  // ---------- المنتجات ----------
  onPriceInput(p: ProductLine, el: HTMLInputElement): void {
    this.store.setUnitPrice(p.uid, el.value);
    const clean = this.store.products().find((x) => x.uid === p.uid)?.priceText ?? '';
    if (el.value !== clean) el.value = clean; // يمنع الأحرف غير المسموحة
  }

  isInvalid(p: ProductLine): boolean {
    return (p.price ?? 0) <= 0;
  }

  // ---------- التالي ----------
  // createOrder(): void {
  //   // if (!this.store.context()) {
  //   //   this.toast.warning('افتح الطلب من صفحة المورّد أولًا');
  //   //   return;
  //   // }
  //   // const error = this.store.validateProducts();
  //   // if (error) {
  //   //   this.toast.warning(error);
  //   //   return;
  //   // }
  //   (document.activeElement as HTMLElement | null)?.blur();
  //   this.router.navigate(['create-order'], { relativeTo: this.route.parent });
  // }

  adminPhone = '9647707132380'; // رقم الأدمن بالصيغة الدولية بدون + أو أصفار

  createOrder() {
    /*
    // الكود الحالي معلّق مؤقتًا
    ...
    */
    const message = 'مرحبًا، أريد التواصل بخصوص طلبي';
    const url = `https://wa.me/${this.adminPhone}?text=${encodeURIComponent(message)}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    isMobile ? (window.location.href = url) : window.open(url, '_blank');



    window.location.href = url;
  }
}
