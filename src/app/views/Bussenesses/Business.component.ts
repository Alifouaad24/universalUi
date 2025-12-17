import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BadgeComponent, ButtonCloseDirective, ButtonDirective, FormModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';

import {
  CardBodyComponent, SpinnerModule,
  CardComponent,
  CardHeaderComponent,
  RowComponent,
} from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
import { BusinessModel } from '../../Models/Business/BusinessModel';

@Component({
  templateUrl: 'Business.component.html',
  imports: [CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, RouterLink,
    ButtonDirective, SpinnerModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    RouterOutlet,
    BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective, ButtonDirective]
})
export class BusinessComponent implements OnInit {

  Businesses?: BusinessModel[]
  visible: boolean = false;
  selectedIdToDelete?: number
  isDeleting = false;
  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.http.getAllData('Business').subscribe(res => {
      console.log(res)
      this.Businesses = (res as any[]).map(el => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name,
        country: el.country,
        is_active: el.is_active,
        business_whatsapp: el.business_whatsapp,
      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.cdr.detectChanges()

    })
  }

  delete() {
    if (this.isDeleting) return;

    this.isDeleting = true;
    if (this.selectedIdToDelete! == 0 && this.selectedIdToDelete == null) {
      return alert('Choose item to delete')
    }

    this.http.deleteData(`Business/${this.selectedIdToDelete}`).subscribe(res => {
      this.Businesses = this.Businesses?.filter(el => {
        return el.business_id !== this.selectedIdToDelete
      })
      this.isDeleting = false;
      this.toggleLiveDemo(0)
      this.cdr.detectChanges()
    }, (error) => {
      this.isDeleting = false;
      this.toggleLiveDemo(0)
      this.cdr.detectChanges()
      alert('Please check you connection and try again')

    })

  }



  toggleLiveDemo(id: number) {
    this.selectedIdToDelete = id
    console.log(id)
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

}
