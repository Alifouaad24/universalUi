import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { ServiceModel } from '../../../Models/ServiceModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-system.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditSystemComponent implements OnInit {
  name: string = '';
  type: string = '';
  url: string = '';
  message: string = '';
  loading: boolean = false;
  isUpdate = false;

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const system = JSON.parse(params.get('system') || 'null');
      console.log(system)
      if (system) {
        this.name = system.globalSystemName;
        this.type = system.globalSystemType;
        this.url = system.globalSystemUrl;
        this.isUpdate = true;
      }
    })
  }



  addSystem() {
    this.loading = true
    if (!this.name) {
      this.message = 'Please enter system name';
      this.loading = false
      return;
    }
    if (!this.type) {
      this.message = 'Please enter system type';
      this.loading = false
      return;
    }
    if (!this.url) {
      this.message = 'Please enter system url';
      this.loading = false
      return;
    }

    const payLoad = {
      "name": this.name,
      "type": this.type,
      "url": this.url,
    }

    this.isUpdate ? this.http.putData('GlobalSystem', payLoad).subscribe(res => {
      this.router.navigate(['Home/systems'])
      this.loading = false
    }, (error) => {
      console.error(error)
      this.loading = false
    }) :

      this.http.posteData('GlobalSystem', payLoad).subscribe(res => {
        this.router.navigate(['Home/systems'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      });
  }
}
