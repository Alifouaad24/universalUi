import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BadgeComponent, ButtonCloseDirective, ButtonDirective, FormModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import {
  CardBodyComponent, SpinnerModule,
  CardComponent,
  CardHeaderComponent,
  RowComponent,
} from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
import { BusinessModel } from '../../Models/Business/BusinessModel';



export class BusinessGroupModel {
  businessGroupId: number = 0;
  groupName: string = '';
  userId: string = '';
  createdAt: any;
  businesses: any[] = [];
}

@Component({
  templateUrl: 'Business.component.html',
  imports: [CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, RouterLink,
    ButtonDirective, SpinnerModule,
    ModalComponent,
    ModalHeaderComponent, FormsModule,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    RouterOutlet,
    BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective, ButtonDirective]
})

export class BusinessComponent implements OnInit {

  Businesses?: BusinessModel[]
  allBusinesses: any[] = []
  visible: boolean = false;
  selectedIdToDelete?: number
  isDeleting = false;
  filterAppearBusinessesType: string = 'MyBusinesses'
  MyBusinesses: BusinessModel[] = []
  viewType: 'Businesses' | 'Groups' = 'Businesses';

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.MyBusinesses = JSON.parse(localStorage.getItem('businesses') || '[]')
    this.http.getAllData('Business').subscribe(res => {
      console.log(res)
      this.allBusinesses = res as any[]
      this.Businesses = (res as any[]).map(el => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name,
        country: el.country,
        countryId: el.countryId,
        is_active: el.is_active,
        business_whatsapp: el.business_whatsapp,
        business_phone: el.business_phone,
        business_webSite: el.business_webSite,
        business_fb: el.business_fb,
        business_instgram: el.business_instgram,
        business_tiktok: el.business_tiktok,
        business_google: el.business_google,
        business_youtube: el.business_youtube,
        business_email: el.business_email,
        businessTypes: el.businessTypes,
        businessAddresses: el.businessAddresses,
        business_LogoUrl: el.business_LogoUrl,
        buseness_Customers: el.buseness_Customers,
        insert_by: el.insert_by,
        business_Activitiy: el.business_Activitiy,
        insert_on: el.insert_on,
        providerBusinessRelations: el.providerBusinessRelations,
        consumerBusinessRelations: el.consumerBusinessRelations,
        usersBusinesses: el.usersBusinesses,
        business_Assets: el.business_Assets,
        platforms: el.platforms,
        business_Services: el.business_Services
      }))
      this.filterBusinesses()
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

  filterBusinesses() {
    // Implementation for filtering businesses
    if (this.filterAppearBusinessesType === 'MyBusinesses') {
      this.Businesses = this.MyBusinesses;
    } else {
      this.Businesses = this.allBusinesses;
    }
  }

  isAdmin(): boolean {
    var userRole = localStorage.getItem('UserRole');
    return userRole?.includes('Admin') ? true : false
  }


  groupModalVisible = false;

  groupName = '';

  selectedBusinessIds: number[] = [];

  isSavingGroup = false;

  openAddGroupModal() {
    this.groupName = '';
    this.selectedBusinessIds = [];
    this.groupModalVisible = true;
  }

  closeAddGroupModal() {
    this.groupModalVisible = false;
  }

  getBusinessName(id: number): string {
    return this.MyBusinesses.find(
      bus => bus.business_id === id
    )?.business_name || '';
  }

  

  saveGroup() {

    if (!this.groupName.trim()) {
      alert('Please enter Group Name');
      return;
    }

    if (this.selectedBusinessIds.length === 0) {
      alert('Please select at least one Business');
      return;
    }

    const userId = localStorage.getItem('UserId');

    if (!userId) {
      alert('User not found');
      return;
    }

    const model = {
      name: this.groupName.trim(),
      userId: userId,
      businessesIds: [...new Set(this.selectedBusinessIds)]
    };

    this.isSavingGroup = true;
    this.http.posteData('BusinessGroup/addNewGroup', model)
      .subscribe({
        next: (res) => {
          this.isSavingGroup = false;
          this.groupModalVisible = false;
          this.groupName = '';
          this.selectedBusinessIds = [];
          this.getUserGroups(userId);
          this.viewType = 'Groups';
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Error creating group:', error);
          this.isSavingGroup = false;
          alert('Failed to create group');
          this.cdr.detectChanges();

        }

      });

  }

  Groups: BusinessGroupModel[] = [];

  getUserGroups(userId: string) {

    this.http.getAllData(`Business/GetUserGroups/${userId}`)
      .subscribe({
        next: (res: any) => {
          this.Groups = res as BusinessGroupModel[];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading groups:', error);
          this.Groups = [];
          this.cdr.detectChanges();
        }
      });
  }

  changeView() {
    if (this.viewType === 'Businesses') {
      this.filterBusinesses();
    } else {
      const userId = localStorage.getItem('UserId');
      if (userId) {
        this.getUserGroups(userId);
      }
    }
  }

}
