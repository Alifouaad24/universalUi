
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectService } from '../../Services/http-connect.service';

@Injectable({
  providedIn: 'root'
})
export class ZmcService {

  private http = inject(HttpConnectService);


  login(username: string, password: string): Observable<any> {
    return this.http.posteData(`BindWithZMC/Login`, {
      username,
      password
    });
  }

  testSession(sessionKey: string): Observable<any> {
    return this.http.getAllData(
      `BindWithZMC/TestSession/${sessionKey}`
    );
  }

  loadCustomers(
    sessionKey: string,
    search = '',
    start = 0,
    length = 50
  ): Observable<any> {

    const params = new HttpParams()
      .set('draw', '1')
      .set('start', start)
      .set('length', length)
      .set('search', search)
      .set('orderColumn', '7')
      .set('orderDir', 'desc');

    return this.http.getAllData(
      `BindWithZMC/LoadCustomers/${sessionKey}`,
      { params }
    );
  }

  getCities(
    sessionKey: string,
    countryId = '1'
  ): Observable<any> {

    const params = new HttpParams()
      .set('countryId', countryId);

    return this.http.getAllData(
      `BindWithZMC/GetCities/${sessionKey}`,
      { params }
    );
  }

  createCustomer(
    sessionKey: string,
    customer: any
  ): Observable<any> {

    return this.http.posteData(
      `BindWithZMC/CreateCustomer/${sessionKey}`,
      customer
    );
  }


uploadCustomerDocument(
  sessionKey: string,
  customerId: string,
  file: File
) {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.posteData(
    `BindWithZMC/UploadCustomerDocument/${sessionKey}/${customerId}`,
    formData
  );
}

}
