import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { BadgeComponent, ButtonDirective, FormModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ProgressBarComponent, ProgressComponent, TableDirective, ToastBodyComponent, ToastCloseDirective, ToastComponent, ToastModule } from '@coreui/angular';
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
  imports: [CardComponent, CardHeaderComponent, ToastComponent, ToastBodyComponent,
     ToastCloseDirective, ToastModule, ProgressComponent,
     ModalComponent, ModalHeaderComponent,ModalBodyComponent, ModalFooterComponent,
     CardBodyComponent, RowComponent, RouterLink, RouterOutlet,
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
  selectedType?: AddressModel;

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }
  Businesses?: any[]
  ngOnInit(): void {
    this.getAllAddresses()
  }


  getAllAddresses() {
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

  confirmDelete(type: AddressModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }


  deleteAddress(type?: AddressModel) {
    if (!type) return;
    this.http.deleteData(`Address/${type.address_id}`,).subscribe((res) => {
      console.log(res)
      this.allAddresses = this.allAddresses.filter(t => t.address_id !== type.address_id);
      this.showDeleteModal = false;
      this.toastMessage.set(`$ deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete`);
      this.toastVisible.set(true);
    });
  }
  onVisibleChange(visible: boolean) {
    this.showDeleteModal = false;
    this.toastVisible.set(visible);
    if (!visible) this.percentage.set(0);
  }

  onTimerChange(value: number) {
    this.percentage.set(value * 25);
  }
}
