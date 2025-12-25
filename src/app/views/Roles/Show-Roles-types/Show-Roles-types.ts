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
import { RloeModel } from '../../../Models/RloeModel';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Roles-types.html',
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
export class ShowRolesComponent implements OnInit {

  roles: RloeModel[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedType?: RloeModel;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false); 
  toastMessage = signal(''); 
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getRoles()
  }

  getRoles() {
    this.isLoading = true;
    this.http.getAllData('Account/getAllRoles').subscribe(
      (res: any) => {
        this.roles = (res as any[]).map(item => new RloeModel({
          id: item.id,
          name: item.name,
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

  confirmDelete(type: RloeModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteBusinessType(type?: RloeModel) {
    if (!type) return;
    this.http.deleteData(`Account/deleteRole/${type.id}`,).subscribe((res) => {
      console.log(res)
      this.roles = this.roles.filter(t => t.id !== type.id);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.name} deleted successfully`);
      this.toastVisible.set(true);
    },(error) =>{
      this.toastMessage.set(`An error occured during delete (${type.name})`);
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
