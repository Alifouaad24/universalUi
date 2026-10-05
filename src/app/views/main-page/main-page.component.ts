import {
  AfterViewInit, Component, HostListener, Input, OnDestroy, PLATFORM_ID,
  inject, signal
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/* =========================================================
   أيقونات SVG مدمجة (بدون أي مكتبة أيقونات خارجية)
   ========================================================= */
const ICONS: Record<string, string> = {
  desktop: 'M3 4h18v12H3z M8 20h8 M12 16v4',
  mobile: 'M7 2h10v20H7z M11 18h2',
  cloud: 'M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 4.25 4.25 0 0 0 7 18z',
  chart: 'M3 3v18h18 M7 15l4-4 3 3 5-6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  headset: 'M4 14v-2a8 8 0 0 1 16 0v2 M4 14h3v6H5a1 1 0 0 1-1-1z M20 14h-3v6h2a1 1 0 0 0 1-1z',
  pin: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21v-1a6 6 0 0 1 12 0v1 M16 3.5a4 4 0 0 1 0 7.5 M22 21v-1a6 6 0 0 0-4-5.6',
  dollar: 'M12 2v20 M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  refresh: 'M20 11a8 8 0 0 0-14.9-3 M4 4v4h4 M4 13a8 8 0 0 0 14.9 3 M20 20v-4h-4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  send: 'M22 2 11 13 M22 2l-7 20-4-9-9-4z',
  check: 'M5 12l5 5 9-10',
  arrowLeft: 'M19 12H5 M11 6l-6 6 6 6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18 M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1 M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6 M9.9 9.9a3 3 0 0 0 4.2 4.2',
  linkedin: 'M4 9h4v11H4z M6 4.5v.01 M12 20v-6a3 3 0 0 1 6 0v6 M12 9v11',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17.5 6.5v.01',
  chat: 'M21 12a9 9 0 0 1-13.4 7.9L3 21l1.2-4.4A9 9 0 1 1 21 12z',
  x: 'M4 4l16 16 M20 4 4 20',
  google: 'M20 12h-8 M20 12a8 8 0 1 1-2.3-5.7'
};

@Component({
  selector: 'apx-icon',
  standalone: true,
  template: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path [attr.d]="d" /></svg>`,
  styles: [`
    :host { display: inline-flex; width: 1.15em; height: 1.15em; flex-shrink: 0; }
    svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.8;
          stroke-linecap: round; stroke-linejoin: round; }
  `]
})
export class ApxIconComponent {
  @Input({ required: true }) name!: string;
  get d() { return ICONS[this.name] ?? ''; }
}

/* =========================================================
   صفحة Apx الرئيسية
   ========================================================= */
type SectionId = 'home' | 'services' | 'about' | 'contact';

@Component({
  selector: 'app-apx-landing',
  standalone: true,
  imports: [ReactiveFormsModule, ApxIconComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class ApxLandingComponent implements AfterViewInit, OnDestroy {

  /**
   *
   */
  constructor(private router: Router) {}

  private fb = inject(FormBuilder);
  private doc = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private lastFocused: HTMLElement | null = null;

  year = new Date().getFullYear();

  // حالة الواجهة
  menuOpen = false;
  scrolled = false;
  active = signal<SectionId>('home');
  loginOpen = false;
  authTab: 'login' | 'register' = 'login';
  showPassword = false;
  authMsg = '';
  contactSent = false;

  links: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'اتصل بنا' }
  ];

  featured = {
    icon: 'desktop',
    title: 'تطوير المواقع والمنصات',
    text: 'مواقع ومنصات ويب سريعة ومتجاوبة، مع لوحة تحكم تتيح لفريقك إدارة المحتوى بسهولة.',
    points: ['تصميم واجهات حديثة', 'متاجر إلكترونية', 'لوحات تحكم مخصصة', 'تحسين الظهور في محركات البحث']
  };

  services = [
    { icon: 'mobile', title: 'تطبيقات الجوال', text: 'تطبيقات iOS وAndroid بتجربة سلسة، ونتولى نشرها على المتاجر.' },
    { icon: 'cloud', title: 'الحلول السحابية', text: 'نقل أنظمتك إلى السحابة مع نسخ احتياطي تلقائي وتوسّع حسب الحاجة.' },
    { icon: 'chart', title: 'تحليل البيانات', text: 'لوحات معلومات وتقارير تساعدك على اتخاذ قرارات مبنية على الأرقام.' },
    { icon: 'shield', title: 'الأمن السيبراني', text: 'فحص الثغرات وتأمين البيانات وحماية أنظمتك من الاختراقات.' },
    { icon: 'headset', title: 'الدعم والصيانة', text: 'تحديثات دورية واستجابة سريعة لأي مشكلة على مدار الساعة.' }
  ];

  values = [
    { icon: 'checkCircle', title: 'التزام بالمواعيد', text: 'جدول زمني واضح من اليوم الأول.' },
    { icon: 'users', title: 'فريق متكامل', text: 'مطورون ومصممون ومختصو أمن معاً.' },
    { icon: 'dollar', title: 'أسعار شفافة', text: 'عرض سعر مفصّل بلا تكاليف مخفية.' },
    { icon: 'refresh', title: 'شراكة مستمرة', text: 'نبقى معك بعد الإطلاق.' }
  ];

  steps = [
    { title: 'نفهم احتياجك', text: 'جلسة لتحديد الأهداف والجمهور والميزانية.' },
    { title: 'نصمم ونخطط', text: 'نماذج أولية توافق عليها قبل بدء التطوير.' },
    { title: 'نطوّر ونختبر', text: 'تسليم على مراحل مع تقرير تقدم أسبوعي.' },
    { title: 'نطلق وندعم', text: 'إطلاق المشروع ومتابعته وتطويره بعد التسليم.' }
  ];

  serviceOptions = ['تطوير المواقع', 'تطبيقات الجوال', 'الحلول السحابية', 'تحليل البيانات', 'الأمن السيبراني', 'الدعم والصيانة'];

  // النماذج (Reactive Forms من Angular نفسه)
  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    service: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    terms: [false, Validators.requiredTrue]
  });

  /* ---------- أحداث الصفحة ---------- */
  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 12;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.loginOpen) this.closeLogin();
    else if (this.menuOpen) this.menuOpen = false;
  }

  ngAfterViewInit() {
    if (!this.isBrowser || !('IntersectionObserver' in window)) return;
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && this.active.set(e.target.id as SectionId));
    }, { rootMargin: '-45% 0px -50% 0px' });
    this.links.forEach(l => {
      const el = this.doc.getElementById(l.id);
      if (el) this.observer!.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.isBrowser) this.doc.body.style.overflow = '';
  }

  /* ---------- التنقل ---------- */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  go(id: SectionId, event?: Event) {
    event?.preventDefault();
    this.menuOpen = false;
    if (this.isBrowser) this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- نافذة تسجيل الدخول ---------- */
  openLogin(tab: 'login' | 'register' = 'login') {
    this.menuOpen = false;
    this.authTab = tab;
    this.authMsg = '';
    this.showPassword = false;
    this.loginOpen = true;
    if (!this.isBrowser) return;
    this.lastFocused = this.doc.activeElement as HTMLElement;
    this.doc.body.style.overflow = 'hidden';
    setTimeout(() => (this.doc.getElementById(tab === 'login' ? 'lEmail' : 'rName') as HTMLInputElement)?.focus());
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

  closeLogin() {
    this.loginOpen = false;
    this.authMsg = '';
    if (!this.isBrowser) return;
    this.doc.body.style.overflow = '';
    this.lastFocused?.focus();
  }

  switchTab(tab: 'login' | 'register') {
    this.authTab = tab;
    this.authMsg = '';
  }

  /* ---------- التحقق والإرسال ---------- */
  bad(form: FormGroup<any>, name: string): boolean {
    const c = form.get(name);
    return !!c && c.touched && c.invalid;
  }

  sendContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    // TODO: أرسل البيانات إلى الخادم، مثال: this.http.post('/api/contact', this.contactForm.getRawValue())
    this.contactSent = true;
    this.contactForm.reset();
  }

  submitAuth() {
    const form = this.authTab === 'login' ? this.loginForm : this.registerForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    // TODO: اربط هنا مع خدمة المصادقة لديك (AuthService)
    this.authMsg = this.authTab === 'login' ? 'تم تسجيل الدخول بنجاح.' : 'تم إنشاء حسابك بنجاح.';
    form.reset();
  }
}