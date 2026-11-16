import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { OrderDraftStore } from './services/order-draft.store';

/** رابط الشاشة الأولى (مسار الـ shell) — مثل /Home/new-order */
function flowBaseUrl(route: ActivatedRouteSnapshot): string {
  const segments = route.pathFromRoot
    .slice(0, -1)
    .flatMap((r) => r.url.map((s) => s.path))
    .filter(Boolean);
  return '/' + segments.join('/');
}

/** بيانات الطلب والمراجعة تحتاج منتجات وسياق مورّد (مثلًا بعد تحديث الصفحة نرجع للسلة). */
export const hasProductsGuard: CanActivateFn = (route) => {
  const store = inject(OrderDraftStore);
  return store.products().length > 0 && store.context()
    ? true
    : inject(Router).parseUrl(flowBaseUrl(route));
};

/** المراجعة تحتاج زبونًا مختارًا. */
export const hasCustomerGuard: CanActivateFn = (route) => {
  const store = inject(OrderDraftStore);
  return store.customer() ? true : inject(Router).parseUrl(`${flowBaseUrl(route)}/create`);
};
