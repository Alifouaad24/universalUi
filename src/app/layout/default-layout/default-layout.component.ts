import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconComponent, IconDirective } from '@coreui/icons-angular';
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
  SidebarTogglerDirective
} from '@coreui/angular';
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

import { BusinessContextService } from '../../core/Services/business-context.service';
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
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent {
  business: any;
  public navItems: INavData[] = []// = [...navItems];

  constructor(private businessCtx: BusinessContextService, private cdr: ChangeDetectorRef) { }
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
      console.log('business :', business);
      this.currBusiness = business;

      if (!business || !business.business_Services) {
        this.navItems = [...navItems];
        return;
      }

      if (business.business_Services.some((s: any) => s.service.description.includes('APX'))) {
        this.navItems = [...navItems];


      } else {
        this.navItems = business.business_Services.map((s: any) => {
          return {
            name: s.service.description,
            url: s.service.service_Route,
            iconComponent: { name: s.service.service_icon }
          };
        });
      }
      this.cdr.detectChanges();
    });
  }

  get colorScheme(): 'light' | 'dark' | undefined {
    const mode = this.colorMode();
    return (mode === 'light' || mode === 'dark') ? mode : undefined;
  }

}
