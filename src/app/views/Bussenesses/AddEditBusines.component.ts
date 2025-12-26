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
  selectIcon(icon: string) {
    this.selectedIcon = icon;
    console.log('Selected icon:', icon);
  }
  businessForm: FormGroup;
  countries?: Country[]
  businessesType?: BusinessType[]
  addresses?: AddressModel[]
  business?: BusinessModel;
  showBasicInfoForm: boolean = false;
  showAddessForm: boolean = false;
  showServicesForm: boolean = false;
  showActivitiessssForm: boolean = false;
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

  UsCity: string = '';

  addNewAddress() {
    this.address.push({
      Line_1: this.Line_1,
      Line_2: this.Line_2,
      LandMark: this.landMark,
      Us_City: this.UsCity,
      PostCode: this.PostCode,
      CityId: this.selectedCityId,
      StateId: this.selectedStateId,
      CountryId: this.businessForm.get('CountryId')?.value ?? null,
      AreaId: this.selectedAreaId
    });
    console.log(this.address);
  }


  citiesByCountry: CityModel[] = [];
  statesByCountry: StateModel[] = [];
  areasByCity: AreaModel[] = [];

  Line_1: string = ''
  Line_2: string = ''
  State: number | null = null
  PostCode: string = ''
  selectedCityId: number | null = null;
  selectedStateId: number | null = null;
  selectedAreaId: number | null = null;
  landMark: string = '';
  Activites?: ActiviityModel[]
  services: {
    description: string;
    isPublic: boolean;
    service_icon?: string;
  }[] = [];

  Description?: String;
  businessLogoFile!: File | null;
  logoPreview: string | null = null;
  serviceDescription: string = '';
  serviceVisibility: 'public' | 'local' | null = null;

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
      BusinessTypes: this.fb.array([]),
      Addresses: this.fb.array([]),
      businessLogo: [this.businessLogoFile]
    });
  }

  ngOnInit(): void {
    this.getAllAddresses()
    this.getAllBusinessesTypes()
    this.getAllCountries()
    this.route.queryParamMap.subscribe(param => {
      const busFromQuery = param.get('bus')
      if (busFromQuery) {
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
          Business_email: this.business!.business_email,
          BusinessTypeId: this.business!.businessTypes,
          AddressId: this.business!.businessAddresses
        });
        this.BusinessTypesArray.clear();
        this.Activites = this.business!.activities;
        console.log(this.Activites);

        this.business?.businessTypes?.forEach(el => {
          this.BusinessTypesArray.push(
            this.fb.control(el.businessType.business_type_id)
          );
        });

        console.log(this.business)
      }
    })
  }

  getAllCountries() {
    this.http.getAllData('Country').subscribe(res => {
      this.countries = (res as any[]).map((el: any) => new Country({
        countryId: el.countryId,
        name: el.name
      }))
      this.selectedCountry = this.countries?.find(c => c.countryId === this.business?.countryId)?.name ?? '';
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
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  submit() {

    if (this.businessForm.get('Business_email')?.value === '' || (this.businessForm.get('Business_phone')?.value === '')) {
      alert('Please provide at least an email or a phone number for the business.');
      return;
    }

    const form = new FormData();

    form.append('Business_name', this.businessForm.get('Business_name')?.value ?? '');
    form.append('CountryId', String(this.businessForm.get('CountryId')?.value ?? 0));
    form.append('Is_active', String(this.businessForm.get('Is_active')?.value ?? false));
    form.append('Business_phone', this.businessForm.get('Business_phone')?.value ?? '');
    form.append('Business_webSite', this.businessForm.get('Business_webSite')?.value ?? '');
    form.append('Business_fb', this.businessForm.get('Business_fb')?.value ?? '');
    form.append('Business_instgram', this.businessForm.get('Business_instgram')?.value ?? '');
    form.append('Business_tiktok', this.businessForm.get('Business_tiktok')?.value ?? '');
    form.append('Business_google', this.businessForm.get('Business_google')?.value ?? '');
    form.append('Business_youtube', this.businessForm.get('Business_youtube')?.value ?? '');
    form.append('Business_whatsapp', this.businessForm.get('Business_whatsapp')?.value ?? '');
    form.append('Business_email', this.businessForm.get('Business_email')?.value ?? '');

    if (this.businessLogoFile) {
      form.append('BusinessLogo', this.businessLogoFile);
    }

    (this.businessForm.get('BusinessTypes')?.value ?? []).forEach((id: number) => {
      form.append('BusinessTypeId', id.toString());
    });

    (this.businessForm.get('Addresses')?.value ?? []).forEach((id: number) => {
      form.append('AddressId', id.toString());
    });

    const addressPayload = this.address.map(addr => ({
      Line_1: addr.Line_1 ?? '',
      Line_2: addr.Line_2 ?? '',
      Post_code: addr.PostCode ?? '',
      CityId: addr.CityId ?? this.selectedCityId,
      StateId: this.selectedStateId ?? null,
      AreaId: this.selectedAreaId ?? null,
      CountryId: this.businessForm.get('CountryId')?.value ?? null,
      LandMark: this.landMark ?? ''
    }));

    form.append('address', JSON.stringify(addressPayload));

    const servicesPayload = this.services.map(s => ({
      description: s.description ?? '',
      isPublic: s.isPublic ?? true,
      service_icon: s.service_icon ?? '',

    }));
    form.append('Services', JSON.stringify(servicesPayload));


    if (this.businessForm.valid) {
      this.http.posteData('Business', form, true)
        .subscribe({
          next: res => this.router.navigate(['Home/business']),
          error: err => console.error('Error:', err)
        });
    } else {
      console.log('Form not valid');
      this.businessForm.markAllAsTouched();
    }
  }


  resetForm() {
    this.businessForm.reset({
      Is_active: true,
      BusinessTypeId: [],
      AddressId: []
    });
  }

  get BusinessTypesArray(): FormArray {
    return this.businessForm.get('BusinessTypes') as FormArray;
  }

  get AddressesArray(): FormArray {
    return this.businessForm.get('Addresses') as FormArray;
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
    console.log(this.services)
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


  selectedCountry: string = '';
  onCountryChange(event: any) {

    const selectedIndex = event.target.selectedIndex;
    this.selectedCountry = event.target.options[selectedIndex].text;
    this.Line_1 = ''
    this.Line_2 = ''
    this.selectedStateId = null
    this.PostCode = ''
    this.landMark = ''
    this.selectedCityId = null;
    this.selectedStateId = null;
    this.selectedAreaId = null;

    this.GetAllStatesByCountry(event.target.value);
    console.log(this.selectedCountry);
  }




  GetAllCitiesByCountry(countryId: number) {
    this.http.getAllData(`City/GetAllCitiesByCountry/${countryId}`).subscribe(res => {
      this.citiesByCountry = (res as any[]).map((el: any) => new CityModel({
        cityId: el.cityId,
        description: el.description,
        countryId: el.countryId
      }))
      console.log(res);
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
        name: el.description,
        countryId: el.countryId
      }))
      console.log(res);
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  GetAllAreasByCity(cityId: number) {
    this.http.getAllData(`Area/GetAllAreasByCity/${cityId}`).subscribe(res => {
      this.areasByCity = (res as any[]).map((el: any) => new AreaModel({
        areaId: el.areaId,
        description: el.description,
        cityId: el.cityId,
        zone: el.zone,
        sector: el.sector,
        spec: el.spec
      }))
      console.log(res);
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()
    })
  }

  onStateChange(event: any) {
    const selectedIndex = event.target.selectedIndex;
    this.selectedStateId = event.target.options[selectedIndex].value;
    console.log(this.selectedStateId);
    this.GetAllCitiesByCountry(this.selectedStateId!);
  }

  onCityChange(event: any) {
    const selectedIndex = event.target.selectedIndex;
    this.selectedCityId = event.target.options[selectedIndex].value;
    console.log(this.selectedCityId);
    this.GetAllAreasByCity(this.selectedCityId!);
  }

  onAreaChange(event: any) {
    const selectedIndex = event.target.selectedIndex;
    this.selectedAreaId = event.target.options[selectedIndex].value;
    console.log(this.selectedAreaId);
  }


}
