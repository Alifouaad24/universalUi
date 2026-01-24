import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
import { AddressModel } from '../../Models/AddressModel';
@Component({
  templateUrl: 'AddEditAddress.component.html',
  imports: [
    AsyncPipe,

    CardComponent,
    CardBodyComponent,
    CardHeaderComponent, ReactiveFormsModule,
    RowComponent,
    ColComponent,
    ButtonDirective,
    BadgeComponent,
    TableDirective,
    FormControlDirective,
    IconComponent,
    RouterLink,
    RouterOutlet
  ]
})
export class AddEditAddressComponent implements OnInit {

  AddressForm: FormGroup;
  message: string = '';
  addressToEdit?: AddressModel;
  id?: number
  loading: boolean = false
  constructor(private fb: FormBuilder, private http: HttpConnectService,
    private router: Router, private route: ActivatedRoute) {
    this.AddressForm = this.fb.group({
      line_1: ['', Validators.required],
      line_2: ['', Validators.required],
      postCode: [''],
      city: [''],
      state: [''],
    });
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param => {
      const addressFromQuery = param.get('address')
      if (addressFromQuery) {
        this.addressToEdit = JSON.parse(addressFromQuery)
        this.id = this.addressToEdit?.address_id
        console.log(this.addressToEdit)
        this.AddressForm.patchValue({
          line_1: this.addressToEdit?.line_1,
          line_2: this.addressToEdit?.line_2,
          postCode: this.addressToEdit?.post_code,
          city: this.addressToEdit?.city,
          state: this.addressToEdit?.state,
        })
      }
    })
  }

  onSubmit() {
    if (this.addressToEdit == null) {
      if (this.AddressForm.valid) {
        console.log('Address Data:', this.AddressForm.value);

        const payLoad = {
          "line_1": this.AddressForm.get('line_1')?.value,
          "line_2": this.AddressForm.get('line_2')?.value,
          "state": this.AddressForm.get('state')?.value,
          "post_code": this.AddressForm.get('postCode')?.value,
          "city": this.AddressForm.get('city')?.value,
        }
        this.http.posteData('Address', payLoad).subscribe(res => {
          this.router.navigate(['Home/allAddresses'])
          this.loading = false
        }, (error) => {
          console.error(error)
          this.loading = false
        })
      } else {
        console.log('Form not valid');
        this.AddressForm.markAllAsTouched();
      }
    } else {
      if (this.AddressForm.valid) {
        console.log('Address Data:', this.AddressForm.value);

        const payLoad = {
          "line_1": this.AddressForm.get('line_1')?.value,
          "line_2": this.AddressForm.get('line_2')?.value,
          "state": this.AddressForm.get('state')?.value,
          "post_code": this.AddressForm.get('postCode')?.value,
          "city": this.AddressForm.get('city')?.value,
        }
        this.http.putData(`Address/${this.id}`, payLoad).subscribe(res => {
          this.router.navigate(['Home/allAddresses'])
          this.loading = false
        }, (error) => {
          console.error(error)
          this.loading = false
        })
      } else {
        console.log('Form not valid');
        this.AddressForm.markAllAsTouched();
      }
    }
  }

  resetForm() {
    this.AddressForm.reset({
      Is_active: true,
      BusinessTypeId: [],
      AddressId: []
    });
  }
}
