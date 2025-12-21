import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { ServiceModel } from '../../../Models/ServiceModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';
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
  description?: String;
  message: string = '';
  loading: boolean = false
  activities?: ActiviityModel[]
  businesses?: BusinessModel[]
  serviceToEdit?: ServiceModel
  id?: number
  visibility: 'public' | 'local' = 'public';

  constructor(private http: HttpConnectService, private router: Router,
    private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllActivities();
    this.getAllBusinesses();
    this.route.queryParamMap.subscribe(param => {
      const serFromQuery = param.get('service')
      if (serFromQuery) {
        console.log(serFromQuery)
        this.serviceToEdit = JSON.parse(serFromQuery)
        this.description = this.serviceToEdit!.description!
        this.id = this.serviceToEdit!.service_id
      }
    })
  }

  getAllActivities() {
    this.http.getAllData('Activity').subscribe(res => {
      this.activities = (res as ActiviityModel[]).map((el) => new ActiviityModel({
        activity_id: el.activity_id,
        description: el.description
      }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
    this.cdr.detectChanges()
  }

  getAllBusinesses() {
    this.http.getAllData('Business').subscribe(res => {
      this.businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.loading = false
    })
    this.cdr.detectChanges()
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
      "isPublic": this.visibility === 'public' ? true : false,
      "businessesId": this.selectedBusinessIds,
      "activitiesId": this.selectedActivityIds,
    }

    this.http.posteData('Service', payLoad).subscribe(res => {
      this.router.navigate(['Home/services'])
      this.loading = false
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  selectedActivityIds: number[] = [];

  toggleActivity(id: number, event: any) {
    if (event.target.checked) {
      this.selectedActivityIds.push(id);
    } else {
      this.selectedActivityIds =
        this.selectedActivityIds.filter(x => x !== id);
    }
  }

  selectedBusinessIds: number[] = [];

  toggleBusiness(id: number, event: any) {
    if (event.target.checked) {
      this.selectedBusinessIds.push(id);
    } else {
      this.selectedBusinessIds =
        this.selectedBusinessIds.filter(x => x !== id);
    }
  }


}
