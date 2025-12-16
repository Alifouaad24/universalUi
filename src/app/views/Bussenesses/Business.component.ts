import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BadgeComponent, ButtonDirective, FormModule, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';

import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  RowComponent,
} from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
import { BusinessModel } from '../../Models/Business/BusinessModel';

@Component({
  templateUrl: 'Business.component.html',
  imports: [CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, RouterLink, RouterOutlet, 
     BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective, ButtonDirective]
})
export class BusinessComponent implements OnInit {

  Businesses?: BusinessModel[]

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.getAllData('Business').subscribe(res => {
      console.log(res)
      this.Businesses = (res as any[]).map(el => new BusinessModel({
        business_name: el.business_name,
        country: el.country,
        is_active: el.is_active,
        business_whatsapp: el.business_whatsapp,
      }))
      this.cdr.detectChanges()
    },(error)=> {
      console.error(error)
      this.cdr.detectChanges()

    })
  }
}
