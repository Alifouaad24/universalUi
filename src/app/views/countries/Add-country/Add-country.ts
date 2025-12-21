import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { Country } from '../../../Models/CountryModel';
@Component({
  selector: 'app-buttons',
  templateUrl: './Add-country.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditCountryComponent implements OnInit {
  description: string = '';
  message: string = '';
  loading: boolean = false
  contryForEdit?: Country;
  id?: number
  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const countryFromQyery = params.get('country')
      if (countryFromQyery) {
        this.contryForEdit = JSON.parse(countryFromQyery);
        console.log(this.contryForEdit)
        this.id = this.contryForEdit!.countryId
        this.description = this.contryForEdit!.name;
      }
    })
  }

  addCountry() {
    this.loading = true

    if (this.contryForEdit == null) {
      if (!this.description) {
        this.message = 'Please enter Country name';
        this.loading = false
        return;
      }

      this.http.posteData('Country', { "name": this.description }).subscribe(res => {
        this.router.navigate(['Home/countries'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.description) {
        this.message = 'Please enter Country name';
        this.loading = false
        return;
      }

      this.http.putData(`Country/${this.id}`, { "name": this.description }).subscribe(res => {
        this.router.navigate(['Home/countries'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }



  }
}
