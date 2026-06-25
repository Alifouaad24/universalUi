import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { SystemModel } from '../../../Models/SystemModel';
import { ServiceModel } from '../../../Models/ServiceModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Feature.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditFeatureComponent implements OnInit {
  status: string = '';
  body: string = '';
  message: string = '';
  loading: boolean = false
  Systems?: SystemModel[]
  selectedSystemId?: number;
  Businesses?: BusinessModel[]
  Services?: ServiceModel[]
  selectedServiceId?: number;
  selectedBusinessId?: number;


  constructor(private http: HttpConnectService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllSystems()
    this.getAllBusiness()
  }

  getAllBusiness() {
    const businessId = localStorage.getItem('businessId')

    this.http.getAllData(`Business/GetAllBusinessForTask/${businessId}`).subscribe(res => {
      this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }))

      this.selectedBusinessId = this.Businesses.find(el => el.business_id == Number(businessId))?.business_id
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

loadingServices = false
  getAllServices(busianessId: number | undefined) {
    this.loadingServices = true
    this.Services = []
    this.http.getAllData(`Service/${busianessId}`).subscribe(res => {
      console.log(res)
      this.Services = (res as ServiceModel[]).map((el) => new ServiceModel({
        service_id: el.service_id,
        description: el.description
      }))
      this.loadingServices = false
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.loading = false
      this.loadingServices = false
    })
  }

  filerServices(id: number){
    this.Services = this.Services?.filter(s => s.business_Services.business_id == id)
  }

  getAllSystems() {
    this.http.getAllData('GlobalSystem').subscribe(res => {
      this.Systems = (res as SystemModel[]).map((el) => new SystemModel({
        globalSystemId: el.globalSystemId,
        globalSystemName: el.globalSystemName,
      }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addFeature() {
    this.loading = true
    if (!this.body) {
      this.message = 'Please enter task body';
      this.loading = false
      return;
    }

    const payLoad = {
      "body": this.body,
      "status": this.status,
      "globalSystemId": this.selectedSystemId,
      "businessId": this.selectedBusinessId,
      "serviceId": this.selectedServiceId
    }

    this.http.posteData('Feature', payLoad).subscribe(res => {
      this.router.navigate(['Home/features'])
      this.loading = false
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addComment() {
    this.loading = true
    if (!this.body) {
      this.message = 'Please enter comment body';
      this.loading = false
      return;
    }
  }
}
