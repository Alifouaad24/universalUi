import { ChangeDetectorRef, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconComponent, IconDirective } from '@coreui/icons-angular';
import { AppConstants } from '../../shared/constant';
import {
  ColorModeService,
  ContainerComponent,
  INavData,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  SpinnerComponent,
  SpinnerModule
} from '@coreui/angular';
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

import { BusinessContextService } from '../../core/Services/business-context.service';
import { HttpConnectService } from '../../Services/http-connect.service';
import { ServiceModel } from '../../Models/ServiceModel';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingService } from '../../core/Services/LoadingService';
import { StorageService } from '../../core/Services/StorageService';
function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent, CommonModule,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent, SpinnerComponent, SpinnerModule,
    IconDirective,
    NgScrollbar,
    RouterOutlet, AsyncPipe,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent {
  business: any;
  taskCount = 0;

  public navItems: INavData[] = []
  router = inject(Router);
  services: ServiceModel[] = [];
  defaultBusinessLogo = AppConstants.DEFAULT_BUSINESS_LOGO;

  constructor(private businessCtx: BusinessContextService, private cdr: ChangeDetectorRef, private ebayService: StorageService,
    private http: HttpConnectService, public loader: LoadingService, private elementRef: ElementRef,      // ← جديد
    private renderer: Renderer2) { }
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  user?: any = JSON.parse(localStorage.getItem('currentUser') || '{}');
  userName = this.user?.userName || 'Guest';
  currBusiness?: any
  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  private closeInitiallyOpenGroups() {
  // ننتظر دورتين من الرندر: الأولى لبناء navItems، والثانية
  // حتى تنتهي مكتبة CoreUI من إضافة كلاس 'show' على المجموعات المفتوحة
  setTimeout(() => {
    const sidebarEl = this.elementRef.nativeElement.querySelector('#sidebar1');
    if (!sidebarEl) return;

    // كل مجموعة (Service أب) مفتوحة حالياً تحمل كلاس 'show'
    const openGroups = sidebarEl.querySelectorAll('.nav-group.show');

    openGroups.forEach((group: HTMLElement) => {
      // العنصر القابل للنقر داخل كل مجموعة (الرابط اللي يفتح/يقفل)
      const toggleLink = group.querySelector('.nav-link') as HTMLElement | null;
      if (toggleLink) {
        toggleLink.click();
      }
    });
  }, 200); // تأخير كافٍ حتى يخلص Angular من رسم كل شيء
}


  ngOnInit() {
    this.GetBusinesses()
    this.getStartSettings()
    this.businessCtx.getCurrentBusiness().subscribe(business => {
      this.currBusiness = business;
      console.log('Current Business in layout:', this.currBusiness);

      if (!business || !business.business_Services) {
        this.navItems = [...navItems];
        return;
      }
      this.ebayService.getWithExpiry('ebayToken')
      //this.getAllServices()
      this.cdr.detectChanges();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('tokenId');

    if (token) {
      localStorage.setItem('tokenId', token);
      this.router.navigate(['/Home/inventory']);
    }

  }
  getAllServices() {
    const businessId = localStorage.getItem('businessId');
    this.http.getAllData(`Service/${businessId}`).subscribe(
      (res: any) => {
        this.services = (res as any[]).map(item => new ServiceModel({
          service_id: item.service_id,
          description: item.description,
          parentId: item.parentId,
          insert_on: item.insert_on,
          service_icon: item.service_icon,
          isPublic: item.isPublic,
          business_Services: item.business_Services,
          service_Activities: item.activity_Services,
          service_Route: item.service_Route
        }));

        setTimeout(() => {
          const businessServiceIds = this.currBusiness.business_Services
            .map((bs: any) => bs.service_id);

          this.services = this.services.filter(s =>
            businessServiceIds.includes(s.service_id)
          );

          // ← بناء الشجرة الهرمية بدل القائمة المسطحة
          this.navItems = this.buildNavTree(this.services);

          this.cdr.detectChanges();
          this.closeInitiallyOpenGroups(); 
        }, 100);
        this.cdr.detectChanges();
      },
      (err) => { }
    );
  }

  // ---------------------------------------------------------------------
  // بناء شجرة Parent/Children من القائمة المسطحة اعتماداً على parentId
  // ---------------------------------------------------------------------
  private buildNavTree(services: ServiceModel[]): INavData[] {
    // مرحلة 1: أنشئ كل عنصر بشكله الأساسي بدون children بعد
    const navMap = new Map<number, INavData & { children?: INavData[] }>();

    services.forEach(s => {
      navMap.set(s.service_id!, {
        name: s.description! ?? '',
        url: s.service_Route,
        iconComponent: { name: s.service_icon },
        attributes: {
          'data-service-id': s.service_id
        },
        ...(s.description === 'eTask' && {
          badge: {
            color: 'danger',
            text: this.taskCount.toString()
          }
        })
      });
    });

    const roots: INavData[] = [];

    // مرحلة 2: اربط كل عنصر بأبيه (لو موجود)، وإلا اعتبره Root
    services.forEach(s => {
      const navItem = navMap.get(s.service_id!)!;

      if (s.parentId) {
        const parentNav = navMap.get(s.parentId);

        if (parentNav) {
          if (!parentNav.children) {
            parentNav.children = [];
            // عنصر عنده أبناء → أزل الـ url منه، بحيث الضغط عليه
            // يوسّع/يطوي فقط بدل ما ينتقل لشاشة
            delete (parentNav as any).url;
          }
          parentNav.children.push(navItem);
        } else {
          // الأب غير موجود بقائمة الخدمات الحالية (مثلاً غير مفعّل بهالبزنس)
          // نعتبره Root حتى ما يضيع
          roots.push(navItem);
        }
      } else {
        roots.push(navItem);
      }
    });

    return roots;
  }



  getStartSettings() {
    const businessId = localStorage.getItem('businessId')
    this.http.getAllData(`StartInformation/${businessId}`).subscribe(
      (res: any) => {
        this.taskCount = res.countOfNerTasks
        this.cdr.detectChanges()
        this.getAllServices()
        this.cdr.detectChanges()
      },
      (err) => {

      }
    );
  }

  get colorScheme(): 'light' | 'dark' | undefined {
    const mode = this.colorMode();
    return (mode === 'light' || mode === 'dark') ? mode : undefined;
  }

  GetBusinesses() {
    this.http.getAllData('Account/GetMyData').subscribe((res: any) => {
      if (res.businesses && res.businesses.length > 0) {
        if (res.businesses?.length) {
          const safeBusinesses =
            JSON.parse(JSON.stringify(res.businesses));
          this.businessCtx.setBusinesses(
            safeBusinesses
          );
        }
        this.cdr.detectChanges()
        setTimeout(() => {
          this.router.navigate(['Home/dashboard']);
        }, 1000);

      } else {
        localStorage.removeItem('businesses');
      }
    })
  }

  onSidebarNavClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const link = target.closest('[data-service-id]') as HTMLElement | null;

    if (link) {
      const serviceId = link.getAttribute('data-service-id');
      if (serviceId) {
        localStorage.setItem('selectedServiceId', serviceId);
      }
    }
  }

}
