import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-show-shipping-list',
  templateUrl: './Show-Shipping-Lists.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    IconModule,
    ModalModule,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonGroupComponent,
    ButtonDirective,
    RouterLink,
    ReactiveFormsModule,
    FormCheckLabelDirective,
    ButtonToolbarComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    RouterOutlet,
    FormControlDirective,
    DropdownComponent,
    FormsModule,
    CommonModule,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownDividerDirective,
    ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent
  ]
})
export class ShowShippingListComponent implements OnInit {

  ShippingLists: any[] = [];

  message?: string;
  isLoading = false;

  showDeleteModal = false;
  selectedType: any;

  // Toaster
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(
    private http: HttpConnectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllShippingLists();
  }

  getAllShippingLists(): void {
    this.isLoading = true;
    this.message = '';

    this.http.getAllData('ShippingList').subscribe(
      (res: any) => {
        console.log(res)
        this.ShippingLists = res;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (err) => {
        console.error(err);

        this.isLoading = false;
        this.message = 'Error loading shipping lists';

        this.cdr.detectChanges();
      }
    );
  }

  confirmDelete(type: any): void {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteShippingList(type?: any): void {
    if (!type) return;

    this.http.deleteData(`ShippingList/${type.shippingListId}`).subscribe(
      (res) => {

        this.ShippingLists = this.ShippingLists.filter(
          t => t.shippingListId !== type.shippingListId
        );

        this.showDeleteModal = false;

        this.toastMessage.set('Shipping list deleted successfully');
        this.toastVisible.set(true);

        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error);

        this.toastMessage.set('An error occurred while deleting shipping list');
        this.toastVisible.set(true);
      }
    );
  }

  onVisibleChange(visible: boolean): void {
    this.showDeleteModal = false;
    this.toastVisible.set(visible);

    if (!visible) {
      this.percentage.set(0);
    }
  }

  onTimerChange(value: number): void {
    this.percentage.set(value * 25);
  }
}