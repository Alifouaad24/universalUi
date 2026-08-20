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
  templateUrl: './Add-Causes.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddCausesComponent implements OnInit {

  name?: string;
  message: string = '';
  loading: boolean = false
  cause?: any;
  idForEdit?: string

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const caseStr = this.route.snapshot.queryParamMap.get('cause');
    if (caseStr) {
      this.cause = JSON.parse(caseStr);
      this.name = this.cause?.causeName;
      this.idForEdit = this.cause?.causeId;
    }
  }




  addCause() {
    this.loading = true
    if (this.cause == null) {
      if (!this.name) {
        this.message = 'Please enter description';
        this.loading = false
        return;
      }

      this.http.posteData(`Cause`, {
        name: this.name
      }).subscribe(res => {
        this.router.navigate(['Home/causes'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.name) {
        this.message = 'Please enter name';
        this.loading = false
        return;
      }

      this.http.putData(`Cause/${this.idForEdit}`, { name: this.name }).subscribe(res => {
        this.router.navigate(['Home/causes'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }



  }
}
