// import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
// import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import {
//   ButtonDirective,
//   ButtonGroupComponent,
//   ButtonToolbarComponent,
//   CardBodyComponent,
//   CardComponent,
//   CardHeaderComponent,
//   ColComponent,
//   DropdownComponent,
//   DropdownDividerDirective,
//   DropdownItemDirective,
//   DropdownMenuDirective,
//   DropdownToggleDirective,
//   FormCheckLabelDirective,
//   FormControlDirective,
//   InputGroupComponent,
//   InputGroupTextDirective,
//   ModalModule,
//   RowComponent,
//   ProgressComponent,
//   ToastBodyComponent,
//   ToastComponent,
//   ToasterComponent,
//   ToastHeaderComponent
// } from '@coreui/angular';
// import { HttpConnectService } from '../../../Services/http-connect.service';
// import { BusinessType } from '../../../Models/Business/BusinessType';
// import { CommonModule } from '@angular/common';
// import { IconModule } from '@coreui/icons-angular';
// import { Country } from '../../../Models/CountryModel';
// import { ServiceModel } from '../../../Models/ServiceModel';
// import { ActiviityModel } from '../../../Models/ActivityModel';
// import { GlobalOrder } from '../../../Models/GlobalOrder';
// import { SystemModel } from '../../../Models/SystemModel';
// import { BusinessModel } from '../../../Models/Business/BusinessModel';

// @Component({
//   selector: 'app-button-groups',
//   templateUrl: './Show-Features.html',
//   imports: [RowComponent, ColComponent, CardComponent, IconModule, ModalModule,
//     CardHeaderComponent, CardBodyComponent, ButtonGroupComponent,
//     ButtonDirective, RouterLink, ReactiveFormsModule,
//     FormCheckLabelDirective, ButtonToolbarComponent,
//     InputGroupComponent, InputGroupTextDirective, RouterLink, RouterOutlet,
//     FormControlDirective, DropdownComponent, FormsModule, CommonModule,
//     DropdownToggleDirective, DropdownMenuDirective,
//     DropdownItemDirective, DropdownDividerDirective,
//     ButtonDirective,
//     ProgressComponent,
//     ToasterComponent,
//     ToastComponent,
//     ToastHeaderComponent,

//     ToastBodyComponent]
// })
// export class ShowFeaturesComponent implements OnInit {

//   features: GlobalOrder[] = [];
//   allFeatures: GlobalOrder[] = [];
//   message?: string
//   isLoading: boolean = false;
//   showDeleteModal: boolean = false;
//   selectedType?: GlobalOrder;
//   ///// for toastr ////////
//   position = 'top-end';
//   toastVisible = signal(false);
//   toastMessage = signal('');
//   percentage = signal(0);
//   autoHideToast = signal(true);
//   title: string = '';
//   status: string = '';
//   body: string = '';
//   BusinessId?: number
//   ServiceId?: number
//   globalSystemId?: number;
//   Systems?: SystemModel[]
//   loading: boolean = false
//   comment: string = '';
//   selectedOrderId?: number;
//   comments: any[] = [];
//   Businesses?: BusinessModel[]
//   Services?: ServiceModel[]
//   SelectedBusinessId?: number
//   SelectedServiceId?: number
//   selectedFilter: string = "All"
//   allCountOfTasks: number = 0
//   myName: string = ''

//   constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

//   ngOnInit(): void {
//     this.getAllFeatures()
//     this.getAllSystems()
//     this.getAllBusiness()
//     const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

//     this.myName = currentUser.userName ?? '';
//   }

//   getAllSystems() {
//     this.http.getAllData('GlobalSystem').subscribe(res => {
//       this.Systems = (res as SystemModel[]).map((el) => new SystemModel({
//         globalSystemId: el.globalSystemId,
//         globalSystemName: el.globalSystemName,
//       }))
//     }, (error) => {
//       console.error(error)
//       this.loading = false
//     })
//   }


//   getAllBusiness() {
//     const businessId = localStorage.getItem('businessId')
//     this.http.getAllData(`Business/GetAllBusinessForTask/${businessId}`).subscribe(res => {
//       this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
//         business_id: el.business_id,
//         business_name: el.business_name
//       }))
//       this.getAllServices()
//     }, (error) => {
//       console.error(error)
//       this.loading = false
//     })
//   }


//   getAllServices() {
//     const businessId = Number(localStorage.getItem('businessId'));

//     this.http.getAllData(`Service/${businessId}`).subscribe(res => {

//       this.Services = (res as ServiceModel[])
//         .filter(el =>
//           el.business_Services?.some((bs: any) => bs.business_id === businessId)
//         )
//         .map(el => new ServiceModel({
//           service_id: el.service_id,
//           description: el.description
//         }));

//       this.cdr.detectChanges();

//     }, error => {
//       console.error(error);
//       this.loading = false;
//     });
//   }

//   completedCount = 0;
//   progressCount = 0;
//   newCount = 0;

//   getAllFeatures() {
//     this.isLoading = true;
//     const businessId = localStorage.getItem('businessId')
//     const serviceId = localStorage.getItem('selectedServiceId')
//     this.http.getAllData(`Orders/${businessId}/${serviceId}`).subscribe(
//       (res: any) => {
//         console.log(res)
//         this.features = (res as any[]).map(item => new GlobalOrder({
          
//         }));
//         this.allCountOfTasks = this.features.length
//         this.allFeatures = this.features;
//         this.calculateStats();
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       },
//       (err) => {
//         this.isLoading = false;
//         this.message = 'Error loading data';
//         this.cdr.detectChanges();
//       }
//     );
//   }


//   calculateStats() {
//     this.features = this.features.filter(x => x.orderStatus?.statusEn !== 'Closed')
//     this.completedCount =
//       this.features.filter(x => x.orderStatus?.statusEn === 'Completed').length;

//     this.progressCount =
//       this.features.filter(x => x.orderStatus?.statusEn === 'On progress').length;

//     this.newCount =
//       this.features.filter(x => x.orderStatus?.statusEn === 'New').length;

//     this.filterTasks(this.selectedFilter)
//   }
//   confirmDelete(type: GlobalOrder) {
//     this.selectedType = type;
//     this.showDeleteModal = true;
//   }

//   deleteFeature(type?: GlobalOrder) {
//     if (!type) return;
//     this.http.deleteData(`Feature/${type.globalOrderId}`,).subscribe(() => {
//       this.features = this.features.filter(t => t.globalOrderId !== type.globalOrderId);
//       this.showDeleteModal = false;
//       this.toastMessage.set(`${type.globalOrderId} deleted successfully`);
//       this.toastVisible.set(true);
//     }, (error) => {
//       this.toastMessage.set(`An error occured during delete (${type.globalOrderId})`);
//       this.toastVisible.set(true);
//     });
//   }

//   onVisibleChange(visible: boolean) {
//     this.showDeleteModal = false;
//     this.toastVisible.set(visible);
//     if (!visible) this.percentage.set(0);
//   }

//   onTimerChange(value: number) {
//     this.percentage.set(value * 25);
//   }
//   showEditModal = false;

//   openEditModal(type: GlobalOrder) {
//     this.showEditModal = true;
//     this.body = type.notes || '';
//     this.comments = type.comments ? type.comments : [];
//     this.status = type.orderStatus?.statusEn || '';
//     // this.globalSystemId = type.globalSystemId;
//     this.selectedOrderId = type.globalOrderId;
//     this.BusinessId = type?.business_id
//     this.ServiceId = type?.service_id || undefined
//     console.log('Edit feature:', type);
//     this.makeAllCommentsRead(this.selectedOrderId!);
//   }

//   addComment() {
//     var currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

//     if (!this.comment.trim()) {
//       this.toastMessage.set('Comment cannot be empty');
//       this.toastVisible.set(true);
//       return;
//     }
//     this.http.putData(`Orders/AddComment/${this.selectedOrderId}`, { comment: this.comment }).subscribe(
//       (res) => {
//         console.log(res)
//         this.toastMessage.set('Comment added successfully');
//         this.toastVisible.set(true);
//         this.comments.push({
//           addedBy: this.myName,
//           commentContent: this.comment,
//           addedOn: Date.now()
//         });
//         this.cdr.detectChanges();
//         this.getAllFeatures();
//         this.comment = '';
//         this.toastMessage.set('Comment added successfully');
//         this.toastVisible.set(true);
//       },
//       (error) => {
//         console.error('Error adding comment:', error);
//         this.toastMessage.set('An error occurred while adding the comment');
//         this.toastVisible.set(true);
//       }
//     );
//     console.log('New comment:', this.comment);


//   }

//   updateFeature(featureId: number) {
//     const updatedFeature = {
//       body: this.body,
//       status: this.status,
//       globalSystemId: this.globalSystemId,
//       businessId: this.BusinessId,
//       serviceId: this.ServiceId
//     };

//     console.log(updatedFeature)

//     this.http.putData(`Feature/${featureId}`, updatedFeature).subscribe(
//       () => {
//         this.toastMessage.set('Feature updated successfully');
//         this.toastVisible.set(true);
//         this.getAllFeatures();
//         this.showEditModal = false;
//       },
//       (error) => {
//         console.error('Error updating feature:', error);
//         this.toastMessage.set('An error occurred while updating the feature');
//         this.toastVisible.set(true);
//       }
//     );
//   }

//   SetStatusClosed(id: number) {

//     this.http.putData(`Feature/SetTaskStatusClosed/${id}`, {}).subscribe(
//       () => {
//         this.toastMessage.set('Feature updated successfully');
//         this.toastVisible.set(true);
//         this.getAllFeatures();
//         this.showEditModal = false;
//       },
//       (error) => {
//         console.error('Error updating feature:', error);
//         this.toastMessage.set('An error occurred while updating the feature');
//         this.toastVisible.set(true);
//       }
//     );
//   }

//   SetStatusComleted(id: number) {

//     this.http.putData(`Feature/SetStatusComleted/${id}`, {}).subscribe(
//       () => {
//         this.toastMessage.set('Feature updated successfully');
//         this.toastVisible.set(true);
//         this.getAllFeatures();
//         this.showEditModal = false;
//       },
//       (error) => {
//         console.error('Error updating feature:', error);
//         this.toastMessage.set('An error occurred while updating the feature');
//         this.toastVisible.set(true);
//       }
//     );
//   }



//   filterTasks(filtter: string) {
//     console.log('Filtering tasks with filter:', filtter);
//     this.features = this.allFeatures;
//     if (filtter == "All") {
//       this.features = this.features.filter(x => x.orderStatus?.statusEn !== 'Closed')
//       return
//     }
//     this.features = this.features.filter(x => x.orderStatus?.statusEn === filtter.trim());
//   }

//   getUnReadComments(commentss?: any[]): number {
//     if (!commentss) return 0;

//     return commentss.filter(c => !c.isRead).length;
//   }

//   makeAllCommentsRead(taskId: number) {
//     this.http.putData(`Feature/makeAllCommentsRead/${taskId}`, {}).subscribe(res => {

//     })
//   }

//   closeModal(id: number) {
//     this.showEditModal = false;
//     this.getAllFeatures();
//     this.cdr.detectChanges();
//   }

// }

import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { ServiceModel } from '../../../Models/ServiceModel';
import { GlobalOrder, GlobalOrderDetail } from '../../../Models/GlobalOrder';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-Features.html',
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
export class ShowFeaturesComponent implements OnInit {

  orders: GlobalOrder[] = [];
  allOrders: GlobalOrder[] = [];
  message?: string;
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedOrder?: GlobalOrder;

  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);

  notes: string = '';
  statusEn: string = '';
  BusinessId?: number;
  ServiceId?: number;
  loading: boolean = false;
  comment: string = '';
  selectedOrderId?: number;
  comments: any[] = [];
  Businesses?: BusinessModel[];
  Services?: ServiceModel[];
  selectedFilter: string = 'All';
  allCountOfTasks: number = 0;
  myName: string = '';

  showEditModal = false;

  completedCount = 0;
  progressCount = 0;
  newCount = 0;

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllOrders();
    this.getAllBusiness();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.myName = currentUser.userName ?? '';
  }

  getAllBusiness() {
    const businessId = localStorage.getItem('businessId');
    this.http.getAllData(`Business/GetAllBusinessForTask/${businessId}`).subscribe(res => {
      this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }));
      this.getAllServices();
    }, (error) => {
      console.error(error);
      this.loading = false;
    });
  }

  getAllServices() {
    const businessId = Number(localStorage.getItem('businessId'));

    this.http.getAllData(`Service/${businessId}`).subscribe(res => {
      this.Services = (res as ServiceModel[])
        .filter(el =>
          el.business_Services?.some((bs: any) => bs.business_id === businessId)
        )
        .map(el => new ServiceModel({
          service_id: el.service_id,
          description: el.description
        }));
      this.cdr.detectChanges();
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  getAllOrders() {
    this.isLoading = true;
    const businessId = localStorage.getItem('businessId');
    const serviceId = localStorage.getItem('selectedServiceId');
    this.http.getAllData(`Orders/${businessId}/${serviceId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.orders = (res as any[]).map(item => new GlobalOrder(item));
        this.allCountOfTasks = this.orders.length;
        this.allOrders = this.orders;
        this.calculateStats();
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

  calculateStats() {
    this.orders = this.orders.filter(x => x.orderStatus?.statusEn !== 'Closed');
    this.completedCount =
      this.orders.filter(x => x.orderStatus?.statusEn === 'Completed').length;

    this.progressCount =
      this.orders.filter(x => x.orderStatus?.statusEn === 'On progress').length;

    this.newCount =
      this.orders.filter(x => x.orderStatus?.statusEn === 'New').length;

    this.filterTasks(this.selectedFilter);
  }

  confirmDelete(order: GlobalOrder) {
    this.selectedOrder = order;
    this.showDeleteModal = true;
  }

  deleteOrder(order?: GlobalOrder) {
    if (!order) return;
    this.http.deleteData(`Orders/${order.globalOrderId}`).subscribe(() => {
      this.orders = this.orders.filter(o => o.globalOrderId !== order.globalOrderId);
      this.showDeleteModal = false;
      this.toastMessage.set(`Order #${order.globalOrderId} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occurred during delete (#${order.globalOrderId})`);
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

  openEditModal(order: GlobalOrder) {
    this.showEditModal = true;
    this.notes = order.notes || '';
    this.comments = order.comments ? order.comments : [];
    this.statusEn = order.orderStatus?.statusEn || '';
    this.selectedOrderId = order.globalOrderId;
    this.selectedOrder = order;
    this.BusinessId = order.business_id;
    this.ServiceId = order.service_id || undefined;
    this.makeAllCommentsRead(this.selectedOrderId!);
  }

  addComment() {
    if (!this.comment.trim()) {
      this.toastMessage.set('Comment cannot be empty');
      this.toastVisible.set(true);
      return;
    }
    this.http.putData(`Orders/AddComment/${this.selectedOrderId}`, { comment: this.comment }).subscribe(
      () => {
        this.comments.push({
          addedBy: this.myName,
          commentContent: this.comment,
          addedOn: Date.now()
        });
        this.cdr.detectChanges();
        this.getAllOrders();
        this.comment = '';
        this.toastMessage.set('Comment added successfully');
        this.toastVisible.set(true);
      },
      (error) => {
        console.error('Error adding comment:', error);
        this.toastMessage.set('An error occurred while adding the comment');
        this.toastVisible.set(true);
      }
    );
  }

  updateOrder(orderId: number) {
    const updatedOrder = {
      notes: this.notes,
      statusEn: this.statusEn,
      businessId: this.BusinessId,
      serviceId: this.ServiceId
    };

    this.http.putData(`Orders/${orderId}`, updatedOrder).subscribe(
      () => {
        this.toastMessage.set('Order updated successfully');
        this.toastVisible.set(true);
        this.getAllOrders();
        this.showEditModal = false;
      },
      (error) => {
        console.error('Error updating order:', error);
        this.toastMessage.set('An error occurred while updating the order');
        this.toastVisible.set(true);
      }
    );
  }

  SetStatusClosed(id: number) {
    this.http.putData(`Orders/SetTaskStatusClosed/${id}`, {}).subscribe(
      () => {
        this.toastMessage.set('Order updated successfully');
        this.toastVisible.set(true);
        this.getAllOrders();
        this.showEditModal = false;
      },
      (error) => {
        this.toastMessage.set('An error occurred while updating the order');
        this.toastVisible.set(true);
      }
    );
  }

  SetStatusCompleted(id: number) {
    this.http.putData(`Orders/SetStatusCompleted/${id}`, {}).subscribe(
      () => {
        this.toastMessage.set('Order updated successfully');
        this.toastVisible.set(true);
        this.getAllOrders();
        this.showEditModal = false;
      },
      (error) => {
        this.toastMessage.set('An error occurred while updating the order');
        this.toastVisible.set(true);
      }
    );
  }

  filterTasks(filter: string) {
    this.orders = this.allOrders;
    if (filter === 'All') {
      this.orders = this.orders.filter(x => x.orderStatus?.statusEn !== 'Closed');
      return;
    }
    this.orders = this.orders.filter(x => x.orderStatus?.statusEn === filter.trim());
  }

  getUnReadComments(commentss?: any[] | null): number {
    if (!commentss) return 0;
    return commentss.filter(c => !c.isRead).length;
  }

  makeAllCommentsRead(orderId: number) {
    this.http.putData(`Orders/makeAllCommentsRead/${orderId}`, {}).subscribe(() => { });
  }

  closeModal() {
    this.showEditModal = false;
    this.getAllOrders();
    this.cdr.detectChanges();
  }

  getDetailStatusColor(detail: GlobalOrderDetail): string {
    switch (detail.orderStatus?.statusEn?.toLowerCase()?.trim()) {
      case 'pending': return 'warning';
      case 'confirmed':
      case 'on progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled':
      case 'closed': return 'danger';
      default: return 'secondary';
    }
  }
}
