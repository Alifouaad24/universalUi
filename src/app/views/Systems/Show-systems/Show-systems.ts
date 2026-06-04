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
import { ActiviityModel } from '../../../Models/ActivityModel';
import { SystemModel } from '../../../Models/SystemModel';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Systems.html',
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
export class ShowSystemsComponent implements OnInit {

  systems: SystemModel[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedType?: SystemModel;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false); 
  toastMessage = signal(''); 
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllSystems()
  }

  getAllSystems() {
    this.isLoading = true;
    this.http.getAllData('GlobalSystem').subscribe(
      (res: any) => {
        this.systems = (res as any[]).map(item => new SystemModel({
          globalSystemId: item.globalSystemId,
          globalSystemName: item.globalSystemName,
          globalSystemType: item.globalSystemType,
          globalSystemUrl: item.globalSystemUrl,
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

  confirmDelete(type: SystemModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteSystem(type?: SystemModel) {
    if (!type) return;
    this.http.deleteData(`GlobalSystem/${type.globalSystemId}`,).subscribe(() => {
      this.systems = this.systems.filter(t => t.globalSystemId !== type.globalSystemId);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.globalSystemName} deleted successfully`);
      this.toastVisible.set(true);
    },(error) =>{
      this.toastMessage.set(`An error occured during delete (${type.globalSystemName})`);
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
