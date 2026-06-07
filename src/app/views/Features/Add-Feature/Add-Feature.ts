import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { SystemModel } from '../../../Models/SystemModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Feature.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditFeatureComponent implements OnInit {
  title: string = '';
  status: string = '';
  body: string = '';
  message: string = '';
  loading: boolean = false
  Systems?: SystemModel[]
  selectedSystemId?: number;

  constructor(private http: HttpConnectService, private router: Router) { }

  ngOnInit(): void {
    this.getAllSystems()
  }

  getAllSystems() {
    this.http.getAllData('GlobalSystem').subscribe(res => {
      this.Systems = (res as SystemModel[]).map((el) => new SystemModel({
        globalSystemId: el.globalSystemId,
        globalSystemName: el.globalSystemName,
      }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addFeature() {
    this.loading = true
    if (!this.title) {
      this.message = 'Please enter feature title';
      this.loading = false
      return;
    }

    const payLoad = {
      "title": this.title,
      "body": this.body,
      "status": this.status,
      "globalSystemId": this.selectedSystemId
    }

    this.http.posteData('Feature', payLoad).subscribe(res => {
      this.router.navigate(['Home/features'])
      this.loading = false
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }
  
  addComment() {
    this.loading = true
    if (!this.body) {
      this.message = 'Please enter comment body';
      this.loading = false
      return;
    }
  }
}
