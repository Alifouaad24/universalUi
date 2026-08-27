import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {
  ButtonDirective,
  ButtonGroupComponent,
  ButtonToolbarComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalModule,
  RowComponent,
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessType } from '../../../Models/Business/BusinessType';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { Country } from '../../../Models/CountryModel';
import { ServiceModel } from '../../../Models/ServiceModel';
import { InventoryModel } from '../../../Models/InventoryModel';
declare const bootstrap: any; // NEW: بدل import { Modal } from 'bootstrap';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-items.html',
  imports: [RowComponent, ColComponent, CardComponent, IconModule, ModalModule,
    CardHeaderComponent, CardBodyComponent, ButtonGroupComponent,
    ButtonDirective, RouterLink, ReactiveFormsModule,
    FormCheckLabelDirective, ButtonToolbarComponent,
    InputGroupComponent, InputGroupTextDirective, RouterLink, RouterOutlet,
    FormControlDirective, DropdownComponent, FormsModule, CommonModule,
    DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective,
    ButtonDirective,
    ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class ShowItemsComponent implements OnInit {

  inventory: any[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedItem?: any;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  ForDropShipping: boolean = false

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      var isDropShipping = params['dropShpping']
      if (isDropShipping) {
        this.ForDropShipping = true
        this.getComplatedItems()
      } else {
        this.getItems()
      }
    })

  }

  getItems() {
    this.isLoading = true;
    const businessId = localStorage.getItem('businessId')
    this.http.getAllData(`Item/${businessId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.inventory = res;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.message = 'Error loading data';
        this.cdr.detectChanges();
      }
    );
  }

  getComplatedItems() {
    this.isLoading = true;
    const businessId = localStorage.getItem('businessId')
    this.http.getAllData(`Item/CompatedItems/${businessId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.inventory = res;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.message = 'Error loading data';
        this.cdr.detectChanges();
      }
    );
  }

  confirmDelete(type: any) {
    this.selectedItem = type;
    this.showDeleteModal = true;
  }

  deleteActivity(type?: any) {
    if (!type) return;
    this.http.deleteData(`Inventory/${type.inventory_id}`,).subscribe(() => {
      this.inventory = this.inventory.filter(t => t.inventory_id !== type.inventory_id);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.product_name} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete (${type.product_name})`);
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

  isItemModalVisible = false;

  openItemModal(item: any) {
    this.selectedItem = item;
    this.isItemModalVisible = true;
  }

}
