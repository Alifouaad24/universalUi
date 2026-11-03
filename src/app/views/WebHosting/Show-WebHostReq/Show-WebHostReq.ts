import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  ToastHeaderComponent,
  BadgeModule,
  ButtonModule,
  DropdownModule,  
} from '@coreui/angular'
import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessType } from '../../../Models/Business/BusinessType';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { Country } from '../../../Models/CountryModel';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-WebHostReq.html',
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
    ToastComponent,DropdownModule, ButtonModule, BadgeModule,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class ShowCategoriesComponent implements OnInit {

  requstes: any[] = [];
  isLoading: boolean = false;
  message?: string
  showDeleteModal: boolean = false;
  selectedType?: Country;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  selectedBusinessId?: number | null

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.selectedBusinessId = localStorage.getItem('businessId') ? Number(localStorage.getItem('businessId')) : null;
    this.getAllMyRequestHosting()
  }



  getAllMyRequestHosting() {
    this.isLoading = true;
    const businessId = localStorage.getItem('businessId')
    const serviceId = localStorage.getItem('selectedServiceId')
    this.http.getAllData(`Orders/${businessId}/${serviceId}`).subscribe(

      (res: any) => {
        console.log(res)
        this.requstes = res
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

  confirmDelete(type: Country) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteBusinessType(type?: any) {
    // if (!type) return;
    // this.http.deleteData(`Category/${type.category_id}`,).subscribe(() => {
    //   this.Categories = this.Categories.filter(t => t.category_id !== type.category_id);
    //   this.showDeleteModal = false;
    //   this.toastMessage.set(`${type.name} deleted successfully`);
    //   this.toastVisible.set(true);
    // },(error) =>{
    //   this.toastMessage.set(`An error occured during delete (${type.name})`);
    //   this.toastVisible.set(true);
    // });
  }

  onVisibleChange(visible: boolean) {
    this.showDeleteModal = false;
    this.toastVisible.set(visible);
    if (!visible) this.percentage.set(0);
  }

  onTimerChange(value: number) {
    this.percentage.set(value * 25);
  }


  changeStatus(type: any, statusId: number, statusName?: string) {
    this.http.putData(`Orders/UpdateOrderStatus/${type.globalOrderId}/${statusId}`, {})
      .subscribe({
        next: (response) => {
          type.orderStatus.statusEn = statusName;
          console.log('Status updated successfully');
          this.toastMessage.set(`Status updated to ${statusName} successfully`);
          this.toastVisible.set(true);
          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error('Failed to update status', error);
        }
      });
  }

}
