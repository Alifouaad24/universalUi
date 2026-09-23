import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessModel } from '../../../Models/Business/BusinessModel';
import { ServiceModel } from '../../../Models/ServiceModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Supplier.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CommonModule,
    FormsModule,
    RouterOutlet,
    ButtonDirective,
    IconDirective,
    RouterLink,
  ]
})
export class AddEditSuppliersServicesComponent implements OnInit {

  message: string = '';
  loading: boolean = false;

  Businesses?: BusinessModel[];

  businessId?: number;
  ServiceId?: number;
  consumerBusinessId?: number
  Platforms?: any[]
  selectedPlatformId?: number
  services: ServiceModel[] = [];

  constructor(
    private http: HttpConnectService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.consumerBusinessId = Number(localStorage.getItem('businessId'))
    this.getAllBusinesses();
  }

  getAllBusinesses(): void {
    this.loading = true;

    this.http.getAllData('Business').subscribe(
      res => {

        this.Businesses = (res as BusinessModel[]).map(
          el => new BusinessModel({
            business_id: el.business_id,
            business_name: el.business_name
          })
        );

        this.loading = false;
        this.cdr.detectChanges();
      },
      error => {

        console.error(error);

        this.loading = false;
        this.message = 'Error loading businesses';

        this.cdr.detectChanges();
      }
    );
  }

  onBusinessChanged(): void {
    this.services = [];
    this.ServiceId = undefined;
    this.message = '';

    if (!this.businessId) {
      return;
    }

    this.getAllServices();
    this.getPlatforms();
  }

    getPlatforms() {
    this.http.getAllData(`Platform/${this.businessId}`).subscribe((res: any) => {
      console.log(res)
      this.Platforms = res;
      this.cdr.detectChanges()
    })
  }

  getAllServices(): void {

    if (!this.businessId) {
      return;
    }

    this.loading = true;

    this.http
      .getAllData(`Service/${this.businessId}`)
      .subscribe(
        (res: any) => {

          console.log('Services:', res);

          this.services = (res as any[]).map(
            item => new ServiceModel({
              service_id: item.service_id,
              description: item.description,
              insert_on: item.insert_on,
              service_icon: item.service_icon,
              isPublic: item.isPublic,
              business_Services: item.business_Services,
              service_Activities: item.activity_Services
            })
          );

          this.loading = false;
          this.cdr.detectChanges();
        },
        error => {

          console.error(error);

          this.loading = false;
          this.message = 'Error loading services';

          this.cdr.detectChanges();
        }
      );
  }

  addSupplier(): void {
    this.loading = true;
    this.message = '';

    const data = {
      providerId: this.businessId,
      consumerId: this.consumerBusinessId,
      serviceId: this.ServiceId,
      platform_id: this.selectedPlatformId
    };

    console.log('Sending:', data);

    this.http
      .posteData(
        'Supplier',
        data
      )
      .subscribe(
        res => {

          console.log(res);

          this.loading = false;
          this.message = 'Supplier added successfully';

          this.cdr.detectChanges();
        },
        error => {

          console.error(error);

          this.loading = false;
          this.message = 'Error adding supplier';

          this.cdr.detectChanges();
        }
      );
  }
}

