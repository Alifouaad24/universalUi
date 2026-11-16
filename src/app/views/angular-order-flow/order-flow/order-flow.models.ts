/** بيانات الطلب التي تأتي من صفحة المورّد (query params لصفحة تسعير السلة). */
export interface OrderContext {
  /** نشاط الزبون (business.businessId) */
  businessId: number;
  /** supplier.platformId */
  platformId: number;
  /** supplier.serviceId */
  serviceId: number;
  /** المزود: supplier.providerBusiness.businessId */
  providerId: number;
}

/** منتج من السلة أو من رابط منتج — نحتفظ بالـ response كامل (raw). */
export interface ProductLine {
  /** مفتاح محلي للـ UI فقط */
  uid: string;
  raw: Record<string, unknown>;
  /** سعر القطعة الحالي (قابل للتعديل) */
  price: number | null;
  /** السعر الأصلي القادم من المنصة — لزر «إرجاع السعر الأصلي» */
  originalPrice: number | null;
  /** نص حقل السعر كما كتبه المستخدم */
  priceText: string;
  /** عدد النسخ (+ / −) */
  count: number;
  sizeId: number | null;
}

export interface Customer {
  globalCustomerId: number | null;
  customerName: string;
  customerMobile: string | null;
  countryName: string | null;
  city: string | null;
  area: string | null;
  landMark: string | null;
}

/** نفس payload الـ Orders/AddUniversalOrder */
export interface AddOrderRequest {
  cartValue: string;
  platform_id: number;
  business_id: number;
  service_id: number;
  globalCustomerId: number | null;
  shippingTypeId: number | null;
  orderStatusId: number | null;
  itemInfos: Record<string, unknown>[];
  providerId: number;
  myBusiness_id: number;
  /** رسوم التوصيل — اسم الحقل هكذا بنسخة Flutter */
  required: number;
}
