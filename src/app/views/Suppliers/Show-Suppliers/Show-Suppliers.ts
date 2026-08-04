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
  ToastHeaderComponent
} from '@coreui/angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { SupplierModel } from '../../../Models/supplierMode';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Suppliers.html',
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
export class ShowSuppliersComponent implements OnInit {

  platformsSup: any[] = [];
  ProviderService: any[] = [];
  message?: string
  isLoading: boolean = false;
  isConsumer: boolean = false;
  showDeleteModal: boolean = false;
  businessServiceId?: number;
  selectedType?: SupplierModel;
  businesses?: BusinessModel[]
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);


  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllBusinesses()
  }

  getAllBusinesses() {
    this.isLoading = true;
    this.http.getAllData('Business').subscribe(res => {
      this.businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }))
      this.cdr.detectChanges()
      this.getServiceType()
    }, (error) => {
      console.error(error)
    })
    this.cdr.detectChanges()
  }

  getServiceType() {
    const businessId = localStorage.getItem('businessId');
    const serviceId = localStorage.getItem('selectedServiceId');
    this.http.getAllData(`Service/GetBusinessService/${businessId}/${serviceId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.isConsumer = res.is_Consumer;
        this.businessServiceId = res.business_ServiceId;
        if (!this.isConsumer) {
          this.getPlatformSuppliers();
        } else {
          this.GetProviderService();
        }
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  getPlatformSuppliers() {
    this.http.getAllData(`Platform/GetSupplierPlatForms/${this.businessServiceId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.platformsSup = res
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

  GetProviderService() {
    const serviceId = localStorage.getItem('selectedServiceId');
    this.http.getAllData(`Service/GetProviderService/${serviceId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.ProviderService = res
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

  confirmDelete(type: SupplierModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteSupplier(type?: SupplierModel) {
    if (!type) return;
    this.http.deleteData(`Account/deleteRole/${type.supplierId}`,).subscribe((res) => {
      console.log(res)
      this.platformsSup = this.platformsSup.filter(t => t.supplierId !== type.supplierId);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.business?.business_name} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete (${type.business?.business_name})`);
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

  getBusinessName(businessId: number): string {

    return this.businesses?.find(b => b.business_id === businessId)?.business_name ?? '';
  }

}
