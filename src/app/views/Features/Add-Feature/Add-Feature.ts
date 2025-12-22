import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { ServiceModel } from '../../../Models/ServiceModel';

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
  name: string = '';
  message: string = '';
  loading: boolean = false
  Services?: ServiceModel[]
  selectedServiceId?: number;

  constructor(private http: HttpConnectService, private router: Router) { }

  ngOnInit(): void {
    this.getAllBusinesses()
  }

  getAllBusinesses(){
    this.http.getAllData('Service').subscribe(res => {
    this.Services = (res as ServiceModel[]).map((el) => new ServiceModel({
      service_id: el.service_id,
      description: el.description,

    }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addFeature() {
    this.loading = true
    if (!this.name) {
      this.message = 'Please enter feature name';
      this.loading = false
      return;
    }
    

    const payLoad = {
      "name": this.name,
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
}
