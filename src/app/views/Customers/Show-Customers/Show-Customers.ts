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
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective
} from '@coreui/angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessType } from '../../../Models/Business/BusinessType';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { Country } from '../../../Models/CountryModel';
import { ServiceModel } from '../../../Models/ServiceModel';
import { CustomerModel } from '../../../Models/CustomerModel';
import { CustomerBusenessModel } from '../../../Models/customerBusiness';
import { AddressModel } from '../../../Models/AddressModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Customers.html',
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
    ToastHeaderComponent, ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonDirective,

    ToastBodyComponent]
})
export class ShowCustomersComponent implements OnInit {

  Users: CustomerModel[] = [];
  User: CustomerModel = new CustomerModel();
  message?: string
  isLoading: boolean = false;
  BusinessId: number = 0;
  showDeleteModal: boolean = false;
  selectedType?: CustomerModel;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  Businesses?: BusinessModel[]

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    var BusinessId = localStorage.getItem('businessId');
    console.log(BusinessId);
    this.BusinessId = BusinessId ? parseInt(BusinessId) : 0;
    this.getAllCustomers()
    this.getAllBusinesses()
  }

  getAllBusinesses() {
    this.http.getAllData('Business').subscribe(res => {
      console.log(res)
      this.Businesses = (res as any[]).map(el => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name,
        country: el.country,
        countryId: el.countryId,
        is_active: el.is_active,
        business_whatsapp: el.business_whatsapp,
        business_phone: el.business_phone,
        business_webSite: el.business_webSite,
        business_fb: el.business_fb,
        business_instgram: el.business_instgram,
        business_tiktok: el.business_tiktok,
        business_google: el.business_google,
        business_youtube: el.business_youtube,
        business_email: el.business_email,
        businessTypes: el.businessTypes,
        businessAddresses: el.businessAddresses,
        business_LogoUrl: el.business_LogoUrl,
        buseness_Customers: el.buseness_Customers,
        insert_by: el.insert_by,
        business_Activitiy: el.business_Activitiy,
        insert_on: el.insert_on,
        providerBusinessRelations: el.providerBusinessRelations,
        consumerBusinessRelations: el.consumerBusinessRelations,
        usersBusinesses: el.usersBusinesses,

        business_Services: el.business_Services
      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()

    })
  }


  businessName(id: number): string {

    return this.Businesses
      ?.find(b => b.business_id === id)
      ?.business_name ?? '';

  }


  getAllCustomers() {
    this.isLoading = true;
    this.http.getAllData(`Customers/${this.BusinessId}`).subscribe(

      (res: any) => {
        console.log(res);
        this.Users = (res as any[]).map(
          item =>
            new CustomerModel({
              GlobalCustomerId: item.globalCustomerId,
              CustomerName: item.customerName,
              CustomerEmail: item.customerEmail,
              CustomerMobile: item.customerMobile,
              CustomerImage: item.customerImage,

              Country_id: item.countryId,

              Country: new Country({
                countryId: item.country?.countryId,
                name: item.country?.name,
                insert_on: item.country?.insert_on,
                insert_by: item.country?.insert_by,
                visible: item.country?.visible,
              }),

              AddressId: item.addressId,

              Address: item.address,

              Buseness_Customer: (item.buseness_Customers || []).map(
                (b: any) =>
                  new CustomerBusenessModel({
                    buseness_CustomerId: b.buseness_CustomerId,
                    globalCustomerId: b.globalCustomerId,
                    business_id: b.business_id,
                    isOwner: b.isOwner,
                  })
              ),
            })
        );

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

  confirmDelete(type: CustomerModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteUser(type?: CustomerModel) {
    if (!type) return;
    this.http.deleteData(`Customers/${type.GlobalCustomerId}`,).subscribe(() => {
      this.Users = this.Users.filter(t => t.GlobalCustomerId !== type.GlobalCustomerId);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.CustomerName} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete (${type.CustomerName})`);
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

  showUserRoles() {
    alert("Feature coming soon!");
  }

  public visible = false;
  reoles?: any[];

  // toggleLiveDemo(type: CustomerModel | null) {
  //   console.log(type);
  //   this.visible = !this.visible;
  //   this.reoles = type?.roles;
  // }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

}
