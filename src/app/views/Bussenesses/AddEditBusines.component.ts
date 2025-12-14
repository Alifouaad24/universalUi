import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

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
    RouterOutlet
  ]
})
export class AddEditBusniessComponent {

   businessForm: FormGroup;

  countries = [
    { id: 1, name: 'السعودية' },
    { id: 2, name: 'مصر' },
    { id: 3, name: 'الأردن' }
  ];

  businessTypes = [
    { id: 1, name: 'مطعم' },
    { id: 2, name: 'متجر' },
    { id: 3, name: 'خدمات' }
  ];

  addresses = [
    { id: 1, name: 'الرياض' },
    { id: 2, name: 'جدة' },
    { id: 3, name: 'القاهرة' }
  ];

  constructor(private fb: FormBuilder) {
    this.businessForm = this.fb.group({
      Business_name: ['', Validators.required],
      CountryId: [null, Validators.required],
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
      BusinessTypeId: [[]],
      AddressId: [[]]
    });
  }

  submit() {
    if (this.businessForm.valid) {
      console.log('Business Data:', this.businessForm.value);
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
 }
