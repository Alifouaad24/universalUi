import { Injectable, computed, inject, signal } from '@angular/core';

import { ORDER_FLOW_CONFIG } from '../order-flow.config';
import { AddOrderRequest, Customer, OrderContext, ProductLine } from '../order-flow.models';
import {
  addressText,
  filterDecimal,
  iqd,
  isAvailable,
  lineToJson,
  plainNumber,
} from '../order-flow.utils';

/**
 * حالة الطلب المشتركة بين الشاشات الثلاث:
 * تسعير السلة ← بيانات الطلب ← مراجعة الطلب.
 * (مقابل NewOrderController بنسخة Flutter)
 */
@Injectable({ providedIn: 'root' })
export class OrderDraftStore {
  private readonly cfg = inject(ORDER_FLOW_CONFIG);

  // ---------- السياق (من صفحة المورّد) ----------
  readonly context = signal<OrderContext | null>(null);

  // ---------- السلة والمنتجات ----------
  readonly cartLink = signal('');
  readonly products = signal<ProductLine[]>([]);

  // ---------- الزبون ----------
  readonly phoneQuery = signal('');
  readonly customer = signal<Customer | null>(null);

  // ---------- سعر الصرف والتوصيل ----------
  readonly exchangeRateText = signal(String(this.cfg.defaultExchangeRate));
  readonly exchangeRate = signal(this.cfg.defaultExchangeRate);
  readonly deliveryFeeText = signal('0');
  readonly deliveryFee = signal(0);

  // ==========================================================
  // المجاميع
  // ==========================================================
  readonly totalUnits = computed(() => this.products().reduce((s, p) => s + p.count, 0));

  readonly productsTotal = computed(() =>
    this.products().reduce((s, p) => s + (p.price ?? 0) * p.count, 0),
  );

  /** السعر بالدينار مقرّبًا لأقرب ألف */
  readonly productsTotalIqd = computed(
    () => Math.round((this.productsTotal() * this.exchangeRate()) / 1000) * 1000,
  );

  readonly grandTotalIqd = computed(() => this.productsTotalIqd() + this.deliveryFee());

  // ==========================================================
  // دورة الحياة
  // ==========================================================
  /** بداية طلب جديد من صفحة المورّد */
  start(ctx: OrderContext): void {
    this.reset();
    this.context.set(ctx);
  }

  reset(): void {
    this.context.set(null);
    this.cartLink.set('');
    this.products.set([]);
    this.phoneQuery.set('');
    this.customer.set(null);
    this.exchangeRateText.set(String(this.cfg.defaultExchangeRate));
    this.exchangeRate.set(this.cfg.defaultExchangeRate);
    this.deliveryFeeText.set('0');
    this.deliveryFee.set(0);
  }

  // ==========================================================
  // المنتجات
  // ==========================================================
  /** يضيف المنتجات المتوفرة فقط، ويرجع عدد ما أُضيف */
  addProducts(lines: ProductLine[]): number {
    const available = lines.filter(isAvailable);
    this.products.update((list) => [...list, ...available]);
    return available.length;
  }

  removeProduct(uid: string): void {
    this.products.update((list) => list.filter((p) => p.uid !== uid));
  }

  increment(uid: string): void {
    this.patch(uid, (p) => ({ count: p.count + 1 }));
  }

  /** عند آخر نسخة يُحذف المنتج */
  decrement(uid: string): void {
    const p = this.products().find((x) => x.uid === uid);
    if (!p) return;
    if (p.count <= 1) this.removeProduct(uid);
    else this.patch(uid, () => ({ count: p.count - 1 }));
  }

  setUnitPrice(uid: string, text: string): void {
    const clean = filterDecimal(text);
    const v = clean.trim() === '' ? null : Number.parseFloat(clean);
    this.patch(uid, () => ({ priceText: clean, price: Number.isFinite(v as number) ? v : null }));
  }

  resetUnitPrice(uid: string): void {
    this.patch(uid, (p) => ({ price: p.originalPrice, priceText: plainNumber(p.originalPrice ?? 0) }));
  }

  private patch(uid: string, fn: (p: ProductLine) => Partial<ProductLine>): void {
    this.products.update((list) => list.map((p) => (p.uid === uid ? { ...p, ...fn(p) } : p)));
  }

  // ==========================================================
  // سعر الصرف والتوصيل
  // ==========================================================
  setExchangeRate(text: string): void {
    this.exchangeRateText.set(text);
    const v = Number.parseFloat(text.trim());
    if (!Number.isFinite(v) || v <= 0) return;
    this.exchangeRate.set(v);
  }

  setDeliveryFee(text: string): void {
    this.deliveryFeeText.set(text);
    const v = Number.parseFloat(text.trim());
    this.deliveryFee.set(Number.isFinite(v) ? v : 0);
  }

  // ==========================================================
  // التحقق
  // ==========================================================
  /** قبل الانتقال من تسعير السلة إلى بيانات الطلب */
  validateProducts(): string | null {
    if (this.products().length === 0) return 'أضف منتجًا واحدًا على الأقل';
    if (this.products().some((p) => (p.price ?? 0) <= 0)) return 'يوجد منتج بدون سعر';
    return null;
  }

  /** قبل المراجعة والحفظ (نفس _validate بنسخة Flutter) */
  validate(): string | null {
    if (!this.customer()) return 'اختر الزبون أولًا';
    if (!this.context()?.providerId) return 'اختر مزود الخدمة';
    return this.validateProducts();
  }

  // ==========================================================
  // الحفظ
  // ==========================================================
  currentBusinessId(): number | null {
    const v = Number(localStorage.getItem(this.cfg.currentBusinessIdStorageKey));
    return Number.isFinite(v) && v > 0 ? v : null;
  }

  buildRequest(statusId: number): AddOrderRequest {
    const ctx = this.context()!;
    return {
      cartValue: this.cartLink().trim(),
      platform_id: ctx.platformId,
      business_id: ctx.businessId,
      service_id: ctx.serviceId,
      globalCustomerId: this.customer()!.globalCustomerId,
      shippingTypeId: this.cfg.defaultShippingTypeId,
      orderStatusId: statusId,
      // كل نسخة من المنتج تُرسل كعنصر مستقل
      itemInfos: this.products().flatMap((p) => Array.from({ length: p.count }, () => lineToJson(p))),
      providerId: ctx.providerId,
      myBusiness_id: this.currentBusinessId()!,
      required: this.deliveryFee(),
    };
  }

  /** نص رسالة الواتساب عند «إرسال» */
  whatsappMessage(): string {
    const c = this.customer()!;
    const address = addressText(c);
    const link = this.cartLink().trim();
    return [
      'طلب جديد',
      '',
      `الزبونة: ${c.customerName}`,
      ...(c.customerMobile ? [`الهاتف: ${c.customerMobile}`] : []),
      `العنوان: ${address || '-'}`,
      '',
      `عدد القطع: ${this.totalUnits()}`,
      `السعر بالدولار: ${plainNumber(this.productsTotal())}$`,
      `السعر بالدينار: ${iqd(this.productsTotalIqd())} د.ع`,
      `رسوم التوصيل: ${iqd(this.deliveryFee())} د.ع`,
      `المبلغ الإجمالي: ${iqd(this.grandTotalIqd())} د.ع`,
      ...(link ? ['', `رابط السلة: ${link}`] : []),
    ].join('\n');
  }
}
