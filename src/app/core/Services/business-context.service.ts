import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BusinessContextService {

  private businesses: any[] = [];
  private currentBusiness$ = new BehaviorSubject<any>(null);

  constructor() {
    const savedBusinesses = localStorage.getItem('businesses');
    const savedCurrent = localStorage.getItem('currentBusiness');

    if (savedBusinesses) {
      this.businesses = JSON.parse(savedBusinesses);
    }

    if (savedCurrent) {
      this.currentBusiness$.next(JSON.parse(savedCurrent));
    } else if (this.businesses.length > 0) {
      this.currentBusiness$.next(this.businesses[0]);
      localStorage.setItem('currentBusiness', JSON.stringify(this.businesses[0]));
    }
  }

  setBusinesses(list: any[]) {
    this.businesses = list;
    localStorage.setItem('businesses', JSON.stringify(list));
  }

  setCurrentBusiness(business: any) {
    if (!business) return;
    this.currentBusiness$.next(business);
    localStorage.setItem('currentBusiness', JSON.stringify(business));
    localStorage.setItem('businessId', business.business_id);
  }

  getCurrentBusiness() {
    return this.currentBusiness$.asObservable();
  }

  getBusinesses() {
    return this.businesses;
  }
}
