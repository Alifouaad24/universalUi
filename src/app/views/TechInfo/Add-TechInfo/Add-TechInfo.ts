import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ComplaintType, ComplaimentModel } from '../../../Models/ComplaintModel';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-TechInfo.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditTechInfoComponent implements OnInit {

  description?: string;
  message: string = '';
  loading: boolean = false
  idForEdit?: number
  complaimentsTypes: ComplaintType[] = []
  complaiment?: ComplaimentModel
  value: string = '';
  typeId?: number
  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const complaimentStr = this.route.snapshot.queryParamMap.get('complaiment');
    if (complaimentStr) {
      this.complaiment = JSON.parse(complaimentStr);
      console.log('Parsed complaiment:', this.complaiment);
      this.description = this.complaiment?.complaint_Value?.description;
      this.value = this.complaiment?.complaint_Value?.value ?? '';
      this.idForEdit = this.complaiment?.complaint_Value?.complaint_ValueId;
    }
    this.getAllComplaimentTypes()
  }

  getAllComplaimentTypes() {
    this.http.getAllData('Complaint/GetAllComplaintsTypes').subscribe((res) => {
      this.complaimentsTypes = (res as any[]).map(el => new ComplaintType({
        complaintTypeId: el.complaintTypeId,
        name: el.name
      }))
      if (this.complaiment) {
        this.typeId = this.complaiment?.complaint_Value?.complaintTypeId;
      }
      this.cdr.detectChanges()
    })
  }

  addComplaiment() {
    this.loading = true
    var payload = {
      complaintTypeId: Number(this.typeId),
      value: this.value,
      description: this.description
    }

    console.log(payload)
    if (this.complaiment == null) {
      if (!this.description || !this.value) {
        this.message = 'Please fill all data';
        this.loading = false
        return;
      }

      this.http.posteData(`Complaint`, payload).subscribe(res => {
        this.router.navigate(['Home/tech-info'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.description || !this.value) {
        this.message = 'Please fill all data';
        this.loading = false
        return;
      }

      this.http.putData(`Complaint/${this.idForEdit}`, payload).subscribe(res => {
        this.router.navigate(['Home/tech-info'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }
  }
}
