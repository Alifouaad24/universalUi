import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18N, Lang } from './l18n';

/** دول الجامعة العربية */
const ARAB_COUNTRIES = new Set([
  'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'YE', 'IQ', 'SY', 'JO', 'LB',
  'PS', 'EG', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SD', 'SO', 'DJ', 'KM',
]);

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** هل غيّر المستخدم اللغة يدوياً خلال هذه الجلسة؟ (في الذاكرة فقط) */
  private userChose = false;

  readonly lang = signal<Lang>(this.browserLang());
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly t = computed(() => I18N[this.lang()]);

  constructor() {
    if (this.isBrowser) this.detectByCountry();
  }

  toggle(): void {
    this.set(this.lang() === 'ar' ? 'en' : 'ar');
  }

  set(lang: Lang): void {
    this.userChose = true;   // حتى لا يغيّرها كشف الدولة بعد ذلك
    this.lang.set(lang);
  }

  /** لغة المتصفح كبداية فورية */
  private browserLang(): Lang {
    if (!this.isBrowser) return 'ar';
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    return langs.some(l => l?.toLowerCase().startsWith('ar')) ? 'ar' : 'en';
  }

  /** كشف دولة الزائر من IP */
  private async detectByCountry(): Promise<void> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);

    try {
      const res = await fetch('https://ipapi.co/country/', { signal: ctrl.signal });
      const code = (await res.text()).trim().toUpperCase();
      if (!res.ok || !/^[A-Z]{2}$/.test(code)) return;

      if (!this.userChose) {
        this.lang.set(ARAB_COUNTRIES.has(code) ? 'ar' : 'en');
      }
    } catch {
    } finally {
      clearTimeout(timer);
    }
  }
}