import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BusinessType } from '../../Models/Business/BusinessType';
import { AddressModel } from '../../Models/AddressModel';
import { Country } from '../../Models/CountryModel';
import { BusinessModel } from '../../Models/Business/BusinessModel';
import { HttpConnectService } from '../../Services/http-connect.service';
@Component({
  templateUrl: 'AddEditBusines.component.html',
  imports: [
    AsyncPipe,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    BadgeComponent,
    TableDirective,
    FormControlDirective,
    IconComponent,
    RouterLink,
    RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class AddEditBusniessComponent implements OnInit {

  businessForm: FormGroup;
  countries?: Country[]
  businessesType?: BusinessType[]
  addresses?: AddressModel[]
  business?: BusinessModel;
  address = {
    line_1: '',
    line_2: '',
    state: '',
    city: '',
    postCode: ''
  };

  services: {
    description: string;
    isPublic: boolean;
  }[] = [];

  Description?: String;

  serviceDescription: string = '';
  serviceVisibility: 'public' | 'local' | null = null;

  constructor(private fb: FormBuilder, private http: HttpConnectService,
    private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) {
    this.businessForm = this.fb.group({
      Business_name: ['', Validators.required],
      CountryId: [0, Validators.required],
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
      Addresses: this.fb.array([])
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
    const payLoad = {
      "business_name": this.businessForm.get('Business_name')?.value,
      "countryId": Number.parseInt(this.businessForm.get('CountryId')?.value),
      "is_active": this.businessForm.get('Is_active')?.value,
      "business_phone": this.businessForm.get('Business_phone')?.value,
      "business_webSite": this.businessForm.get('Business_webSite')?.value,
      "business_fb": this.businessForm.get('Business_fb')?.value,
      "business_instgram": this.businessForm.get('Business_instgram')?.value,
      "business_tiktok": this.businessForm.get('Business_tiktok')?.value,
      "business_google": this.businessForm.get('Business_google')?.value,
      "business_youtube": this.businessForm.get('Business_youtube')?.value,
      "business_whatsapp": this.businessForm.get('Business_whatsapp')?.value,
      "business_email": this.businessForm.get('Business_email')?.value,
      "businessTypeId": this.businessForm.get('BusinessTypes')?.value,
      "addressId": this.businessForm.get('Addresses')?.value,
      "address": this.address,
      "services": this.services
    }

    console.log(payLoad)
    // if (this.businessForm.valid) {
    //   console.log('Business Data:', payLoad);
    //   this.http.posteData('Business', payLoad).subscribe(res => {
    //     this.router.navigate(['Home/business'])
    //   })
    // } else {
    //   console.log('Form not valid');
    //   this.businessForm.markAllAsTouched();
    // }
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
      isPublic: this.serviceVisibility == 'public' ? true : false!
    });

    this.serviceDescription = '';
    this.serviceVisibility = null;
    console.log(this.services)
  }

  removeService(index: number) {
    this.services.splice(index, 1);
  }



}
