import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
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
import { AddressModel } from '../../Models/AddressModel';

@Component({
  templateUrl: 'ShowAddresses.component.html',
  imports: [CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, RouterLink, RouterOutlet, 
     BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective, ButtonDirective]
})
export class ShowAddressesComponent implements OnInit {

  allAddresses: AddressModel[] = []
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false); 
  toastMessage = signal(''); 
  percentage = signal(0);
  autoHideToast = signal(true);
  
  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllAddresses()
  }


  getAllAddresses(){
    this.http.getAllData('Address').subscribe((res: any) => {
      this.allAddresses = (res as AddressModel[]).map(el => new AddressModel({
        address_id: el.address_id,
        line_1: el.line_1,
        line_2: el.line_2,
        post_code: el.post_code,
        state: el.state,
        city: el.city,
        visible: el.visible,
        insert_by: el.insert_by,
        insert_on: el.insert_on
      }))
      this.isLoading = false;
      this.cdr.detectChanges();
    },
      (err) => {
        this.isLoading = false;
        this.message = 'Error loading data';
        this.cdr.detectChanges();
      })
  }

  Businesses?: any[]
}
