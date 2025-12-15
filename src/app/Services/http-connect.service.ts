import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpConnectService {

  private apiUrl = 'http://apxapi.somee.com/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getAllData<T>(finalUrl: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${finalUrl}`, { headers: this.getHeaders() });
  }

  getByIdData(finalUrl: string, id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  posteData(finalUrl: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${finalUrl}`, data, { headers: this.getHeaders() });
  }

  putData(finalUrl: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${finalUrl}`, data, { headers: this.getHeaders() });
  }

  deleteData(finalUrl: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${finalUrl}`, { headers: this.getHeaders() });
  }

}
