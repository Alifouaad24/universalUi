import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { RloeModel } from '../../../Models/RloeModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Role.html',
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
  role?: RloeModel;
  idForEdit?: string

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const roleStr = this.route.snapshot.queryParamMap.get('role');
    if (roleStr) {
      this.role = JSON.parse(roleStr);
      this.description = this.role?.name;
      this.idForEdit = this.role?.id;
    }
  }




  addRole() {
    this.loading = true
    if (this.role == null) {
      if (!this.description) {
        this.message = 'Please enter description';
        this.loading = false
        return;
      }

      this.http.posteData(`Account/CreateRole/${this.description}`, {}).subscribe(res => {
        this.router.navigate(['Home/roles'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.description) {
        this.message = 'Please enter role name';
        this.loading = false
        return;
      }

      this.http.putData(`Account/UpdateRole/${this.idForEdit}/${this.description}`, {}).subscribe(res => {
        this.router.navigate(['Home/roles'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }



  }
}
