import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomerModel, parseCustomer } from './customer.model';
import { UnitModel, parseUnit } from './unit.model';
import { GlobalOrderModel, parseGlobalOrder } from './order.model';


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
  constructor(private http: HttpClient) { }

  searchCustomer(code: string): Observable<CustomerModel> {
    return this.http
      .get<any>(`${API_BASE_URL}/Customers/SearchAboutCustomersByCode/${code}`)
      .pipe(map((json) => parseCustomer(json)));
  }

  getFirstCharacter(): Observable<string> {
    return this.http
      .get<any>(`${API_BASE_URL}/Customers/ReturnFirstCharacter`)
      .pipe(map((res) => (typeof res === 'string' ? res : (res?.firstCharacter ?? res?.data ?? ''))));
  }

  getUnits(): Observable<UnitModel[]> {
    return this.http
      .get<any[]>(`${API_BASE_URL}/Unit`)
      .pipe(map((list) => (list ?? []).map(parseUnit)));
  }

  getOrders(): Observable<GlobalOrderModel[]> {
    return this.http
      .get<any[]>(`${API_BASE_URL}/Orders/${BUSINESS_ID}`)
      .pipe(map((list) => (list ?? []).map(parseGlobalOrder)));
  }

  uploadImage(file: File): Observable<string> {
    const form = new FormData();
    form.append('Image', file, file.name);
    return this.http
      .post(`${API_BASE_URL}/ImageUploader/UploadImageToCloudinary`, form, {
        responseType: 'text',
      })
      .pipe(map((res) => res ?? ''));
  }

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
