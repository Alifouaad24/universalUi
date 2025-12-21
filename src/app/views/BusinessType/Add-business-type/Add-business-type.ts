import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessType } from '../../../Models/Business/BusinessType';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-business-type.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditBusinessTypeComponent implements OnInit {

  description?: string;
  message: string = '';
  loading: boolean = false
  business?: BusinessType;
  idForEdit?: number

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const businessStr = this.route.snapshot.queryParamMap.get('business');
    if (businessStr) {
      this.business = JSON.parse(businessStr);
      this.description = this.business?.description;
      this.idForEdit = this.business?.business_type_id;
    }
  }




  addBusinessType() {
    this.loading = true
    if (this.business == null) {
      if (!this.description) {
        this.message = 'Please enter description';
        this.loading = false
        return;
      }

      this.http.posteData('BusinessType', { "description": this.description }).subscribe(res => {
        this.router.navigate(['Home/business-types'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.description) {
        this.message = 'Please enter description';
        this.loading = false
        return;
      }

      this.http.putData(`BusinessType/${this.idForEdit}`, { "description": this.description }).subscribe(res => {
        this.router.navigate(['Home/business-types'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }



  }
}
