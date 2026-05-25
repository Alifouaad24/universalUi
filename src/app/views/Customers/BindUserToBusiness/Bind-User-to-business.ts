import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, SpinnerComponent, SpinnerModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { RloeModel } from '../../../Models/RloeModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Bind-User-to-business.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent, SpinnerComponent, SpinnerModule,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class BindUserToBusinessComponent implements OnInit {
  userName: string = '';
  Email: string = '';
  loading: boolean = false
  Businesses?: BusinessModel[]
  selectedBusinessId: number[] = [];
  loadingBusiness = true;
  id: string = '';
  businesses?: any
  constructor(private http: HttpConnectService, private route: ActivatedRoute,
    private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'] || '';
      this.Email = params['email'] || '';
      this.id = params['userId'] || '';
    });

    this.businesses = localStorage.getItem('businesses');
    console.log(this.businesses)
    if (this.businesses) {
      const busObj = JSON.parse(this.businesses);
      if (busObj && Array.isArray(busObj)) {
        this.selectedBusinessId = busObj.map((b: any) => b.business_id);
      }
    }

    this.http.getAllData('Business').subscribe(res => {
      this.loadingBusiness = true;
      console.log(res)
      this.Businesses = (res as any[]).map(el => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name,
      }))
      this.loadingBusiness = false;
      this.cdr.detectChanges()
    }, (error) => {
      this.loadingBusiness = false;
      console.error(error)
      this.cdr.detectChanges()


    })
  }

  BindUserToBusiness() {
    this.loading = true
   
    const payLoad = {
      "userId": this.id,
      "businessesIds": this.selectedBusinessId
    }
    console.log(payLoad)

    this.http.posteData('UserBusiness', payLoad).subscribe(res => {
      this.loading = false
      this.router.navigate(['Home/users'])
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }


  AddRemoveBusiness(id: number) {
    const index = this.selectedBusinessId.indexOf(id);

    if (index > -1) {
      this.selectedBusinessId.splice(index, 1);
    } else {
      this.selectedBusinessId.push(id);
    }
  }
}
