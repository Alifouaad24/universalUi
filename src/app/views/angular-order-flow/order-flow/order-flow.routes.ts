import { Routes } from '@angular/router';

import { hasCustomerGuard, hasProductsGuard } from './order-flow.guards';
import { BasketPricingComponent } from './pages/basket-pricing/basket-pricing.component';
import { CreateOrderComponent } from './pages/create-order/create-order.component';
import { OrderReviewComponent } from './pages/order-review/order-review.component';
import { OrderFlowShellComponent } from './shell/order-flow-shell.component';

/**
 * أضفها داخل children الخاصة بـ Home بـ app.routes.ts:
 *
 *   {
 *     path: 'new-order',
 *     loadChildren: () => import('./views/order-flow/order-flow.routes').then(m => m.ORDER_FLOW_ROUTES),
 *   },
 *
 * المسارات الناتجة:
 *   /Home/new-order          ← تسعير السلة
 *   /Home/new-order/create   ← بيانات الطلب
 *   /Home/new-order/review   ← مراجعة الطلب
 */
export const ORDER_FLOW_ROUTES: Routes = [
  {
    path: '',
    component: OrderFlowShellComponent,
    children: [
      { path: '', component: BasketPricingComponent, title: 'تسعير السلة' },
      {
        path: 'create',
        component: CreateOrderComponent,
        canActivate: [hasProductsGuard],
        title: 'بيانات الطلب',
      },
      {
        path: 'review',
        component: OrderReviewComponent,
        canActivate: [hasProductsGuard, hasCustomerGuard],
        title: 'مراجعة الطلب',
      },
    ],
  },
];
