import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-country.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
    ]
})
export class AddEditCountryComponent {
  description: string = '';
  message: string = '';
  loading: boolean = false
  constructor(private http: HttpConnectService, private router: Router) { }

  addCountry() {
    this.loading = true
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



  }
}
