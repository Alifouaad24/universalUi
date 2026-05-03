import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setItem(key: string, value: any, ttl: number): void {
    const now = new Date().getTime();

    const item = {
      value: value,
      expiry: now + ttl
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      this.remove(key);
      return null;
    }

    return item.value;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

}
