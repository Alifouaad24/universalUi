import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { RloeModel } from '../../../Models/RloeModel';
import { BusinessModel } from 'src/app/Models/Business/BusinessModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Supplier.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditBusinessTypeComponent implements OnInit {

  message: string = '';
  loading: boolean = false
  Businesses?: BusinessModel[]
  Platforms?: any[]
  businessId?: number
  platformIds?: number[]
  businessServiceId?: number

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const businessServiceIdParam = params.get('businessServiceId');
      if (businessServiceIdParam) {
        this.businessServiceId = Number(businessServiceIdParam);
      }
    });
    const businessIdParam = localStorage.getItem('businessId');
    if (businessIdParam) {
      this.businessId = Number(businessIdParam);
      this.getPlatforms(this.businessId!);
    }
  }

  getPlatforms(businessId: number) {
    this.http.getAllData(`Platform/${businessId}`).subscribe((res: any) => {
      console.log(res)
      this.Platforms = res;
      this.cdr.detectChanges()
    })
  }


  addSupplier() {
    this.loading = true

    var data = {
      bsId: this.businessServiceId,
      platformsIds: this.platformIds
    }
    console.log(data)
    this.http.posteData('Platform/bindSupplierBusinessWithPlatform', data).subscribe(res => {
      console.log(res)
      this.loading = false
      this.message = 'Supplier added successfully'
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.loading = false
      this.message = 'Error adding supplier'
      this.cdr.detectChanges()
    })
  }
}
