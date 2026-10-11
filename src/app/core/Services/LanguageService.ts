import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { I18N, Lang } from './l18n';

const STORAGE_KEY = 'apx-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private doc = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.readSaved());
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly t = computed(() => I18N[this.lang()]);

  constructor() {
    effect(() => {
      const lang = this.lang();
      const dir = this.dir();

      // 1) اتجاه ولغة الصفحة كاملة
      const html = this.doc.documentElement;
      html.lang = lang;
      html.dir = dir;

      // 2) تبديل نسخة Bootstrap (RTL / LTR)
      const link = this.doc.getElementById('bootstrap-css') as HTMLLinkElement | null;
      if (link) {
        const href = dir === 'rtl' ? 'bootstrap-rtl.css' : 'bootstrap-ltr.css';
        if (!link.href.endsWith(href)) link.href = href;
      }

      // 3) حفظ الاختيار
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* SSR أو تخزين غير متاح */
      }
    });
  }

  toggle(): void {
    this.lang.update(l => (l === 'ar' ? 'en' : 'ar'));
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }

  private readSaved(): Lang {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  }
}