import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DocsComponentsComponent, DocsExampleComponent } from '@docs-components/public-api';
import { HttpConnectService } from 'src/app/Services/http-connect.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-business-type.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, DocsExampleComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
    DocsComponentsComponent]
})
export class AddEditBusinessTypeComponent {
  description: string = '';
  message: string = '';
  loading: boolean = false
  constructor(private http: HttpConnectService, private router: Router) { }

  addBusinessType() {
    this.loading = true
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



  }
}
