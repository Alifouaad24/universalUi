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
import { FeatureModel } from '../../../Models/FeatureModel';
import { SystemModel } from '../../../Models/SystemModel';
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

  features: FeatureModel[] = [];
  allFeatures: FeatureModel[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedType?: FeatureModel;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  title: string = '';
  status: string = '';
  body: string = '';
  BusinessId?: number
  ServiceId?: number
  globalSystemId?: number;
  Systems?: SystemModel[]
  loading: boolean = false
  comment: string = '';
  selectedFeatureId?: number;
  comments: string[] = [];
  Businesses?: BusinessModel[]
  Services?: ServiceModel[]
  SelectedBusinessId?: number
  SelectedServiceId?: number
  selectedFilter: string = "All"


  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllFeatures()
    this.getAllSystems()
    this.getAllBusiness()
  }

  getAllSystems() {
    this.http.getAllData('GlobalSystem').subscribe(res => {
      this.Systems = (res as SystemModel[]).map((el) => new SystemModel({
        globalSystemId: el.globalSystemId,
        globalSystemName: el.globalSystemName,
      }))
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }


  getAllBusiness() {
    const businessId = localStorage.getItem('businessId')
    this.http.getAllData(`Business/GetAllBusinessForTask/${businessId}`).subscribe(res => {
      this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }))
      this.getAllServices()
    }, (error) => {
      console.error(error)
      this.loading = false
    })
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

  completedCount = 0;
  progressCount = 0;
  newCount = 0;

  getAllFeatures() {
    this.isLoading = true;
    const businessId = localStorage.getItem('businessId')
    this.http.getAllData(`Feature/${businessId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.features = (res as any[]).map(item => new FeatureModel({
          featureId: item.featureId,
          body: item.body,
          status: item.status,
          comments: item.comments,
          system: item.globalSystem,
          Business: item.business,
          Service: item.service,
          business_id: item.business_id,
          globalSystemId: item.globalSystemId,
          service_id: item.service_id
        }));

        this.allFeatures = this.features;
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
    this.features = this.features.filter(x => x.status !== 'Closed')
    this.completedCount =
      this.features.filter(x => x.status === 'Completed').length;

    this.progressCount =
      this.features.filter(x => x.status === 'On progress').length;

    this.newCount =
      this.features.filter(x => x.status === 'New').length;

    this.filterTasks(this.selectedFilter)
  }
  confirmDelete(type: FeatureModel) {
    this.selectedType = type;
    this.showDeleteModal = true;
  }

  deleteFeature(type?: FeatureModel) {
    if (!type) return;
    this.http.deleteData(`Feature/${type.featureId}`,).subscribe(() => {
      this.features = this.features.filter(t => t.featureId !== type.featureId);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.featureId} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete (${type.featureId})`);
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
  showEditModal = false;

  openEditModal(type: FeatureModel) {
    this.showEditModal = true;
    this.body = type.body || '';
    this.comments = type.comments ? type.comments : [];
    this.status = type.status || '';
    this.globalSystemId = type.globalSystemId;
    this.selectedFeatureId = type.featureId;
    this.BusinessId = type?.business_id
    this.ServiceId = type?.service_id
    console.log('Edit feature:', type);
  }

  addComment() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!this.comment.trim()) {
      this.toastMessage.set('Comment cannot be empty');
      this.toastVisible.set(true);
      return;
    }
    this.http.putData(`Feature/AddComment/${this.selectedFeatureId}`, { comment: this.comment }).subscribe(
      () => {
        this.toastMessage.set('Comment added successfully');
        this.toastVisible.set(true);
        this.comments.push(`${currentUser.userName?.replace('-', ' ')}: ${this.comment}`);
        this.cdr.detectChanges();
        this.getAllFeatures();
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
    console.log('New comment:', this.comment);


  }

  updateFeature(featureId: number) {
    const updatedFeature = {
      body: this.body,
      status: this.status,
      globalSystemId: this.globalSystemId,
      businessId: this.BusinessId,
      serviceId: this.ServiceId
    };

    console.log(updatedFeature)

    this.http.putData(`Feature/${featureId}`, updatedFeature).subscribe(
      () => {
        this.toastMessage.set('Feature updated successfully');
        this.toastVisible.set(true);
        this.getAllFeatures();
        this.showEditModal = false;
      },
      (error) => {
        console.error('Error updating feature:', error);
        this.toastMessage.set('An error occurred while updating the feature');
        this.toastVisible.set(true);
      }
    );
  }

  SetStatusClosed(id: number) {

    this.http.putData(`Feature/SetTaskStatusClosed/${id}`, {}).subscribe(
      () => {
        this.toastMessage.set('Feature updated successfully');
        this.toastVisible.set(true);
        this.getAllFeatures();
        this.showEditModal = false;
      },
      (error) => {
        console.error('Error updating feature:', error);
        this.toastMessage.set('An error occurred while updating the feature');
        this.toastVisible.set(true);
      }
    );
  }

  filterTasks(filtter: string) {
    this.features = this.allFeatures;
    if (filtter == "All") {
      this.features = this.features.filter(x => x.status !== 'Closed')
      return
    }
    this.features = this.features.filter(x => x.status === filtter);
  }

}
