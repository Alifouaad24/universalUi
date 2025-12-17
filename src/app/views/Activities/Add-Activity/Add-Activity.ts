import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Activity.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
    ]
})
export class AddEditActivityComponent implements OnInit {
  description: string = '';
  message: string = '';
  loading: boolean = false
  Businesses?: BusinessModel[]
  selectedBusinessId?: number;

  constructor(private http: HttpConnectService, private router: Router) { }

  ngOnInit(): void {
    this.getAllBusinesses()
  }

  getAllBusinesses(){
    this.http.getAllData('Business').subscribe(res => {
    this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
      business_id: el.business_id,
      business_name: el.business_name,

    }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addActivity() {
    this.loading = true
    if (!this.description) {
      this.message = 'Please enter Service description';
      this.loading = false
      return;
    }
    

    const payLoad = {
      "description": this.description,
      "business_id": this.selectedBusinessId
    }

    this.http.posteData('Activity', payLoad).subscribe(res => {
      this.router.navigate(['Home/activities'])
      this.loading = false
    }, (error) => {
      console.error(error)
      this.loading = false
    })



  }
}
