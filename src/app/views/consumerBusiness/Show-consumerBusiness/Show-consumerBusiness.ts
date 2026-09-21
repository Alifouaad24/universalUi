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
  ToastHeaderComponent
} from '@coreui/angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { SupplierModel } from '../../../Models/supplierMode';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { BusinessModel } from '../../../Models/Business/BusinessModel';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { GlobalShippingTypesModel } from '../../../Models/GlobalShippingType';

type OrdersModalView = 'list' | 'new';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Consumers.html',
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
export class ShowConsumersComponent implements OnInit {

  businessId?: number
  suppliers: any = []
  isLoading: boolean = false
  message: string = ''

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'))
    this.GetConsumers()
  }

  GetConsumers() {
    this.isLoading = true
    this.http.getAllData(`Supplier/GetConsumers/${this.businessId}`).subscribe(res => {
      this.isLoading = false
      this.suppliers = res
      this.cdr.detectChanges()
    })
  }

}
