import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent, RowComponent, SpinnerComponent, SpinnerModule, ModalModule,
  ModalComponent, ModalBodyComponent, ModalHeaderComponent, ModalFooterComponent,
  ModalTitleDirective, ButtonCloseDirective, ToasterComponent, ToastComponent,
  ToastBodyComponent, ToastHeaderComponent, TableDirective, FormLabelDirective,
  FormControlDirective, FormSelectDirective
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { CityModel } from '../../../Models/CityModel';
import { AreaModel } from '../../../Models/AreaModel';
import { Country } from '../../../Models/CountryModel';
import { StateModel } from '../../../Models/StateModel'
import { BusinessModel } from '../../../Models/Business/BusinessModel';
declare const google: any;
@Component({
  selector: 'app-buttons',
  templateUrl: './Add-Customer.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent, SpinnerComponent, SpinnerModule,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconModule, RouterLink,

    ModalModule, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ModalTitleDirective, ButtonCloseDirective,
    ToasterComponent, ToastComponent, ToastBodyComponent, ToastHeaderComponent,
    TableDirective, FormLabelDirective, FormControlDirective, FormSelectDirective,
  ]
})

export class AddEditCustomerComponent implements OnInit, AfterViewInit {
  addingLoad = false;
  areas: AreaModel[] = [];
  cities: CityModel[] = [];
  Businesses: any[] = [];
  selectedBusinessId: number[] = [];
  loadingBusiness: boolean = true;
  res: any[] = [];
  res1: any
  Merchants: any[] = [];
  searchTerm: string = '';
  filteredSuggestions: string[] = [];
  filteredSuggestion: string = '';
  suggestions: string[] = [];
  isVisible: boolean = false;
  isNumValid = true;
  isNumValid2 = true;
  selectedCityForEdit?: number;
  selectedAreaForEdit?: number;
  EditLandMark?: string;
  custId?: number;
  CustName12?: string;
  CustNun12?: string;
  updated: boolean = false
  selectedOption: string = '';
  isOrder: boolean = false
  isServices: boolean = false
  isShipping: boolean = false
  isBlocked: boolean = false
  NoteToAdd?: string;
  customerNotes: any[] = []
  countries: Country[] = []

  fromOldDbName?: string
  fromOldDbMobile?: string
  fromOldDbCity?: string
  fromOldDbArea?: string
  fromOldDbLandMark?: string

  UsCity?: String | null
  Line2?: String | null
  PostCode?: String | null
  Line1?: String | null
  LandMark?: String | null
  customerMobile?: String | null
  customerName?: String | null
  cityId: number | null = null;
  areaId: number | null = null;
  stateId: number | null = null;
  countryId: number | null = null;
  selectedCountry?: String
  states: StateModel[] = []
  CustomerId?: number;
  showModal = false;
  BusinessId?: number;
  /////
  businesses?: BusinessModel[]

  UsCityForBind?: String | null
  Line2ForBind?: String | null
  PostCodeForBind?: String | null
  Line1ForBind?: String | null
  LandMarkForBind?: String | null
  customerMobileForBind?: String | null
  customerNameForBind?: String | null
  cityIdForBind: number | null = null;
  areaIdForBind: number | null = null;
  stateIdForBind: number | null = null;
  countryIdForBind: number | null = null;
  selectedCountryForBind?: String
  addingLoadForBind: boolean = false
  userRole?: string
  ///
  @ViewChild('addressInput') addressInput?: ElementRef;
  constructor(private api: HttpConnectService, private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) { }

  SelectedBusinesses() {
    console.log(this.selectedBusinessIds);
  }
  loading = false
  getAllBusinesses() {
    this.api.getAllData('Business').subscribe(res => {
      this.businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.loading = false
    })
    this.cdr.detectChanges()
  }


  ngAfterViewChecked(): void {
    if (this.selectedCountry === 'USA' && this.addressInput?.nativeElement && !this.autocompleteInitialized) {
      this.initAutocomplete();
      this.autocompleteInitialized = true;
    }
  }


  autocompleteInitialized = false;
  ngOnChanges() {
    if (this.selectedCountry === 'USA') {
      setTimeout(() => {
        this.initAutocomplete();
      });
    }
  }

  initAutocomplete() {

    if (!(window as any).google?.maps?.places) {
      console.error('Google Places API not loaded');
      return;
    }

    if (!this.addressInput?.nativeElement) return;

    const autocomplete = new google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      {
        componentRestrictions: { country: 'us' }
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.fillAddress(place);
    });
  }


  fillAddress(place: any) {

    if (!place.address_components) return;

    let streetNumber = '';
    let route = '';

    place.address_components.forEach((c: any) => {

      if (c.types.includes('street_number')) {
        streetNumber = c.long_name;
      }

      if (c.types.includes('route')) {
        route = c.long_name;
      }

      if (c.types.includes('locality')) {
        this.UsCity = c.long_name;
      }

      if (c.types.includes('administrative_area_level_1')) {

        const state = this.states.find(
          s => s.name === c.short_name
            || s.name === c.long_name
        );

        this.stateId = state?.stateId ?? null;
      }

      if (c.types.includes('postal_code')) {
        this.PostCode = c.long_name;
      }

    });

    this.Line1 = `${streetNumber} ${route}`;
    this.Line2 = '';
    this.cdr.detectChanges();
  }


  ngAfterViewInit(): void {
  }


  selectedBusinessIds: number[] = [];
  customerAddresses: any[] = []
  isUpdate: boolean = false
  customerId: number = 0
  ngOnInit(): void {
    this.userRole = localStorage.getItem("UserRole") ?? ''
    this.getAllBusinesses()
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        var currentCustomer = JSON.parse(params['user'])
        if (currentCustomer) {
          console.log(currentCustomer)
          this.customerId = currentCustomer.GlobalCustomerId
          this.customerName = currentCustomer.CustomerName
          this.customerMobile = currentCustomer.CustomerMobile
          this.customerAddresses = currentCustomer.Address as []
          this.isUpdate = true
        }
      }
    })

    this.BusinessId = Number(localStorage.getItem('businessId'));
    this.api.getAllData("Country").subscribe((response: any) => {
      console.log("Countries", response)
      this.countries = response;
    });
    this.api.getAllData('Business').subscribe((res: any) => {
      this.loadingBusiness = true;
      this.Businesses = (res as any[]).map((b: any) => ({ business_id: b.business_id, business_name: b.business_name }));
      this.loadingBusiness = false;
      // pre-select businesses from localStorage if present

      this.cdr.detectChanges();
    }, (err) => {
      this.loadingBusiness = false;
      this.cdr.detectChanges();
    });
  }

  showToast = false;
  toastMessage = '';
  BusinessIdToBind?: number

  showMyToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastVisibleChange(visible: boolean) {
    this.showToast = visible;
  }

  countryChanged(event: Event): void {
    this.Line1 = ''
    this.Line2 = ''
    this.stateId = null
    this.cityId = null
    this.areaId = null
    this.UsCity = ''
    this.PostCode = ''
    this.LandMark = ''

    var countryIdValue = Number((event.target as HTMLSelectElement).value);
    this.selectedCountry = this.countries.find(el => el.countryId == countryIdValue)?.name;
    if (this.selectedCountry == 'USA') {
      this.api.getAllData(`State/GetAllStatesByCountry/${countryIdValue}`).subscribe((response: any) => {
        console.log(response)
        this.states = response;
      });
      this.cdr.detectChanges()
    }

    this.api.getAllData(`City/GetAllCitiesByCountry/${countryIdValue}`).subscribe((response: any) => {
      console.log(response)
      this.cities = response;
      this.cdr.detectChanges()
    });
    this.cdr.detectChanges()
  }

  countryChangedForBind(event: Event) {
    this.Line1ForBind = ''
    this.Line2ForBind = ''
    this.stateIdForBind = null
    this.cityIdForBind = null
    this.areaIdForBind = null
    this.UsCityForBind = ''
    this.PostCodeForBind = ''
    this.LandMarkForBind = ''

    var countryIdValue = Number((event.target as HTMLSelectElement).value);
    this.selectedCountryForBind = this.countries.find(el => el.countryId == countryIdValue)?.name;
    if (this.selectedCountryForBind == 'USA') {
      this.api.getAllData(`State/GetAllStatesByCountry/${countryIdValue}`).subscribe((response: any) => {
        console.log(response)
        this.states = response;
      });
      this.cdr.detectChanges()
    }

    this.api.getAllData(`City/GetAllCitiesByCountry/${countryIdValue}`).subscribe((response: any) => {
      console.log(response)
      this.cities = response;
      this.cdr.detectChanges()
    });
    this.cdr.detectChanges()
  }

  cityChanged(event: Event): void {
    if (this.cityId === undefined) return;
    this.api.getAllData(`Area/GetAlAreasByCity/${this.cityId}`).subscribe((response: any) => {
      this.areas = response;
      this.cdr.detectChanges()
    });
    this.cdr.detectChanges()
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  // AddCustomer(): void {

  //   if (this.addingLoad) return

  //   this.addingLoad = true
  //   const addressPayload: any = {
  //     line_1: this.Line1,
  //     line_2: this.Line2,
  //     us_City: this.UsCity,
  //     landMark: this.LandMark,
  //     post_code: this.PostCode,
  //     countryId: Number(this.countryId)
  //   };

  //   if (this.stateId !== undefined) {
  //     addressPayload.stateId = this.stateId;
  //   }

  //   if (this.cityId !== undefined) {
  //     addressPayload.cityId = this.cityId;
  //   }

  //   if (this.areaId !== undefined) {
  //     addressPayload.areaId = this.areaId;
  //   }

  //   const bus = this.BusinessIdToBind != null ? this.BusinessIdToBind : this.BusinessId

  //   const mainPayLoad = {
  //     customerName: this.customerName,
  //     customerMobile: this.customerMobile,
  //     businessId: bus,
  //     country_id: Number(this.countryId),
  //     address: addressPayload
  //   };

  //   console.log(mainPayLoad);

  //   this.api.posteData('Customers', mainPayLoad).subscribe(response => {
  //     this.isVisible = !this.isVisible;
  //     this.showMyToast('Customer added successfuly')
  //     this.addingLoad = false
  //     this.router.navigate(['/Home/customers'])
  //     this.cdr.detectChanges()
  //   }, (error) => {
  //     this.addingLoad = false
  //     this.cdr.detectChanges()
  //   })
  // }
  AddCustomer(): void {
    if (this.addingLoad) return;
    this.addingLoad = true;
    const allAddressFieldsEmpty =
      !this.Line1 &&
      !this.Line2 &&
      !this.UsCity &&
      !this.LandMark &&
      !this.PostCode &&
      !this.countryId &&
      !this.stateId &&
      !this.cityId &&
      !this.areaId;

    let addressPayload: any = null;

    if (!allAddressFieldsEmpty) {

      addressPayload = {
        line_1: this.Line1,
        line_2: this.Line2,
        us_City: this.UsCity,
        landMark: this.LandMark,
        post_code: this.PostCode,
        countryId: Number(this.countryId)
      };

      if (this.stateId != null) {
        addressPayload.stateId = this.stateId;
      }

      if (this.cityId != null) {
        addressPayload.cityId = this.cityId;
      }

      if (this.areaId != null) {
        addressPayload.areaId = this.areaId;
      }
    }

    const bus = this.BusinessIdToBind != null ? this.BusinessIdToBind : this.BusinessId;

    const mainPayLoad = {
      customerName: this.customerName,
      customerMobile: this.customerMobile,
      businessId: bus,
      country_id: this.countryId ?  Number(this.countryId) : null,
      address: addressPayload
    };

    console.log(mainPayLoad);

    this.api.posteData('Customers', mainPayLoad).subscribe(
      response => {
        this.isVisible = !this.isVisible;
        this.showMyToast('Customer added successfuly');
        this.addingLoad = false;
        this.router.navigate(['/Home/customers']);
        this.cdr.detectChanges();
      },
      error => {
        this.addingLoad = false;
        this.cdr.detectChanges();
      }
    );
  }

  filterSuggestions(value: string): void {
    if (value.length >= 3) {
      if (/^\d/.test(value)) {
        this.api.getAllData(`Customers/SearchAboutCustomers/${value}`).subscribe((result: any) => {
        });
      } else {
        this.api.getAllData(`Customers/SearchAboutCustomers/${value}`).subscribe((result: any) => {
          if (result.fromOldDB == false) {
            console.log(result)
            this.filteredSuggestions = result.customers.map((el: any) => el.customerName);
          } else {
            console.log(result.customers.value)
            this.filteredSuggestions = result.customers.value.map((el: any) => el.custName);
          }
          this.cdr.detectChanges()
        });
        this.cdr.detectChanges()
      }
      this.cdr.detectChanges()
    } else {
      this.filteredSuggestions = [];
    }
  }


  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.filteredSuggestions = [];
    const search = encodeURIComponent(suggestion);
    this.api.getAllData(`Customers/SearchAboutDetectedCustomer/${search}`).subscribe((result1: any) => {
      this.res1 = null
      console.log(result1)
      if (result1.fromOldDB == true) {
        this.fromOldDbMobile = result1.customer.value.custMob
        this.fromOldDbName = result1.customer.value.custName
        this.fromOldDbArea = result1.customer.value.area.description
        this.fromOldDbCity = result1.customer.value.city.description
        this.fromOldDbLandMark = result1.customer.value.custLandmark
        this.showModal = true;
      }
      else {
        this.res1 = result1.customer
      }
      this.cdr.detectChanges()

    })
    this.cdr.detectChanges()
  }

  EditCustData(customer: any): void {
    const payLoad = {
      'custArea': customer.custArea,
      'custCity': customer.custCity,
      'custLandmark': customer.custLandmark,
      'custName': customer.custName,
      'custMob': customer.custMob,
      'merchantId': customer.merchantId
    };
    console.log(payLoad, this.custId);
    this.api.putData(`Customers/${customer.id}`, payLoad).subscribe(res => { });
    this.updated = true;
    setTimeout(() => {
      this.updated = !this.updated;
    }, 3000);
    //this.toastr.success('تم التعديل بنجاح')
  }

  UnBlockCustomer() {
    var customerId = this.CustomerId
    this.api.putData(`Customers/UnBlockCustomer/${customerId}`, {}).subscribe(res => {
      console.log(res)
      //this.toastr.success("تم رفع الحظر بنجاح")
    }, (error) => {
      //this.toastr.error("يرجى المحاولة مجددا")

    })
  }

  LastOrder?: string
  CountOfOrders?: number
  CustumerName?: string
  roles: any[] = []

  GetAllOrdersForCustomer(word: string) {
    this.api.getAllData(`Customers/GetAllOrders/${word}`).subscribe((res: any) => {
      this.LastOrder = res?.lastOrder ?? 'no recent orders'
      this.CountOfOrders = res?.count ?? 0
      //this.CustumerName = res.orders[0].customer.custName
    })
  }
  AddNewAddressForCustomerBool = false


  AddNewAddressForCustomer() {
    this.AddNewAddressForCustomerBool = true
    var payLoad = {
      line_1: this.Line1ForBind,
      line_2: this.Line2ForBind,
      us_City: this.UsCityForBind,
      landMark: this.LandMarkForBind,
      post_code: this.PostCodeForBind,
      lognTute: '',
      latTute: '',
      stateId: this.stateIdForBind,
      areaId: this.areaIdForBind,
      cityId: this.cityIdForBind,
      countryId: this.countryIdForBind
    }

    console.log(payLoad)

    this.api.putData(`Customers/AddNewAddressForCustomer/${this.customerId}`, payLoad).subscribe(res => {
      this.AddNewAddressForCustomerBool = false
      this.router.navigate(['/Home/customers'])
    }, (error) => {
      this.AddNewAddressForCustomerBool = false
    })
  }

  DeleteAddress(id: number) {
    this.api.deleteData(`Customers/DeleteAddress/${id}`).subscribe(res => {
      this.customerAddresses = this.customerAddresses.filter(a => a.address_id !== id)
      this.cdr.detectChanges()
    }, (error) => {
    })
  }

  openModal() {
    this.showModal = true;
  }

}
