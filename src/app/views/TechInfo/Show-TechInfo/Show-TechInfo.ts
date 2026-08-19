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
import { ComplaimentModel, ComplaintType,  Complaint_Value } from '../../../Models/ComplaintModel';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-TechInfo.html',
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
export class ShowTechInfoComponent implements OnInit {

  Complaiments: ComplaimentModel[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedType?: ComplaimentModel;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false); 
  toastMessage = signal(''); 
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getComplaints()
  }

  getComplaints() {
    this.isLoading = true;
    this.http.getAllData('Complaint').subscribe(
      (res: any) => {
        this.Complaiments = (res as any[]).map(item => new ComplaimentModel({
          complaintId: item.complaintId,
          complaint_Value: item.complaint_Value,
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

  confirmDelete(type: ComplaimentModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteBusinessType(type?: ComplaimentModel) {
    if (!type) return;
    this.http.deleteData(`Complaint/${type.complaintId}`,).subscribe((res) => {
      console.log(res)
      this.Complaiments = this.Complaiments.filter(t => t.complaintId !== type.complaintId);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.complaint_Value?.value} deleted successfully`);
      this.toastVisible.set(true);
    },(error) =>{
      this.toastMessage.set(`An error occured during delete (${type.complaint_Value?.value})`);
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
