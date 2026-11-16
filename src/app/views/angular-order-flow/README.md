# Order Flow — تسعير السلة ← بيانات الطلب ← مراجعة الطلب

نفس منطق تطبيق Flutter (NewOrderController) بمكونات Angular 21 standalone + signals.
تم فحصها بـ `ngc` مع `strictTemplates` على node_modules مشروع `universalUi`.

## 1. نسخ المجلد

انسخ مجلد `order-flow` إلى:

```
universalUi/src/app/views/order-flow/
```

## 2. إضافة المسار

في `src/app/app.routes.ts` داخل `children` الخاصة بـ `Home`:

```ts
{
  path: 'new-order',
  loadChildren: () =>
    import('./views/order-flow/order-flow.routes').then((m) => m.ORDER_FLOW_ROUTES),
},
```

| المسار | الشاشة |
|---|---|
| `/Home/new-order` | تسعير السلة |
| `/Home/new-order/create` | بيانات الطلب (الزبون + سعر الصرف) |
| `/Home/new-order/review` | مراجعة الطلب (حفظ / إرسال) |

## 3. فتح الشاشة من صفحة المورّد

```ts
this.router.navigate(['/Home/new-order'], {
  queryParams: {
    businessId: business.business_id,   // نشاط الزبون
    platformId: supplier.platform_id,
    serviceId: supplier.serviceId,
    providerId: supplier.providerBusiness.business_id, // نفس قيمة providerId التي ترسلها اليوم
  },
});
```

بدون هذه القيم يمكن تسعير السلة فقط، وزر «إنشاء الطلب» يطلب فتح الصفحة من صفحة المورّد.

## 4. الخط (اختياري)

في `src/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 5. الإعدادات (اختياري)

القيم الافتراضية في `order-flow.config.ts`. لتغييرها في `app.config.ts`:

```ts
import { provideOrderFlowConfig } from './views/order-flow/order-flow.config';

providers: [
  provideOrderFlowConfig({
    statusSavedId: 32,
    statusSentId: 33,
    whatsappNumber: '+1 (916) 596-8865',
    defaultExchangeRate: 1500,
    defaultShippingTypeId: null,
    addCustomerUrl: '/Home/customers',
    afterSaveUrl: '/Home/suppliers',
  }),
]
```

- التوكن يُقرأ من `localStorage['token']` ويُرسل كـ `Authorization: Bearer`.
- `myBusiness_id` يُقرأ من `localStorage['businessId']`.
- زر «إضافة» زبون يفتح `addCustomerUrl?phone=&businessId=&returnUrl=` — بعد إضافة الزبون ارجع لـ `returnUrl` وسيُعاد البحث تلقائيًا.

## الـ API المستخدمة (`services/order-api.service.ts`)

| الدالة | الطلب |
|---|---|
| `extractCart(link)` | `GET AutoScraper/SheinCartProducts?link=` |
| `extractProduct(url)` | `GET AutoScraper/SheinSearchByShareLink?shareLink=&timeoutSeconds=20` |
| `searchCustomers(phone)` | `GET Customers/SearchAboutCustomers/{phone}` (07xx ← 9647xx) |
| `getCustomerDetails(name)` | `GET Customers/SearchAboutDetectedCustomer/{name}` |
| `addOrder(request)` | `POST Orders/AddUniversalOrder` |

## هيكل المجلد

```
order-flow/
├─ order-flow.routes.ts        المسارات
├─ order-flow.config.ts        الإعدادات
├─ order-flow.models.ts        الأنواع
├─ order-flow.utils.ts         تحويل المنتجات/الزبون، المقاس واللون، التنسيق
├─ order-flow.guards.ts        حماية الخطوات (بعد تحديث الصفحة يرجع للسلة)
├─ services/
│  ├─ order-api.service.ts     الاتصال بالـ API
│  ├─ order-draft.store.ts     حالة الطلب المشتركة بين الشاشات (signals)
│  └─ order-toast.service.ts   التنبيهات
├─ shell/                      الحاوية: مؤشر الخطوات + التنبيهات + التصميم العام
├─ shared/                     كارت المنتج، شريط الإجمالي، الأيقونات
└─ pages/
   ├─ basket-pricing/          تسعير السلة
   ├─ create-order/            بيانات الطلب
   └─ order-review/            مراجعة الطلب
```

التصميم كله محصور داخل `.of-root` ولا يؤثر على CoreUI، ويدعم الوضع الداكن (`data-coreui-theme="dark"`).
