import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-service.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
    ]
})
export class AddEditServiceComponent implements OnInit {
  description: string = '';
  message: string = '';
  loading: boolean = false
  activities?: ActiviityModel[]
  selectedActivityId?: number;

  constructor(private http: HttpConnectService, private router: Router) { }

  ngOnInit(): void {

  }

  getAllActivities(){
    this.http.getAllData('Activity').subscribe(res => {
    this.activities = (res as ActiviityModel[]).map((el) => new ActiviityModel({
      activity_id: el.activity_id,
      description: el.description
    }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addService() {
    this.loading = true
    if (!this.description) {
      this.message = 'Please enter Service description';
      this.loading = false
      return;
    }
    

    const payLoad = {
      "description": this.description,
      "activity_id": this.selectedActivityId
    }

    this.http.posteData('Service', { "name": this.description }).subscribe(res => {
      this.router.navigate(['Home/services'])
      this.loading = false
    }, (error) => {
      console.error(error)
      this.loading = false
    })



  }
}
