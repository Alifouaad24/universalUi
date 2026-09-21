import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomerModel, parseCustomer } from './customer.model';
import { UnitModel, parseUnit } from './unit.model';
import { GlobalOrderModel, parseGlobalOrder } from './order.model';

/**
 * نفس القيم الموجودة في lib/core/constants.dart بالضبط —
 * غيّر هنا فقط لو تغيّر الـ API، لا داعي لتعديل أي مكان آخر.
 */
const API_BASE_URL = 'https://apxapi.somee.com/api';
const BUSINESS_ID = 61;
const NEW_ORDER_STATUS_ID = 11;

export interface PackageSubmission {
  unitId: number;
  value: number;
  imageUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class ShippingService {
  constructor(private http: HttpClient) {}

  /** GET /Customers/SearchAboutCustomersByCode/{code} */
  searchCustomer(code: string): Observable<CustomerModel> {
    return this.http
      .get<any>(`${API_BASE_URL}/Customers/SearchAboutCustomersByCode/${code}`)
      .pipe(map((json) => parseCustomer(json)));
  }

  /** GET /Customers/ReturnFirstCharacter */
  getFirstCharacter(): Observable<string> {
    return this.http
      .get<any>(`${API_BASE_URL}/Customers/ReturnFirstCharacter`)
      .pipe(map((res) => (typeof res === 'string' ? res : (res?.firstCharacter ?? res?.data ?? ''))));
  }

  /** GET /Unit */
  getUnits(): Observable<UnitModel[]> {
    return this.http
      .get<any[]>(`${API_BASE_URL}/Unit`)
      .pipe(map((list) => (list ?? []).map(parseUnit)));
  }

  /** GET /Orders/{business_id} */
  getOrders(): Observable<GlobalOrderModel[]> {
    return this.http
      .get<any[]>(`${API_BASE_URL}/Orders/${BUSINESS_ID}`)
      .pipe(map((list) => (list ?? []).map(parseGlobalOrder)));
  }

  /** POST /ImageUploader/UploadImageToCloudinary (multipart) -> يرجع رابط الصورة */
  uploadImage(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http
      .post<any>(`${API_BASE_URL}/ImageUploader/UploadImageToCloudinary`, form)
      .pipe(map((res) => (typeof res === 'string' ? res : (res?.url ?? res?.imageUrl ?? res?.data ?? ''))));
  }

  /** POST /Orders/AddGlobalOrder */
  addOrder(globalCustomerId: number, packages: PackageSubmission[]): Observable<any> {
    const payload = {
      globalCustomerId,
      business_id: BUSINESS_ID,
      orderStatusId: NEW_ORDER_STATUS_ID,
      packages,
    };
    return this.http.post<any>(`${API_BASE_URL}/Orders/AddGlobalOrder`, payload);
  }
}
