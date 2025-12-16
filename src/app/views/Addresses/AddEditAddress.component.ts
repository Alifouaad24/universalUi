import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
@Component({
  templateUrl: 'AddEditAddress.component.html',
  imports: [
    AsyncPipe,

    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,ReactiveFormsModule,
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
export class AddEditAddressComponent {

   AddressForm: FormGroup;
   message: string = '';
   loading: boolean = false
  constructor(private fb: FormBuilder, private http: HttpConnectService, private router: Router) {
    this.AddressForm = this.fb.group({
      line_1: ['', Validators.required],
      line_2: ['', Validators.required],
      postCode: [''],
      city: [''],
      state: [''],
    });
  }

  onSubmit() {
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
  }

  resetForm() {
    this.AddressForm.reset({
      Is_active: true,
      BusinessTypeId: [],
      AddressId: []
    });
  }
 }
