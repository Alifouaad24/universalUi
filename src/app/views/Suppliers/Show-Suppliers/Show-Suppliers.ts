import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CityModel } from '../../../Models/CityModel';
import { AreaModel } from '../../../Models/AreaModel';
import { StateModel } from '../../../Models/StateModel';
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
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { GlobalShippingTypesModel } from '../../../Models/GlobalShippingType';
import { Country } from '../../../Models/CountryModel';

type OrdersModalView = 'list' | 'new';

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
  preOrders: any[] = [];
  platformsSup: any[] = [];
  ProviderService: any[] = [];
  message?: string
  isLoading: boolean = false;
  isConsumer: boolean = false;
  showDeleteModal: boolean = false;
  businessServiceId?: number;
  selectedType?: SupplierModel;
  businesses?: BusinessModel[]
  OrderProductLine = {}
  productsToAdd: any[] = []
  Sizes: any[] = []
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  searchTerm: string = '';
  filteredSuggestions: string[] = [];
  filteredSuggestion: string = '';
  res: any[] = [];
  OrderStatus: any[] = [];
  res1: any
  selectedOrderStatusId?: number
  providers: any[] = [];
  selectedproviderId: number | null = null

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllBusinesses()
    this.getAllShippingTypes()
    this.getAllProviders()
    this.getAllOrderStatus()
    this.getAllSizes()
  }

  getAllOrderStatus() {
        var businessId = Number(localStorage.getItem('businessId'))

    this.http.getAllData(`UniversalOrder/${businessId}`).subscribe((res: any) => {
      this.OrderStatus = res
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
    })
  }

  getAllProviders() {
    this.isLoading = true
    var businessId = Number(localStorage.getItem('businessId'))
    this.http.getAllData(`Supplier/${businessId}`).subscribe((res: any) => {
      console.log(res)
      this.isLoading = false
      this.providers = res
      this.cdr.detectChanges()
    })
  }

  getAllSizes() {
    this.http.getAllData('Size').subscribe((res: any) => {
      this.Sizes = res
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
    })
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

  showOrdersModal = false;
  selectedPlatformId?: number;

  openOrdersModal(platformId: number, supplierId: number) {
    this.selectedPlatformId = platformId;
    this.selectedproviderId = supplierId
    this.showOrdersModal = true;
    this.getUniversalOrders(platformId)
    localStorage.setItem('selectedPlatformId', platformId.toString());
  }

  getUniversalOrders(platformId: number) {
    this.isLoading = true
    const businessId = localStorage.getItem('businessId');

    this.http.getAllData(`Orders/GetUniversalOrders?businessId=${businessId}&platformId=${platformId}`).subscribe((res: any) => {
      this.preOrders = res
      console.log(res)
      this.isLoading = false
      this.cdr.detectChanges()
    }, (error) => {
      this.isLoading = false
    })
  }

  // //..........................................////////

  view: OrdersModalView = 'list';

  // ---------- قائمة الـ pre-order ----------

  selectedPreOrderId: number | null = null;

  // ---------- بيانات مرجعية ----------
  shippingTypes: any[] = [];
  sizes: any[] = [];

  // ---------- نموذج الطلب الجديد ----------
  phoneQuery = '';
  customerSuggestions: any[] = [];
  selectedCustomer: any | null = null;
  customerNotFound = false; // نناقشه لاحقًا كما ذكرت

  selectedShippingTypeId: number | null = null;
  cartLink = ''; // maxlength 100

  enCodicUrlInput = '';
  productLines: any[] = [];

  saving = false;

  private phoneQuery$ = new Subject<string>();


  selectPreOrder(order: any) {

  }


  // ==========================================================
  // فتح المودال (يُستدعى من الأيقونة براس كل صف بالداتاتيبل)
  // ==========================================================
  openOrders(): void {
    this.view = 'list';
    this.showOrdersModal = true;
    this.loadPreOrders();
  }

  closeModal(): void {
    this.showOrdersModal = false;
  }

  // ==========================================================
  // شاشة القائمة
  // ==========================================================
  loadPreOrders(): void {
    // TODO: استبدلها بالنداء الحقيقي
    // this.ordersApi.getByStatus('pre order').subscribe(list => this.preOrders = list);
  }



  startNewOrder(): void {
    this.resetForm();
    this.view = 'new';
  }

  backToList(): void {
    this.view = 'list';
  }



  // ==========================================================
  // إضافة منتج عبر SKU
  // منطق العمل:
  // 1) نتأكد أول إذا الـ sku موجود بجدول products_cache لنفس المنصة
  // 2) إذا موجود -> نرجع الصورة والسعر مباشرة من القاعدة
  // 3) إذا غير موجود -> نستدعي سيرفس السكرابنك الخاص بشي إن،
  //    ونخزن النتيجة بـ products_cache حتى ما نعيد السكرابنك بالمرات الجاية
  // ==========================================================
  // https://onelink.shein.com/44/5wtxu5kyqogg?shc=2_RuGtHcXrvNk

  addingProduct = false
  addProductByenCodicUrl(): void {

    const enCodicUrlInput = this.enCodicUrlInput.trim();
    const encodedUrl = encodeURIComponent(enCodicUrlInput);
    if (!encodedUrl) return;
    this.addingProduct = true
    this.http.getAllData(`Scraper/extract?url=${encodedUrl}&timeoutSeconds=20`).subscribe((res: any) => {
      this.productsToAdd.push({
        ...res,
        size_id: null,
        price: null,
      });

      this.addingProduct = false;
      this.cdr.detectChanges();
    }, (error) => {
      this.addingProduct = false
    });
  }



  saveOrder(): void {
    const businessId = Number(localStorage.getItem('businessId'));
    const serviceId = Number(localStorage.getItem('selectedServiceId'));
    this.saving = true;
    const payload = {
      cartValue: this.cartLink,
      platform_id: this.selectedPlatformId,
      business_id: businessId,
      service_id: serviceId,
      globalCustomerId: this.res1.globalCustomerId,
      shippingTypeId: this.selectedShippingTypeId,
      orderStatusId: this.selectedOrderStatusId,
      itemInfos: this.productsToAdd,
      providerId: this.selectedproviderId
    };

    this.http.posteData('Orders/AddUniversalOrder', payload).subscribe(res => {
      this.closeModal()
    }, (error) => {
      alert(error)
    })


    console.log(payload)
    this.saving = false;
    // this.closeModal();
  }

  fromOldDbName?: string
  fromOldDbMobile?: string
  fromOldDbCity?: string
  fromOldDbArea?: string
  fromOldDbLandMark?: string

  private resetForm(): void {
    this.selectedPreOrderId = null;
    this.phoneQuery = '';
    this.customerSuggestions = [];
    this.selectedCustomer = null;
    this.customerNotFound = false;
    this.selectedShippingTypeId = null;
    this.cartLink = '';
    this.enCodicUrlInput = '';
    this.productLines = [];
  }

  filterSuggestions(): void {
    this.filteredSuggestions = [];
    const businessId = localStorage.getItem('businessId')
    var value = this.phoneQuery
    if (value.length >= 3) {
      if (/^\d/.test(value)) {
        this.http.getAllData(`Customers/SearchAboutCustomers/${value}`).subscribe((result: any) => {
          console.log(result)
          this.filteredSuggestions = result.customers.map((el: any) => el.customerName);
          if(this.filteredSuggestions.length == 0){
            this.customerNotFound = true
          }
          this.cdr.detectChanges()
        });
      }
      this.cdr.detectChanges()
    } else {
      this.filteredSuggestions = [];
      
    }
  }
  customerName = ''

  selectCustomer(suggestion: string): void {
    this.searchTerm = suggestion;
    this.filteredSuggestions = [];
    const search = encodeURIComponent(suggestion);
    this.http.getAllData(`Customers/SearchAboutDetectedCustomer/${search}`)
      .subscribe((result1: any) => {
        console.log(result1)
        this.res1 = null
        this.res1 = result1.customer
        this.customerName = this.res1.customerName + ' - ' + this.res1.customerMobile + ' - ' + this.res1.country.name
          + ' - ' + this.res1.address[0]?.city?.description + ' - ' + this.res1.address[0]?.area?.description + ' - ' + this.res1.
            land_Mark
        this.phoneQuery = ''
        this.cdr.detectChanges()

      })
    this.cdr.detectChanges()
  }

  deleteCustomer() {
    this.customerName = ''
  }
  GlobalShippingTypes: GlobalShippingTypesModel[] = [];

  getAllShippingTypes() {
    this.isLoading = true;
    this.http.getAllData('GlobalShippingTypes').subscribe(
      (res: any) => {
        console.log(res)
        this.GlobalShippingTypes = (res as any[]).map(item => new GlobalShippingTypesModel({
          shippingTypeId: item.shippingTypeId,
          name: item.name,
        }));
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

  // ------- Add Customer Modal (نفس منطق AddEditCustomerComponent.AddCustomer) -------
showAddCustomerModal = false;
addingNewCustomer = false;

newCustomerName: string | null = null;
newCustomerMobile: string | null = null;
newCustomerMobileCode: string = '+964';
newCountryId: number | null = null;
newSelectedCountry: string | null = null;
newCities: CityModel[] = [];
newAreas: AreaModel[] = [];
newStates: StateModel[] = [];
newCityId: number | null = null;
newAreaId: number | null = null;
newStateId: number | null = null;
newLine1: string | null = null;
newLine2: string | null = null;
newUsCity: string | null = null;
newPostCode: string | null = null;
newLandMark: string | null = null;
countries: Country[] = []
openAddCustomerModal(): void {
  this.http.getAllData("Country").subscribe((response: any) => {
      console.log("Countries", response)
      this.countries = response;
    });
  // نعبّي رقم الهاتف بالرقم اللي كان اليوزر بحث بيه (لو موجود)
  this.newCustomerMobile = this.phoneQuery ?? null;
  this.newCustomerName = null;
  this.newCountryId = null;
  this.newSelectedCountry = null;
  this.showAddCustomerModal = true;
}

newCountryChanged(countryId: number): void {
  this.newLine1 = '';
  this.newLine2 = '';
  this.newStateId = null;
  this.newCityId = null;
  this.newAreaId = null;
  this.newUsCity = '';
  this.newPostCode = '';
  this.newLandMark = '';

  const countryIdValue = Number(countryId);
  this.newSelectedCountry = this.countries.find(c => c.countryId == countryIdValue)?.name ?? null;

  if (this.newSelectedCountry == 'USA') {
    this.http.getAllData(`State/GetAllStatesByCountry/${countryIdValue}`).subscribe((response: any) => {
      this.newStates = response;
      this.cdr.detectChanges();
    });
  }

  this.http.getAllData(`City/GetAllCitiesByCountry/${countryIdValue}`).subscribe((response: any) => {
    this.newCities = response;
    this.cdr.detectChanges();
  });
}

newCityChanged(): void {
  if (this.newCityId == null) return;
  this.http.getAllData(`Area/GetAlAreasByCity/${this.newCityId}`).subscribe((response: any) => {
    this.newAreas = response;
    this.cdr.detectChanges();
  });
}

AddNewCustomerFromModal(): void {
  if (this.addingNewCustomer) return;
  this.addingNewCustomer = true;

  const allAddressFieldsEmpty =
    !this.newLine1 && !this.newLine2 && !this.newUsCity && !this.newLandMark &&
    !this.newPostCode && !this.newCountryId && !this.newStateId &&
    !this.newCityId && !this.newAreaId;

  let addressPayload: any = null;

  if (!allAddressFieldsEmpty) {
    addressPayload = {
      line_1: this.newLine1,
      line_2: this.newLine2,
      us_City: this.newUsCity,
      landMark: this.newLandMark,
      post_code: this.newPostCode,
      countryId: Number(this.newCountryId)
    };

    if (this.newStateId != null) addressPayload.stateId = this.newStateId;
    if (this.newCityId != null) addressPayload.cityId = this.newCityId;
    if (this.newAreaId != null) addressPayload.areaId = this.newAreaId;
  }

  if (this.newCustomerMobile?.startsWith('0')) {
    this.newCustomerMobile = this.newCustomerMobile.substring(1);
  }
  if (this.newCustomerMobile?.includes('+964')) {
    this.newCustomerMobile = this.newCustomerMobile.replace('+964', '');
  }

  const correctedPhone = this.newSelectedCountry == 'Iraq'
    ? this.newCustomerMobileCode + this.newCustomerMobile
    : this.newCustomerMobile;

  const currentBusinessId = Number(localStorage.getItem('businessId'));

  const mainPayLoad = {
    customerName: this.newCustomerName,
    customerMobile: correctedPhone,
    businessesIds: [currentBusinessId],
    country_id: this.newCountryId ? Number(this.newCountryId) : null,
    address: addressPayload
  };

  this.http.posteData('Customers', mainPayLoad).subscribe(
    (response: any) => {
      this.addingNewCustomer = false;
      this.showAddCustomerModal = false;
      this.customerNotFound = false;
      this.cdr.detectChanges();
    },
    (error: any) => {
      this.addingNewCustomer = false;
      this.cdr.detectChanges();
    }
  );
}

}
