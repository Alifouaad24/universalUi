import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, catchError, debounceTime, finalize, map, of, switchMap } from 'rxjs';

import { ORDER_FLOW_CONFIG } from '../../order-flow.config';
import { addressText, apiErrorMessage, filterDecimal } from '../../order-flow.utils';
import { OrderApiService } from '../../services/order-api.service';
import { OrderDraftStore } from '../../services/order-draft.store';
import { OrderToastService } from '../../services/order-toast.service';
import { OfIconComponent } from '../../shared/of-icon.component';
import { TotalsBarComponent } from '../../shared/totals-bar/totals-bar.component';

type SearchResult = { q: string; names: string[] } | { q: string; error: unknown };

/**
 * الخطوة 2 — بيانات الطلب: الزبون + سعر الصرف ← «مراجعة الطلب».
 */
@Component({
  selector: 'of-create-order',
  imports: [OfIconComponent, TotalsBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-order.component.html',
})
export class CreateOrderComponent implements OnInit {
  readonly store = inject(OrderDraftStore);
  private readonly api = inject(OrderApiService);
  private readonly toast = inject(OrderToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cfg = inject(ORDER_FLOW_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  // ---------- حالة البحث عن الزبون ----------
  readonly suggestions = signal<string[]>([]);
  readonly searching = signal(false);
  readonly loadingCustomer = signal(false);
  readonly notFound = signal(false);

  readonly address = computed(() => {
    const c = this.store.customer();
    return c ? addressText(c) : '';
  });

  readonly initial = computed(() => {
    const name = this.store.customer()?.customerName ?? '';
    return name ? [...name][0] : '?';
  });

  private readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(400),
        switchMap((q) =>
          q
            ? this.api.searchCustomers(q).pipe(
                map((names): SearchResult => ({ q, names })),
                catchError((error) => of<SearchResult>({ q, error })),
              )
            : EMPTY,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((r) => {
        // نتيجة قديمة؟ المستخدم غيّر الرقم بعدها
        if (r.q !== this.store.phoneQuery().trim()) return;
        this.searching.set(false);
        if ('error' in r) {
          this.toast.error(apiErrorMessage(r.error));
          return;
        }
        this.suggestions.set(r.names);
        this.notFound.set(r.names.length === 0);
      });
  }

  ngOnInit(): void {
    // رجوع من صفحة إضافة زبون: نعيد البحث حتى يظهر الزبون الجديد
    if (!this.store.customer() && this.store.phoneQuery()) {
      this.onPhoneInput(this.store.phoneQuery());
    }
  }

  // ==========================================================
  // الزبون
  // ==========================================================
  onPhoneInput(value: string): void {
    this.store.phoneQuery.set(value);
    this.suggestions.set([]);
    this.notFound.set(false);

    const q = value.trim();
    if (q.length >= 3 && /^\d/.test(q)) {
      this.searching.set(true);
      this.search$.next(q);
    } else {
      this.searching.set(false);
      this.search$.next(''); // يلغي أي بحث جارٍ
    }
  }

  selectCustomer(name: string): void {
    this.suggestions.set([]);
    this.loadingCustomer.set(true);

    this.api
      .getCustomerDetails(name)
      .pipe(
        finalize(() => this.loadingCustomer.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (customer) => {
          this.store.customer.set(customer);
          this.notFound.set(false);
          this.store.phoneQuery.set('');
        },
        error: (e) => this.toast.error(apiErrorMessage(e)),
      });
  }

  removeCustomer(): void {
    this.store.customer.set(null);
  }

  openAddCustomer(): void {
    this.router.navigate([this.cfg.addCustomerUrl], {
      queryParams: {
        phone: this.store.phoneQuery().trim(),
        businessId: this.store.context()?.businessId,
        returnUrl: this.router.url,
      },
    });
  }

  // ==========================================================
  // سعر الصرف
  // ==========================================================
  onRateInput(el: HTMLInputElement): void {
    const clean = filterDecimal(el.value);
    if (el.value !== clean) el.value = clean;
    this.store.setExchangeRate(clean);
  }

  // ==========================================================
  // التنقل
  // ==========================================================
  back(): void {
    this.router.navigate(['./'], { relativeTo: this.route.parent });
  }

  goToReview(): void {
    // const error = this.store.validate();
    // if (error) {
    //   this.toast.warning(error);
    //   return;
    // }
    (document.activeElement as HTMLElement | null)?.blur();
    this.router.navigate(['review-order'], { relativeTo: this.route.parent });
  }

  money(value: number): string {
    return (value ?? 0).toLocaleString('en-US');
  }
}
