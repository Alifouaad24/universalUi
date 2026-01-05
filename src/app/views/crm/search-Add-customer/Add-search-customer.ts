import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, ButtonModule, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormModule, GridModule, ModalBodyComponent, ModalComponent, ModalContentComponent, ModalFooterComponent, ModalHeaderComponent, RowComponent, SpinnerComponent, SpinnerModule, ToastBodyComponent, ToastComponent, ToasterService, ToastHeaderComponent, ToastModule } from '@coreui/angular';
import { IconComponent, IconDirective, IconModule } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { CityModel } from '../../../Models/CityModel';
import { AreaModel } from '../../../Models/AreaModel';
import { Country } from '../../../Models/CountryModel';
import { StateModel } from '../../../Models/StateModel'
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-search-customer.html',
  imports: [RowComponent, ColComponent, IconComponent, ModalComponent, ModalBodyComponent, ModalContentComponent, ModalHeaderComponent
    , ModalFooterComponent, ModalHeaderComponent,
    CardComponent, CardHeaderComponent, ReactiveFormsModule, FormsModule,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink, FormModule,
    ButtonModule,
    GridModule, ToastComponent, ToastBodyComponent, ToastHeaderComponent, ToastModule, SpinnerModule, SpinnerComponent
  ]
})
export class SearchAddCustomerComponent implements OnInit {
  addingLoad = false;
  areas: AreaModel[] = [];
  cities: CityModel[] = [];
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

  constructor(private api: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.api.getAllData("Country").subscribe((response: any) => {
      console.log("Countries", response)
      this.countries = response;
    });
  }

  showToast = false;
  toastMessage = '';

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

  AddCustomer(): void {
    this.addingLoad = true
    const addressPayload: any = {
      line_1: this.Line1,
      line_2: this.Line2,
      us_City: this.UsCity,
      landMark: this.LandMark,
      post_code: this.PostCode,
      countryId: Number(this.countryId)
    };

    if (this.stateId !== undefined) {
      addressPayload.stateId = this.stateId;
    }

    if (this.cityId !== undefined) {
      addressPayload.cityId = this.cityId;
    }

    if (this.areaId !== undefined) {
      addressPayload.areaId = this.areaId;
    }

    const mainPayLoad = {
      customerName: this.customerName,
      customerMobile: this.customerMobile,
      country_id: Number(this.countryId),
      address: addressPayload
    };

    console.log(mainPayLoad);

    this.api.posteData('Customers', mainPayLoad).subscribe(response => {
      this.isVisible = !this.isVisible;
      this.showMyToast('Customer added successfuly')
      this.addingLoad = false
      this.cdr.detectChanges()
    }, (error) => {
      this.addingLoad = false
      this.cdr.detectChanges()
    })
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




  openModal() {
    this.showModal = true;
  }

}
