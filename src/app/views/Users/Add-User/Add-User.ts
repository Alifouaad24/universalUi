import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, SpinnerComponent, SpinnerModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { RloeModel } from '../../../Models/RloeModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-User.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent, SpinnerComponent, SpinnerModule,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditUserComponent implements OnInit {
  userName: string = '';
  Email: string = '';
  message: string = '';
  loading: boolean = false
  Roles?: RloeModel[]
  selectedRoleId: string[] = [];
  loadingRoles = true;
  createdPassword: string = '';
  Businesses?: BusinessModel[]
  selectedBusinessId: number[] = [];
  loadingBusiness = true;

  constructor(private http: HttpConnectService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAlRless()
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

  getAlRless() {
    this.loadingRoles = true;
    this.http.getAllData('Account/getAllRoles').subscribe(res => {
      this.loadingRoles = false;
      this.Roles = (res as RloeModel[]).map((el) => new RloeModel({
        id: el.id,
        name: el.name,

      }))
      this.cdr.detectChanges()
    }, (error) => {
      this.cdr.detectChanges()
      this.loadingRoles = false
      console.error(error)
    })
  }

  addUser() {
    this.loading = true
    if (!this.userName && !this.Email) {
      this.message = 'Please enter Service description';
      this.loading = false
      return;
    }


    const payLoad = {
      "userName": this.userName.replace(' ', '-'),
      "email": this.Email,
      "roles": this.selectedRoleId,
      "businessIds" : this.selectedBusinessId
    }
    console.log(payLoad)

    this.http.posteData('Account/AddUsers', payLoad).subscribe(res => {
      this.router.navigate(['Home/users'])
      this.createdPassword = res.password
      this.loading = false
      alert(`User password: ${this.createdPassword}`)

    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  AddRemoveRole(id: string) {
    const index = this.selectedRoleId.indexOf(id);

    if (index > -1) {
      this.selectedRoleId.splice(index, 1);
    } else {
      this.selectedRoleId.push(id);
    }
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
