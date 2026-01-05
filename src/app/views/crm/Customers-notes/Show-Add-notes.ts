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
  ButtonModule,
  CardModule,
  TableModule,
  AlertModule,
  SpinnerModule,
  ToastModule,
  ProgressModule,
  GridModule
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
  templateUrl: './Show-Add-notes.html',
  imports: [RowComponent, ColComponent, CardComponent, IconModule, ModalModule,
    CardHeaderComponent, CardBodyComponent, ButtonGroupComponent,
    ButtonDirective, RouterLink, ReactiveFormsModule,
    FormCheckLabelDirective, ButtonToolbarComponent,
    InputGroupComponent, InputGroupTextDirective, RouterLink, RouterOutlet,
    FormControlDirective, DropdownComponent, FormsModule, CommonModule,
    DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective,
    ButtonDirective,
    ProgressComponent, ButtonModule,
    CardModule,
    TableModule,
    AlertModule,
    SpinnerModule,
    ToastModule,
    ProgressModule,
    GridModule,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class CustomersNotesComponent implements OnInit {

  allNotes: any[] = []
  isLoading = false
  message: string | null = null;

  constructor(private http: HttpConnectService) { }

  ngOnInit(): void {
    this.GetAllNotes()
  }

  GetAllNotes() {
    this.http.getAllData('RequestNotes').subscribe((res: any) => {
      this.allNotes = res
    })
  }

  SetNoteAsRead(id: number) {
    this.http.putData(`RequestNotes/${id}`, {}).subscribe(res => {
      this.allNotes = this.allNotes.filter(el => {
        return el.id != id
      })
      //this.toastr.success('تم التحويل الى تمت المشاهدة بنجاح')
    }, (error) => {
      //this.toastr.error('خطا في تعديل الحالة, يرجى المحاولة مجددا')
    })
  }

  showNote(desc: string) {
    alert(desc);
  }
}
