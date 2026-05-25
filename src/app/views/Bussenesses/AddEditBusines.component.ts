import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccordionButtonDirective, AccordionComponent, AccordionItemComponent, AccordionModule, BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseModule, FormControlDirective, RowComponent, SharedModule, SpinnerModule, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BusinessType } from '../../Models/Business/BusinessType';
import { AddressModel } from '../../Models/AddressModel';
import { Country } from '../../Models/CountryModel';
import { BusinessModel } from '../../Models/Business/BusinessModel';
import { HttpConnectService } from '../../Services/http-connect.service';
import { iconSubset } from '../../icons/icon-subset';
import { CityModel } from '../../Models/CityModel';
import { AreaModel } from '../../Models/AreaModel';
import { StateModel } from '../../Models/StateModel';
import { GridModule, ButtonModule, FormModule } from '@coreui/angular';
import { ActiviityModel } from '../../Models/ActivityModel';
import { logo } from '../../icons/logo';
import { set } from 'lodash-es';

@Component({
  templateUrl: 'AddEditBusines.component.html',
  imports: [
    AsyncPipe,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    ButtonDirective, CollapseModule,
    BadgeComponent,
    TableDirective,
    FormControlDirective,
    IconComponent,
    RouterLink, AccordionModule, AccordionComponent, AccordionItemComponent, AccordionButtonDirective,
    GridModule,
    FormModule,
    ButtonModule,
    RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, AccordionModule,
    SharedModule,
    SpinnerModule,
  ]
})
export class AddEditBusniessComponent implements OnInit {

  selectedIcon: string | null = null;
  businessToShoowAccordion = true;
  icons: string[] = Object.keys(iconSubset);
  businessForm: FormGroup;
  countries: Country[] = [];
  businessesType?: BusinessType[]
  addresses?: AddressModel[]
  business?: BusinessModel;
  showBasicInfoForm: boolean = false;
  showAddessForm: boolean = false;
  showServicesForm: boolean = false;
  showActivitiessssForm: boolean = false;
  showServingForm: boolean = false;
  address: {
    Line_1: string,
    Line_2: string,
    LandMark: string,
    PostCode: string,
    Us_City: string,
    CityId: number | null,
    StateId: number | null,
    CountryId: number | null,
    AreaId: number | null
  }[] = [];

  addressToShow: {
    countryName: string;
    Line_1: string,
    Line_2: string,
    LandMark: string,
    Statename: string | null,
    PostCode: string,
    Us_City: string,
    CityNonUS: string | null,
    StateId: number | null,
    CountryId: number | null,
    AreaNonUS: string | null
  }[] = [];

  servicesList: String[] = [];
  showCustomersForm: boolean = false;


  selectedCountry: string = '';
  UsCity: string = '';
  citiesByCountry: CityModel[] = [];
  statesByCountry: StateModel[] = [];
  areasByCity: AreaModel[] = [];
  hasStates = false;

  Line_1: string = ''
  Line_2: string = ''
  State: number | null = null
  PostCode: string = ''
  selectedCityId: number | null = null;
  selectedStateId: number | null = null;
  selectedAreaId: number | null = null;
  landMark: string = '';
  Activites?: ActiviityModel[]
  businessCustomers: any[] = [];

  services: {
    description: string;
    isPublic: boolean;
    service_icon?: string;
  }[] = [];

  actiivities: {
    description: string;
  }[] = [];

  servicesBusiness: any[] = [];

  Description?: String;
  businessLogoFile!: File | null;
  logoPreview: string | null = null;
  serviceDescription: string = '';
  serviceVisibility: 'public' | 'local' | null = null;
  selectedCityNonUS: string | null = null;
  selectedAreaNonUS: string | null = null;
  selectedStateName: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpConnectService,
    private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) {
    this.businessForm = this.fb.group({
      Business_name: ['', Validators.required],
      CountryId: [0],
      Is_active: [true],
      Business_phone: [''],
      Business_webSite: [''],
      Business_fb: [''],
      Business_instgram: [''],
      Business_tiktok: [''],
      Business_google: [''],
      Business_youtube: [''],
      Business_whatsapp: [''],
      Business_email: ['', Validators.email],
      BusinessTypeId: this.fb.array([]),
      AddressId: this.fb.array([]),
      businessLogo: [this.businessLogoFile]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param => {
      const busFromQuery = param.get('bus')
      console.log(busFromQuery)
      if (busFromQuery) {
        this.getAllBusinesses()
        this.getAllCountries()
        this.getAllAddresses()
        this.getAllBusinessesTypes()
        setTimeout(() => {
          this.business = JSON.parse(busFromQuery);
          this.businessForm.patchValue({
            Business_name: this.business!.business_name,
            CountryId: this.business!.countryId,
            Is_active: this.business!.is_active,
            Business_phone: this.business!.business_phone,
            Business_webSite: this.business!.business_webSite,
            Business_fb: this.business!.business_fb,
            Business_instgram: this.business!.business_instgram,
            Business_tiktok: this.business!.business_tiktok,
            Business_google: this.business!.business_google,
            Business_youtube: this.business!.business_youtube,
            Business_whatsapp: this.business!.business_whatsapp,
            Business_email: this.business!.business_email
          });

          this.logoPreview = this.business!.business_LogoUrl || ''
          this.servicesBusiness = this.business!.business_Services || [];
          this.Activites = this.business!.activities;
          this.businessCustomers = this.business!.buseness_Customers || [];
          this.business?.businessTypes?.forEach(el => {
            this.BusinessTypesArray.push(
              this.fb.control(el.business_type_id)
            );
          });

        }, 50);
      } else {
        this.getAllAddresses()
        this.getAllBusinessesTypes()
        this.getAllCountries()
      }
    })

  }

  SelectedBusinesses: number[] = [];
  Businesses: BusinessModel[] = [];
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
        activities: el.activities,
        businessTypes: el.businessTypes,
        businessAddresses: el.businessAddresses,
        business_LogoUrl: el.business_LogoUrl,
        buseness_Customers: el.buseness_Customers,
        insert_by: el.insert_by,
        insert_on: el.insert_on

      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()

    })
  }



  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }


  addNewAddress() {
    this.address.push({
      Line_1: this.Line_1,
      Line_2: this.Line_2,
      LandMark: this.landMark,
      Us_City: this.UsCity,
      PostCode: this.PostCode,
      CityId: this.selectedCityId,
      StateId: this.selectedStateId,
      CountryId: Number.parseInt(this.businessForm.get('CountryId')?.value ?? null),
      AreaId: this.selectedAreaId
    });

    const newAddress = {
      countryName: this.selectedCountry,
      Line_1: this.Line_1,
      Line_2: this.Line_2,
      LandMark: this.landMark,
      Statename: this.selectedStateName,
      Us_City: this.UsCity,
      PostCode: this.PostCode,
      CityNonUS: this.selectedCityNonUS,
      StateId: this.selectedStateId,
      CountryId: this.businessForm.get('CountryId')?.value ?? null,
      AreaNonUS: this.selectedAreaNonUS
    };

    this.addressToShow = [...this.addressToShow, newAddress];
  }


  getAllCountries() {
    this.http.getAllData('Country').subscribe(res => {
      this.countries = (res as any[]).map((el: any) => new Country({
        countryId: el.countryId,
        name: el.name
      }))
      if (this.business) {

        const Country = this.countries?.find(c => c.countryId === this.business!.countryId)
        this.businessForm.patchValue({
          CountryId: this.business!.countryId
        });
        this.GetAllStatesByCountry(this.business!.countryId);
        this.selectedCountry = Country!.name ? Country!.name : ''
      }
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  getAllBusinessesTypes() {
    this.http.getAllData('BusinessType').subscribe(res => {
      this.businessesType = (res as any[]).map((el: any) => new BusinessType({
        business_type_id: el.business_type_id,
        description: el.description
      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  getAllAddresses() {
    this.http.getAllData('Address').subscribe(res => {
      this.addresses = (res as any[]).map((el: any) => new AddressModel({
        address_id: el.address_id,
        line_1: el.line_1,
        line_2: el.line_2,
        state: el.state,
        post_code: el.post_code,
        city: el.city
      }))
      setTimeout(() => {
        this.cdr.detectChanges()
      }, 1000);
      if (this.business) {
        this.business?.businessAddresses?.forEach(el => {
          this.AddressesArray.push(
            this.fb.control(el!.address_id)
          );
        });
      }
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  submit() {
    if (!this.businessForm.valid) {
      this.businessForm.markAllAsTouched();
      return;
    }

    if (
      !this.businessForm.get('Business_email')?.value &&
      !this.businessForm.get('Business_phone')?.value
    ) {
      alert('Email or phone is required');
      return;
    }

    const form = new FormData();

    const simpleFields = [
      'Business_name', 'CountryId', 'Is_active',
      'Business_phone', 'Business_webSite', 'Business_fb',
      'Business_instgram', 'Business_tiktok', 'Business_google',
      'Business_youtube', 'Business_whatsapp', 'Business_email'
    ];

    simpleFields.forEach(key => {
      const value = this.businessForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          form.append(key, value ? 'true' : 'false');
        } else {
          form.append(key, value.toString());
        }
      }
    });

    if (this.businessLogoFile) {
      form.append('BusinessLogo', this.businessLogoFile);
    }

    if (this.business) {
      // PUT
      form.append('BusinessTypeId', JSON.stringify(this.businessForm.get('BusinessTypeId')?.value ?? []));
      form.append('AddressId', JSON.stringify(this.businessForm.get('AddressId')?.value ?? []));
    }

    form.append('address', JSON.stringify(this.address ?? []));
    form.append('Services', JSON.stringify(this.services ?? []));

    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    const request = this.business
      ? this.http.putData(`Business/${this.business.business_id}`, form, true)
      : this.http.posteData('Business', form, true);

    request.subscribe({
      next: _ => this.router.navigate(['Home/business']),
      error: err => console.error(err)
    });
  }

  resetForm() {
    this.businessForm.reset({
      Is_active: true,
      BusinessTypeId: [],
      AddressId: []
    });
  }

  get BusinessTypesArray(): FormArray {
    return this.businessForm.get('BusinessTypeId') as FormArray;
  }

  get AddressesArray(): FormArray {
    return this.businessForm.get('AddressId') as FormArray;
  }

  onBusinessTypeChange(event: any, id: number) {
    const array = this.BusinessTypesArray;
    const index = array.controls.findIndex(x => x.value === id);

    if (event.target.checked) {
      if (index === -1) {
        array.push(this.fb.control(id));
      }
    } else {
      if (index !== -1) {
        array.removeAt(index);
      }
    }
  }

  onAddressChange(event: any, id: number) {
    const array = this.AddressesArray;
    const index = array.controls.findIndex(x => x.value === id);

    if (event.target.checked) {
      if (index === -1) {
        array.push(this.fb.control(id));
      }
    } else {
      if (index !== -1) {
        array.removeAt(index);
      }
    }
  }

  addService() {
    this.services.push({
      description: this.serviceDescription,
      isPublic: this.serviceVisibility == 'public' ? true : false!,
      service_icon: this.selectedIcon ?? ''
    });

    this.serviceDescription = '';
    this.serviceVisibility = null;
  }
  activityDescription: string = '';
  addActivity() {
    this.actiivities.push({
      description: this.activityDescription,
    });

    this.activityDescription = '';
  }

  removeActivity(index: number) {
    this.actiivities.splice(index, 1);
  }

  removeService(index: number) {
    this.services.splice(index, 1);
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.businessLogoFile = null;
      this.logoPreview = null;
      return;
    }

    this.businessLogoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }



  onCountryChange() {
    const countryId = this.businessForm.get('CountryId')?.value as number;
    this.Line_1 = '';
    this.Line_2 = '';
    this.PostCode = '';
    this.landMark = '';
    this.UsCity = '';
    this.selectedCityId = null;
    this.selectedStateId = null;
    this.selectedAreaId = null;
    this.GetAllStatesByCountry(countryId);
    this.GetAllCitiesByCountry(countryId);
    const country = this.countries!.find(c => c.countryId == countryId)
    this.selectedCountry = country!.name;
  }

  GetAllCitiesByCountry(countryId: number) {
    this.http.getAllData(`City/GetAllCitiesByCountry/${countryId}`).subscribe(res => {

      this.citiesByCountry = (res as any[]).map((el: any) => new CityModel({
        cityId: el.cityId,
        description: el.description,
        countryId: el.countryId
      }))
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  GetAllStatesByCountry(countryId: number) {
    this.http.getAllData(`State/GetAllStatesByCountry/${countryId}`).subscribe(res => {
      this.statesByCountry = (res as any[]).map((el: any) => new StateModel({
        stateId: el.stateId,
        name: el.name,
        countryId: el.countryId
      }))
      this.hasStates = this.statesByCountry.length > 0;
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  GetAllAreasByCity(cityId: number) {
    this.http.getAllData(`Area/GetAlAreasByCity/${cityId}`).subscribe(res => {
      this.areasByCity = (res as any[]).map((el: any) => new AreaModel({
        areaId: el.areaId,
        description: el.description,
        cityId: el.cityId,
        zone: el.zone,
        sector: el.sector,
        spec: el.spec
      }))
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  onStateChange(event: any) {
    this.selectedStateName = this.statesByCountry.find(s => s.stateId == this.selectedStateId)?.name || null;
  }

  onCityChange() {
    this.selectedCityNonUS = this.citiesByCountry.find(c => c.cityId == this.selectedCityId)?.description || null;
    this.GetAllAreasByCity(this.selectedCityId!);
  }

  onAreaChange() {
    this.selectedAreaNonUS = this.areasByCity.find(a => a.areaId == this.selectedAreaId)?.description || null;
  }

  removeAddress(i: number) {
    if (i > -1 && i < this.addressToShow.length) {
      this.addressToShow.splice(i, 1);
      this.address.splice(i, 1);
    }
  }

  BindActivitiesWithBusiness() {
    var currentBusinessId = this.business!.business_id
    const activitiesToBind = this.actiivities.map(a => a.description);
  }
  addingLoad = false;
  areas: AreaModel[] = [];
  cities: CityModel[] = [];
  isVisible: boolean = false;
  Line2?: String | null
  PostCodeForUserAddress?: String | null
  Line1?: String | null
  LandMark?: String | null
  customerMobile?: String | null
  customerName?: String | null
  cityId: number | null = null;
  areaId: number | null = null;
  stateId: number | null = null;
  countryId: number | null = null;
  selectedCountryForUser?: String
  states: StateModel[] = []
  CustomerId?: number;
  showModal = false;

  AddCustomerToThisBusiness(): void {
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
      businessId: this.business?.business_id,
      country_id: Number(this.countryId),
      address: addressPayload
    };

    console.log(mainPayLoad);

    // this.http.posteData('Business/AddCustomesToBusiness', mainPayLoad).subscribe(response => {
    //   this.addingLoad = false
    //   this.cdr.detectChanges()
    // }, (error) => {
    //   this.addingLoad = false
    //   this.cdr.detectChanges()
    // })
  }

  countryChangedForCustomer(event: Event): void {
    this.Line1 = ''
    this.Line2 = ''
    this.stateId = null
    this.cityId = null
    this.areaId = null
    this.UsCity = ''
    this.PostCode = ''
    this.LandMark = ''

    var countryIdValue = Number((event.target as HTMLSelectElement).value);
    this.selectedCountryForUser = this.countries.find(el => el.countryId == countryIdValue)?.name;
    if (this.selectedCountryForUser == 'USA') {
      this.http.getAllData(`State/GetAllStatesByCountry/${countryIdValue}`).subscribe((response: any) => {
        console.log(response)
        this.states = response;
      });

    }
    this.cdr.detectChanges()
    this.http.getAllData(`City/GetAllCitiesByCountry/${countryIdValue}`).subscribe((response: any) => {
      console.log(response)
      this.cities = response;
      this.cdr.detectChanges()
    });
    this.cdr.detectChanges()
  }

  cityChanged(cityId: number): void {
    console.log(cityId);
    if (cityId == null) return;

    console.log(cityId);

    this.http
      .getAllData(`Area/GetAlAreasByCity/${cityId}`)
      .subscribe((response: any) => {

        this.areas = response;
        this.cdr.detectChanges();

      });
  }


  removeActivityFromBusiness(activityId: number): void {
    this.http.deleteData(`Business/RemoveActivityFromBusiness/${activityId}`).subscribe({
      next: _ => {
        this.Activites = this.Activites?.filter(a => a.activity_id !== activityId);
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  removeServiceFromBusiness(serviceId: number): void {
    this.http.deleteData(`Business/RemoveServiceFromBusiness/${serviceId}`).subscribe({
      next: _ => {
        this.servicesBusiness = this.servicesBusiness?.filter(s => s.service?.service_id !== serviceId);
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  ServingDescription: string = '';
  addServing() {
    const payload = {
      
      description: this.ServingDescription,
      businessId: this.business?.business_id
    };
   }



}
