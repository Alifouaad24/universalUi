import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  public navItems: INavData[] = []
  services: ServiceModel[] = [];
  defaultBusinessLogo = AppConstants.DEFAULT_BUSINESS_LOGO;
  constructor(private businessCtx: BusinessContextService, private cdr: ChangeDetectorRef,
     private http: HttpConnectService, public loader: LoadingService) { }
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

  ngOnInit() {

    this.businessCtx.getCurrentBusiness().subscribe(business => {
      this.currBusiness = business;
      console.log('Current Business in layout:', this.currBusiness);

      if (!business || !business.business_Services) {
        this.navItems = [...navItems];
        return;
      }
      this.getAllServices()
      this.cdr.detectChanges();
    });

  }

  getAllServices() {
    this.http.getAllData('Service').subscribe(
      (res: any) => {
        console.log(res);
        this.services = (res as any[]).map(item => new ServiceModel({
          service_id: item.service_id,
          description: item.description,
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

          this.navItems = this.services
            .map((bs: any) => ({
              name: bs.description,
              url: bs.service_Route,
              iconComponent: { name: bs.service_icon }
            }));

          this.cdr.detectChanges();
        }, 100);
        this.cdr.detectChanges();
      },
      (err) => {
      }
    );
  }

  get colorScheme(): 'light' | 'dark' | undefined {
    const mode = this.colorMode();
    return (mode === 'light' || mode === 'dark') ? mode : undefined;
  }

}
