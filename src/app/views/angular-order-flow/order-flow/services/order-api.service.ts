import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';

import { ORDER_FLOW_CONFIG } from '../order-flow.config';
import { AddOrderRequest, Customer, ProductLine, TariffOption } from '../order-flow.models';
import { customerFromJson, productFromCartItem, productFromRaw, tariffsFromTaarefs } from '../order-flow.utils';

/** كل اتصالات الـ API الخاصة بإنشاء الطلب. */
@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly cfg = inject(ORDER_FLOW_CONFIG);

  private url(path: string): string {
    return `${this.cfg.apiBaseUrl.replace(/\/+$/, '')}/${path}`;
  }

  private get headers(): HttpHeaders {
    const token = localStorage.getItem(this.cfg.tokenStorageKey);
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // ---------------------------------------------------------------
  // GET AutoScraper/SheinCartProducts?link=...
  // جلب كل منتجات سلة Shein (قد يستغرق حتى دقيقة)
  // ---------------------------------------------------------------
  extractCart(link: string): Observable<ProductLine[]> {
    return this.http
      .get<any>(this.url('AutoScraper/SheinCartProducts'), {
        headers: this.headers,
        params: { link },
      })
      .pipe(
        timeout(120_000),
        map((res) => {
          const items: unknown[] = Array.isArray(res?.items) ? res.items : [];
          return items
            .filter((e): e is Record<string, any> => !!e && typeof e === 'object')
            .map(productFromCartItem);
        }),
      );
  }

  // ---------------------------------------------------------------
  // GET AutoScraper/SheinSearchByShareLink?shareLink=...&timeoutSeconds=20
  // منتج واحد من رابطه (غير مستخدم بالشاشات حاليًا، متاح عند الحاجة)
  // ---------------------------------------------------------------
  extractProduct(shareLink: string): Observable<ProductLine> {
    return this.http
      .get<any>(this.url('AutoScraper/SheinSearchByShareLink'), {
        headers: this.headers,
        params: { shareLink, timeoutSeconds: 20 },
      })
      .pipe(
        timeout(45_000),
        map((res) => {
          if (!res || typeof res !== 'object' || !Object.keys(res).length) {
            throw new Error('تعذّر جلب بيانات المنتج من الرابط');
          }
          return productFromRaw(res);
        }),
      );
  }

  // ---------------------------------------------------------------
  // GET Customers/SearchAboutCustomers/{phone}
  // يرجع أسماء الزبائن المطابقين — الرقم 07xx يُرسل كـ 9647xx
  // ---------------------------------------------------------------
  searchCustomers(query: string): Observable<string[]> {
    const q = query.startsWith('0') ? `964${query.substring(1)}` : query;
    return this.http
      .get<any>(this.url(`Customers/SearchAboutCustomers/${encodeURIComponent(q)}`), {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          const list: any[] = Array.isArray(res?.customers) ? res.customers : [];
          return list
            .map((c) => c?.customerName)
            .filter((n): n is string => typeof n === 'string' && n.length > 0);
        }),
      );
  }

  // ---------------------------------------------------------------
  // GET Customers/SearchAboutDetectedCustomer/{name}
  // ---------------------------------------------------------------
  getCustomerDetails(name: string): Observable<Customer> {
    return this.http
      .get<any>(this.url(`Customers/SearchAboutDetectedCustomer/${encodeURIComponent(name)}`), {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          const c = res?.customer;
          if (!c || typeof c !== 'object' || !Object.keys(c).length) {
            throw new Error('لم يتم العثور على بيانات الزبون');
          }
          return customerFromJson(c);
        }),
      );
  }

  // ---------------------------------------------------------------
  // GET ShippingTaaref/GetAllTaarefs/{businessId}
  // تعريفات الشحن — كل TariffDetails فعّال يصبح خيارًا مستقلًا
  // ---------------------------------------------------------------
  getTariffs(businessId: number): Observable<TariffOption[]> {
    return this.http
      .get<unknown>(this.url(`ShippingTaaref/GetAllTaarefs/${businessId}`), {
        headers: this.headers,
      })
      .pipe(map(tariffsFromTaarefs));
  }

  // ---------------------------------------------------------------
  // POST Orders/AddUniversalOrder
  // ---------------------------------------------------------------
  addOrder(request: AddOrderRequest): Observable<unknown> {
    return this.http.post(this.url('Orders/AddUniversalOrder'), request, {
      headers: this.headers,
    });
  }
}
