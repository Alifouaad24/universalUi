import { HttpErrorResponse } from '@angular/common/http';

import { Customer, ProductLine, TariffOption } from './order-flow.models';

// =============================================================
// تحويلات عامة
// =============================================================
const asNum = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const asStr = (v: unknown): string | null =>
  v === null || v === undefined ? null : String(v);

const asObj = (v: unknown): Record<string, any> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, any>) : {};

// =============================================================
// المنتجات
// =============================================================
let seq = 0;
const newUid = () => `${Date.now()}_${seq++}`;

/** 12 → "12" ، 12.5 → "12.50" (مثل _fmt بنسخة Flutter) */
export function plainNumber(v: number): string {
  return v === Math.round(v) ? v.toFixed(0) : v.toFixed(2);
}

export function productFromRaw(raw: Record<string, unknown>): ProductLine {
  const price = asNum(raw['price']);
  return {
    uid: newUid(),
    raw,
    price,
    originalPrice: price,
    priceText: plainNumber(price ?? 0),
    count: 1,
    sizeId: null,
  };
}

/** تحويل عنصر من رد SheinCartProducts إلى نفس شكل رد المنتج الواحد */
export function productFromCartItem(item: Record<string, any>): ProductLine {
  const pricing = asObj(item['pricing']);
  const sale = asObj(pricing['sale_price']);
  const retail = asObj(pricing['retail_price']);
  const image = asStr(item['image']);

  return productFromRaw({
    name: item['name'],
    sku: item['sku'],
    price: sale['amount'],
    retail_price: retail['amount'],
    discount_percent: pricing['discount_percent'],
    currency: sale['currency'],
    images: image ? [image] : [],
    link: item['link'],
    goods_id: item['goods_id'],
    sku_code: item['sku_code'],
    selected_options: item['selected_options'],
    options: item['options'],
    available: item['in_stock'] === true && item['availability'] === 'available',
  });
}

export const productName = (p: ProductLine) => asStr(p.raw['name']);
export const productCurrency = (p: ProductLine) => asStr(p.raw['currency']);
export const retailPrice = (p: ProductLine) => asNum(p.raw['retail_price']);
export const discountPercent = (p: ProductLine) =>
  Math.round(asNum(p.raw['discount_percent']) ?? 0);
export const isAvailable = (p: ProductLine) => p.raw['available'] !== false;
export const isPriceEdited = (p: ProductLine) => p.price !== p.originalPrice;

export function productImages(p: ProductLine): string[] {
  const v = p.raw['images'];
  if (!Array.isArray(v)) return [];
  return v.map((e) => asStr(e)).filter((e): e is string => !!e);
}

export const productImage = (p: ProductLine) => productImages(p)[0] ?? null;

export function productOptions(p: ProductLine): string[] {
  const v = p.raw['options'];
  if (!Array.isArray(v)) return [];
  return v.map((e) => String(e).trim()).filter((e) => e.length > 0);
}

// ----- المقاس واللون (نفس منطق Flutter) -----
const ONE_SIZE = 'مقاس واحد';
const isOneSize = (o: string) => o === ONE_SIZE || o.toLowerCase() === 'one size';

const SIZE_LETTERS = /^(XXS|XS|S|M|L|XL|XXL|XXXL|[2-6]XL)$/i;
const SIZE_PATTERNS = [
  SIZE_LETTERS, // S / M / XL
  /^\d{1,2}(-\d{1,2})?\s?[YM]$/i, // 2-3Y / 6-9M / 11Y
  /^(EUR|CN|US|UK)\s?\d/i, // EUR22 / UK 10(M)
  /^\d{1,2}(\.\d)?$/, // خواتم: 8
  /^[A-H]{1,2}$/, // مقاس كوب: B / DD
];
/** كميات وأحجام ليست ألوانًا ولا مقاسات: "2 قطعة" / "20Pcs" / "5 بوصات" */
const QUANTITY_PATTERN =
  /\d+\s*(pcs?|pc|set|قطع|قطعة|قطعتان|حزمة|بوصة|بوصات|انش|انشات)/i;

/** المقاس من خيارات المنتج، أو null إذا لم يكن له مقاس */
export function detectedSize(p: ProductLine): string | null {
  const opts = productOptions(p);

  // 1. المقاس داخل الأقواس: 10(L) → L
  for (const o of opts) {
    const m = /\(([A-Z]{1,4})\)/i.exec(o);
    if (m) {
      const size = m[1].toUpperCase();
      if (SIZE_LETTERS.test(size)) return size;
    }
  }

  // 2. المقاسات العادية — نتجاهل الرقم المنفصل إذا يوجد مقاس مركب مثل 8 / 10(L)
  const hasCombinedSize = opts.some((v) => /^\d+\s*\/\s*\d+\s*\([A-Z]{1,4}\)$/i.test(v));
  for (const o of opts) {
    if (isOneSize(o)) return ONE_SIZE;
    if (hasCombinedSize && /^\d{1,2}(\.\d)?$/.test(o)) continue;
    if (SIZE_PATTERNS.some((r) => r.test(o))) return o;
  }
  return null;
}

/** اللون: أول خيار ليس مقاسًا ولا كمية */
export function detectedColor(p: ProductLine): string | null {
  const size = detectedSize(p);
  for (const o of productOptions(p)) {
    if (o === size || isOneSize(o)) continue;
    if (QUANTITY_PATTERN.test(o)) continue;
    return o;
  }
  return null;
}

/** باقي الخيارات (كميات/أحجام/أطقم) */
export function extraOptions(p: ProductLine): string[] {
  const size = detectedSize(p);
  const color = detectedColor(p);
  return productOptions(p).filter((o) => o !== size && o !== color && !isOneSize(o));
}

/**
 * الجيسون المرسل للحفظ.
 * نرسل السعر المعدّل (price) — نسخة Flutter ترسل السعر الأصلي من raw فقط.
 */
export function lineToJson(p: ProductLine): Record<string, unknown> {
  return {
    ...p.raw,
    price: p.price,
    size_id: p.sizeId,
    size: detectedSize(p),
    color: detectedColor(p),
  };
}

// =============================================================
// الزبون
// =============================================================
export function customerFromJson(json: Record<string, any>): Customer {
  const addresses = Array.isArray(json['address']) ? json['address'] : [];
  const first = asObj(addresses[0]);
  return {
    globalCustomerId: asNum(json['globalCustomerId']),
    customerName: asStr(json['customerName']) ?? '',
    customerMobile: asStr(json['customerMobile']),
    countryName: asStr(asObj(json['country'])['name']),
    city: asStr(asObj(first['city'])['description']),
    area: asStr(asObj(first['area'])['description']),
    landMark: asStr(json['land_Mark']),
  };
}

/** الدولة - المدينة - المنطقة - نقطة دالة */
export function addressText(c: Customer): string {
  return [c.countryName, c.city, c.area, c.landMark].filter((x): x is string => !!x).join(' - ');
}

// =============================================================
// تعريفات الشحن (نفس TariffOption.fromTaarefs بنسخة Flutter)
// =============================================================
const FROM_KEYS = [
  'fromCountry', 'sourceCountry', 'countryFrom', 'originCountry',
  'from', 'source', 'origin', 'fromCountryName', 'sourceCountryName',
];
const TO_KEYS = [
  'toCountry', 'destinationCountry', 'countryTo', 'targetCountry',
  'to', 'destination', 'target', 'toCountryName', 'destinationCountryName',
];
const NAME_KEYS = [
  'name', 'nameEn', 'nameAr', 'countryName', 'description', 'title', 'unitName', 'serviceName',
];

const nonEmpty = (v: unknown): string | null => {
  const s = asStr(v)?.trim();
  return s ? s : null;
};

/** يقرأ الاسم من كائن (name / description / ...) أو من نص مباشر */
function nameOf(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== 'object') return nonEmpty(v);
  const m = asObj(v);
  for (const k of NAME_KEYS) {
    const s = nonEmpty(m[k]);
    if (s) return s;
  }
  return null;
}

function pickName(m: Record<string, any>, keys: string[]): string | null {
  for (const k of keys) {
    const s = nameOf(m[k]);
    if (s) return s;
  }
  return null;
}

function currencyOf(v: unknown): string {
  if (v && typeof v === 'object') {
    const m = asObj(v);
    return nonEmpty(m['code']) ?? nonEmpty(m['symbol']) ?? nameOf(m) ?? '';
  }
  return nonEmpty(v) ?? '';
}

function tariffMode(service: string): TariffOption['mode'] {
  const s = service.toLowerCase();
  if (s.includes('air') || s.includes('جو') || s.includes('طيران')) return 'air';
  if (s.includes('sea') || s.includes('بحر') || s.includes('ocean')) return 'sea';
  return 'land';
}

const isInactive = (o: Record<string, any>) => 'isActive' in o && o['isActive'] === false;

/** يحوّل قائمة Taaref القادمة من السيرفر إلى خيارات (الفعّالة فقط). */
export function tariffsFromTaarefs(list: unknown): TariffOption[] {
  if (!Array.isArray(list)) return [];
  const result: TariffOption[] = [];

  for (const raw of list) {
    const t = asObj(raw);
    if (isInactive(t)) continue;
    const taarefId = asNum(t['taarefId']);
    const details: unknown[] = Array.isArray(t['tariffDetails']) ? t['tariffDetails'] : [];

    for (const dRaw of details) {
      const d = asObj(dRaw);
      if (isInactive(d)) continue;

      const shipping = asObj(d['shippingList']);
      const tariffDetailsId = asNum(d['tariffDetailsId']) ?? 0;
      // إذا ما لقينا من/إلى نعرض اسم/وصف قائمة الشحن نفسها
      const from = pickName(shipping, FROM_KEYS) ?? nameOf(shipping) ?? '';
      const to = pickName(shipping, TO_KEYS) ?? '';
      const service = nameOf(d['service']) ?? '';
      const route = from && to ? `${from} → ${to}` : from || to || `تعريفة #${tariffDetailsId}`;

      result.push({
        tariffDetailsId,
        taarefId: asNum(d['taarefId']) ?? taarefId,
        from,
        to,
        service,
        unit: nameOf(d['unit']),
        price: asNum(d['price']) ?? 0,
        currency: currencyOf(d['currency']),
        route,
        label: service ? `${route} (${service})` : route,
        mode: tariffMode(service),
      });
    }
  }
  return result;
}

// =============================================================
// التنسيق
// =============================================================
const withCommas = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** 1234.5 → "1,234.50" ، 1234 → "1,234" */
export function money(v: number): string {
  const [int, dec] = (Number.isFinite(v) ? v : 0).toFixed(2).split('.');
  return dec === '00' ? withCommas(int) : `${withCommas(int)}.${dec}`;
}

/** مبلغ بالدينار بدون كسور */
export function iqd(v: number): string {
  return withCommas(String(Math.round(v)));
}

/** نفس FilteringTextInputFormatter.allow(r'^\d*\.?\d{0,2}') */
export function filterDecimal(value: string): string {
  return /^\d*\.?\d{0,2}/.exec(value)?.[0] ?? '';
}

export function filterDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** يحوّل الرقم للصيغة الدولية التي يطلبها واتساب: 07xx → 9647xx */
export function toWhatsAppNumber(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.substring(2);
  if (digits.startsWith('0')) digits = `964${digits.substring(1)}`;
  return digits;
}

/** رسالة خطأ مقروءة من أي خطأ HTTP أو Error */
export function apiErrorMessage(err: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'تعذّر الاتصال بالخادم، تحقق من الإنترنت';
    const body = err.error;
    if (typeof body === 'string' && body.trim()) return body;
    const msg = body?.message ?? body?.Message ?? body?.title;
    if (typeof msg === 'string' && msg.trim()) return msg;
    return fallback;
  }
  if (err instanceof Error && err.name === 'TimeoutError') return 'انتهت مهلة الطلب، حاول مرة أخرى';
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
