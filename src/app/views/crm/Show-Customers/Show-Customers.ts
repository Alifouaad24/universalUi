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
  CardModule,
  GridModule,
  TableModule
} from '@coreui/angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessType } from '../../../Models/Business/BusinessType';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { Country } from '../../../Models/CountryModel';
import { ServiceModel } from '../../../Models/ServiceModel';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { FeatureModel } from '../../../Models/FeatureModel';

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
    ProgressComponent, CardModule,
    GridModule,
    IconModule,
    TableModule,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class ShowCustomersComponent implements OnInit {

  constructor(private http: HttpConnectService) { }
  customers: any;
  originalCustomers: any;

  ShippingTypes: any;
  selectedShipping: any;
  labb: string = "الزبائن"

  ngOnInit(): void {
    this.GetAllCustomers()
    this.GetAllShippingTypes()
  }

  GetAllShippingTypes() {
    this.http.getAllData(`ShippingTypes`).subscribe((res: any) => {
      console.log(res)
      this.ShippingTypes = res

    });
  }

  getWhatsAppLink(phone: string): string {
    const formatted = phone?.replace(/^0/, '964');
    return `https://wa.me/${formatted}`;
  }

  GetAllCustomers() {
    this.http.getAllData('Packages').subscribe(res => {
      console.log(res)
      this.customers = res
      this.originalCustomers = res
    })
  }

  getCustomersbyShippId(shippId: number) {
    this.customers = this.originalCustomers;
    this.customers = this.customers.filter((c: any) => c.shippingType.shippingTypeId === shippId);
    this.customers = this.customers.filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex(
          (t: any) => t.customer.custMob === value.customer.custMob
        )
    );

    const found = this.ShippingTypes.find((s: any) => s.shippingTypeId === shippId);
    this.labb = found ? `زبائن ${found.description}` : '';
  }

}
