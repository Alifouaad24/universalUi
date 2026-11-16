import { InjectionToken, Provider } from '@angular/core';

/** كل الإعدادات القابلة للتغيير بمكان واحد. */
export interface OrderFlowConfig {
  /** رابط الـ API بدون / بالنهاية */
  apiBaseUrl: string;
  /** مفتاح التوكن بالـ localStorage */
  tokenStorageKey: string;
  /** مفتاح النشاط الحالي بالـ localStorage (يُرسل كـ myBusiness_id) */
  currentBusinessIdStorageKey: string;

  /** IDs حالات الطلب للزرين: حفظ / إرسال */
  statusSavedId: number;
  statusSentId: number;

  /** رقم الواتساب الذي يُرسل له الطلب عند الضغط على «إرسال» */
  whatsappNumber: string;

  /** سعر الصرف الافتراضي (دينار لكل 1$) */
  defaultExchangeRate: number;

  /**
   * نوع الشحن المرسل مع الطلب.
   * ملاحظة: نسخة Flutter لا تحدد هذه القيمة بأي مكان حاليًا.
   */
  defaultShippingTypeId: number | null;

  /** صفحة إضافة زبون جديد (تُفتح مع ?phone=&businessId=&returnUrl=) */
  addCustomerUrl: string;
  /** الصفحة التي نرجع لها بعد حفظ الطلب بنجاح */
  afterSaveUrl: string;
}

export const DEFAULT_ORDER_FLOW_CONFIG: OrderFlowConfig = {
  apiBaseUrl: 'https://apxapi.somee.com/api',
  tokenStorageKey: 'token',
  currentBusinessIdStorageKey: 'businessId',
  statusSavedId: 32,
  statusSentId: 33,
  whatsappNumber: '+1 (916) 596-8865',
  defaultExchangeRate: 1500,
  defaultShippingTypeId: null,
  addCustomerUrl: '/Home/customers',
  afterSaveUrl: '/Home/suppliers',
};

export const ORDER_FLOW_CONFIG = new InjectionToken<OrderFlowConfig>(
  'ORDER_FLOW_CONFIG',
  { providedIn: 'root', factory: () => DEFAULT_ORDER_FLOW_CONFIG },
);

/** استخدمها بـ app.config.ts لتغيير أي إعداد: provideOrderFlowConfig({ statusSavedId: 40 }) */
export function provideOrderFlowConfig(overrides: Partial<OrderFlowConfig>): Provider {
  return {
    provide: ORDER_FLOW_CONFIG,
    useValue: { ...DEFAULT_ORDER_FLOW_CONFIG, ...overrides },
  };
}
