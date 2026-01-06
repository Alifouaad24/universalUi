import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { FinantiaModel } from '../../../Models/FinantiaModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Finantial.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditFinantialComponent implements OnInit {
  name: string = '';
  message: string = '';
  loading: boolean = false
  finantial?: FinantiaModel
  selectedServiceId?: number;
  id?: number

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param => {
      const finantialJson = param.get('finantial');
      if (finantialJson) {
        this.finantial = JSON.parse(finantialJson);
        this.id = this.finantial?.finantial_itemId
        this.name = this.finantial?.finantial_description ?? ''
      }
    })
  }


  addFinantial() {
    this.loading = true
    if (!this.name) {
      this.message = 'Please enter finantial description';
      this.loading = false
      return;
    }
    
    const payLoad = {
      "description": this.name,
    }

    if (this.id) {
      this.http.putData(`FinantialItem/${this.id}`, payLoad).subscribe(res => {
        this.router.navigate(['Home/finantial-items'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      this.http.posteData('FinantialItem', payLoad).subscribe(res => {
        this.router.navigate(['Home/finantial-items'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }





  }
}
