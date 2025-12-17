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
import { BusinessType } from '../../../Models/Business/BusinessType';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { Country } from '../../../Models/CountryModel';
import { ServiceModel } from '../../../Models/ServiceModel';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Services.html',
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
export class ShowServicesComponent implements OnInit {

  services: ServiceModel[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedType?: ServiceModel;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false); 
  toastMessage = signal(''); 
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllCountries()
  }

  getAllCountries() {
    this.isLoading = true;
    this.http.getAllData('Service').subscribe(
      (res: any) => {
        this.services = (res as any[]).map(item => new ServiceModel({
          service_id: item.service_id,
          description: item.description,
          activiity: item.activiity,
          insert_on: item.insert_on
        }));
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.message = 'Error loading data';
        this.cdr.detectChanges();
      }
    );
  }

  confirmDelete(type: ServiceModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteBusinessType(type?: ServiceModel) {
    if (!type) return;
    this.http.deleteData(`Service/${type.service_id}`,).subscribe(() => {
      this.services = this.services.filter(t => t.service_id !== type.service_id);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.description} deleted successfully`);
      this.toastVisible.set(true);
    },(error) =>{
      this.toastMessage.set(`An error occured during delete (${type.description})`);
      this.toastVisible.set(true);
    });
  }
  onVisibleChange(visible: boolean) {
    this.showDeleteModal = false;
    this.toastVisible.set(visible);
    if (!visible) this.percentage.set(0);
  }

  onTimerChange(value: number) {
    this.percentage.set(value * 25);
  }

}
