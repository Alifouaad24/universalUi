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
  globalSystemId: string = '';
  Systems?: SystemModel[]
  loading: boolean = false
  comment: string = '';
  selectedFeatureId: number = 0;
  comments: string[] = [];

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllFeatures()
    this.getAllSystems()
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

  completedCount = 0;
  progressCount = 0;
  newCount = 0;

  getAllFeatures() {
    this.isLoading = true;

    this.http.getAllData('Feature').subscribe(
      (res: any) => {

        this.features = (res as any[]).map(item => new FeatureModel({
          featureId: item.featureId,
          title: item.title,
          body: item.body,
          status: item.status,
          comments: item.comments,
          system: item.globalSystem,
        }));

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

    this.completedCount =
      this.features.filter(x => x.status === 'Completed').length;

    this.progressCount =
      this.features.filter(x => x.status === 'On progress').length;

    this.newCount =
      this.features.filter(x => x.status === 'New').length;
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
      this.toastMessage.set(`${type.title} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete (${type.title})`);
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
    this.title = type.title || '';
    this.body = type.body || '';
    this.comments = type.comments ? type.comments : [];
    this.status = type.status || '';
    this.globalSystemId = type.system.globalSystemId || '';
    this.selectedFeatureId = type.featureId || 0;
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
      title: this.title,
      body: this.body,
      status: this.status,
      globalSystemId: this.globalSystemId,
    };

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

}
