import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { ServiceModel } from '../../../Models/ServiceModel';

interface PlatformBusSelection {
  businessId: number;
  isForScrape: boolean;
  isForSell: boolean;
}

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-platform.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditplatformComponent implements OnInit {
  name: string = '';

  message: string = '';
  loading: boolean = false;
  Businesses: any[] = [];

  id?: number;

  isUpdate: boolean = false;

  selectedBusinesses: PlatformBusSelection[] = [];

  constructor(
    private http: HttpConnectService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllBusiness();

    this.route.queryParamMap.subscribe(params => {
      const platform = JSON.parse(params.get('platform') || 'null');
      console.log(platform);
      if (platform) {
        this.id = platform.platform_id;
        this.name = platform.description;
        this.isUpdate = true;

        if (platform.businessPlatforms) {
          this.selectedBusinesses = platform.businessPlatforms.map((bp: any) => ({
            businessId: bp.business_id,
            isForScrape: bp.forScraping ?? true,
            isForSell: bp.forSelling ?? true,
          }));
        }
      }
    });
  }

  getAllBusiness() {
    this.http.getAllData('Business').subscribe((res: any) => {
      this.Businesses = res;
      this.cdr.detectChanges();
    });
  }

  // ---------------------------------------------------------------------
  // منطق إدارة اختيار البزنسات (checkbox أساسي + Scrape/Sell toggles)
  // ---------------------------------------------------------------------

  isBusinessSelected(businessId: number): boolean {
    return this.selectedBusinesses.some(s => s.businessId === businessId);
  }

  getSelection(businessId: number): PlatformBusSelection | undefined {
    return this.selectedBusinesses.find(s => s.businessId === businessId);
  }

  toggleBusinessSelection(businessId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedBusinesses.push({
        businessId,
        isForScrape: true,
        isForSell: true,
      });
    } else {
      this.selectedBusinesses = this.selectedBusinesses.filter(s => s.businessId !== businessId);
    }
  }

  updateScrapeFlag(businessId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const selection = this.getSelection(businessId);
    if (selection) {
      selection.isForScrape = checked;
    }
  }

  updateSellFlag(businessId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const selection = this.getSelection(businessId);
    if (selection) {
      selection.isForSell = checked;
    }
  }

  // ---------------------------------------------------------------------
  // إضافة / تعديل الـ Platform
  // ---------------------------------------------------------------------

  addPlatform() {
    this.loading = true;
    if (!this.name) {
      this.message = 'Please enter system name';
      this.loading = false;
      return;
    }

    // ⚠️ الاسم تغيّر من "name" إلى "Description" ليطابق PlatformDto بالباك إند
    const payLoad = {
      Description: this.name,
      PlatformBus: this.selectedBusinesses.map(s => ({
        businessId: s.businessId,
        isForScrape: s.isForScrape,
        isForSell: s.isForSell,
      })),
    };

    this.isUpdate
      ? this.http.putData(`Platform/${this.id}`, payLoad).subscribe(res => {
        this.router.navigate(['Home/platforms']);
        this.loading = false;
      }, (error) => {
        console.error(error);
        this.loading = false;
      })
      : this.http.posteData('Platform', payLoad).subscribe(res => {
        this.router.navigate(['Home/platforms']);
        this.loading = false;
      }, (error) => {
        console.error(error);
        this.loading = false;
      });
  }
}