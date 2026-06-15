import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BusinessContextService {

  private businessesSubject =
    new BehaviorSubject<any[]>([]);

  businesses$ =
    this.businessesSubject.asObservable();

  private currentBusiness$ =
    new BehaviorSubject<any>(null);

  constructor() {

    const savedBusinesses =
      localStorage.getItem('businesses');

    const savedCurrent =
      localStorage.getItem('currentBusiness');

    if (savedBusinesses) {

      const businesses =
        JSON.parse(savedBusinesses);

      this.businessesSubject.next(businesses);
    }

    if (savedCurrent) {

      this.currentBusiness$.next(
        JSON.parse(savedCurrent)
      );
    }
  }

  clearContext() {

    this.businessesSubject.next([]);

    this.currentBusiness$.next(null);

    localStorage.removeItem('businesses');
    localStorage.removeItem('currentBusiness');
    localStorage.removeItem('businessId');
  }

  setBusinesses(list: any[]) {

    this.businessesSubject.next(list);

    localStorage.setItem(
      'businesses',
      JSON.stringify(list)
    );
  }

  setCurrentBusiness(business: any) {

    if (!business) return;

    this.currentBusiness$.next(business);

    localStorage.setItem(
      'currentBusiness',
      JSON.stringify(business)
    );

    localStorage.setItem(
      'businessId',
      business.business_id
    );
  }

  getCurrentBusiness() {
    return this.currentBusiness$.asObservable();
  }

  getBusinesses() {
    return this.businessesSubject.value;
  }

  /**
   * Returns the landing page route for a given business based on its name.
   * Centralized here so every place that selects a business stays consistent.
   */
  getLandingPage(business: any): string {
    const businessName = business?.business_name?.toLowerCase();

    switch (businessName) {
      case 'duty':
        return '/Home/duty';

      case 'apx':
        return '/Home/dashboard';

      case 'ainalfhd':
        return '/Home/fashion-dashboard';

      default:
        return '/Home/dashboard';
    }
  }
}