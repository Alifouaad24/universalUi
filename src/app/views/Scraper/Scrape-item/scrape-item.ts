import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
  FormCheckComponent,
  SpinnerComponent
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
  templateUrl: './scrape-item.html',
  imports: [RowComponent, ColComponent, CardComponent, IconModule, ModalModule,
    CardHeaderComponent, CardBodyComponent, ButtonGroupComponent,
    ButtonDirective, RouterLink, ReactiveFormsModule, FormCheckComponent,
    FormCheckLabelDirective, ButtonToolbarComponent,
    InputGroupComponent, InputGroupTextDirective, RouterLink, RouterOutlet,
    FormControlDirective, DropdownComponent, FormsModule, CommonModule,
    DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective,
    ButtonDirective, SpinnerComponent,
    ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class ScrapeItemComponent implements OnInit {

  features: FeatureModel[] = [];
  message?: string
  upc?: string
  imgUrl: string[] = []
  price?: number
  isLoading: boolean = false
  model?: string
  Brand?: string
  storeSku?: string
  internet?: string
  Notes?: string
  CondId?: number
  platformId?: number
  SysyemId?: number
  CategoryId?: number
  allCondetions: any = []
  Categories: any = []
  Systems: any = []
  Platforms: any = []
  CondetionId?: number
  showPublic: boolean = false
  showHome: boolean = false
  showError: boolean = false
  showNoImages: boolean = false
  Qty: number = 1
  ///////////////////////////////////////
  UPCPublic: string = ''
  title?: string
  description?: string
  description2?: string
  brand?: string
  image: string = ""
  modelPublic?: string
  color?: string
  category?: string
  lowest_recorded_price?: number
  highest_recorded_price?: number
  images?: []
  source?: string
  quntiuty?: number
  isLoadingPublic: boolean = false
  showErrorForMe: boolean = false
  Images: string[] = []
  index: number = 0
  MerchantId?: number
  Merchants?: any
  length?: String
  height?: String
  width?: String
  lowesOrHomeDepotFile?: File
  isLoadingForImg: boolean = false
  currentIndex = 0;
  selectedSource: string = 'HomeDepot';
  useInput?: boolean;
  showDeleteModal: boolean = false;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  GetPriceAndPhoto(upc: string | undefined): void {
    this.showHome = false;
    this.showErrorForMe = false;

    if (!upc || upc.trim() === "") {
      this.showHome = true;
      this.showError = false;
      this.image = "";
      this.imgUrl = [];
      return;
    }

    this.showError = false;
    this.isLoading = true;
    this.showNoImages = false

    if (this.selectedSource === 'Milwaukee') {
      this.http.posteData(`Scraper/Bymilwaukeetool/${upc}`, {}).subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log(response)

          if (response != null) {
            this.imgUrl = response.images || [];
            this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
            this.price = response.price;
            this.Brand = response.brand;
            this.model = response.model;
            this.storeSku = response.sku;
            this.internet = response.internet;
            this.source = response.source;
            this.quntiuty = response.qty;
            this.title = response.title;
            this.description2 = response.desc;
            this.height = response.height
            this.width = response.wedth
            this.length = response.length
            if (response.upc && response.upc.includes("Does not Apply") && upc.length === 12 && /^\d+$/.test(upc)) {
              this.upc = upc
            } else {
              this.upc = response.upc
            }


            // if (this.imgUrl.length == 0) {
            //   this.showNoImages = true
            // }

            // const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
            // if (matchedPlatform) {
            //   this.platformId = matchedPlatform.platform_id;
            // }

            this.showHome = true;
            this.showError = false;
            this.cdr.detectChanges()
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
        }
      );

    } else if (this.selectedSource === 'Build') {
      this.http.posteData(`Scraper/${upc}`, null).subscribe(
        (response: any) => {
          this.isLoading = false;

          if (response != null) {
            this.imgUrl = response.images || [];
            this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
            this.price = response.price;
            this.Brand = response.brand;
            this.model = response.model;
            this.storeSku = response.sku;
            this.quntiuty = response.qty;
            this.internet = response.internet;
            this.source = response.source;
            this.title = response.title;
            this.description2 = response.desc;
            // if (response.upc.includes("Does not Apply") && upc.length === 12 && /^\d+$/.test(upc)) {
            //   this.upc = upc
            // } else {
            //   this.upc = response.upc
            // }
            // if (this.imgUrl.length == 0) {
            //   this.showNoImages = true
            // }

            // const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
            // if (matchedPlatform) {
            //   this.platformId = matchedPlatform.platform_id;
            // }

            this.showHome = true;
            this.showError = false;
            this.cdr.detectChanges()
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
        }
      );
    } else if (this.selectedSource === 'Ryobi') {
      this.http.posteData(`Scraper/ByRyobiTools/${upc}`, null).subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log(response)
          if (response != null) {
            this.imgUrl = response.images || [];
            this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
            this.price = response.price;
            this.Brand = response.brand;
            this.model = response.model;
            this.storeSku = response.sku;
            this.quntiuty = response.qty;
            this.internet = response.internet;
            this.source = response.source;
            this.title = response.title;
            this.description2 = response.desc;
            // if (response.upc.includes("Does not Apply") && upc.length === 12 && /^\d+$/.test(upc)) {
            //   this.upc = upc
            // } else {
            //   this.upc = response.upc
            // }
            // if (this.imgUrl.length == 0) {
            //   this.showNoImages = true
            // }

            // const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
            // if (matchedPlatform) {
            //   this.platformId = matchedPlatform.platform_id;
            // }
            this.showHome = true;
            this.showError = false;
            this.cdr.detectChanges()
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
        }
      );
    }
  }

  chooseType(event: any) {
    const type = event.target.value
    this.selectedSource = type;
    if (type == 'Build' || type == 'Milwaukee' || type == 'Ryobi') {
      this.useInput = true
    } else {
      this.useInput = false
    }
  }

  GetPriceAndPhotoForLowes() {
    this.showHome = false;
    if (this.lowesOrHomeDepotFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.lowesOrHomeDepotFile);
      if (this.selectedSource == 'Lowes') {
        this.http.posteData(`Scraper/ParseLowesHtml`, formData, true).subscribe(
          (response: any) => {
            this.isLoading = false;
            console.log(response)

            if (response != null) {
              this.imgUrl = response.images || [];
              this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
              this.price = response.price;
              this.Brand = response.brand;
              this.model = response.model;
              this.storeSku = response.sku;
              this.internet = response.internet;
              this.source = response.source;
              this.title = response.title;
              this.description2 = response.desc;
              this.height = response.height
              this.width = response.wedth
              this.length = response.length

              if (this.imgUrl.length == 0) {
                this.showNoImages = true
              }

              // const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
              // if (matchedPlatform) {
              //   this.platformId = matchedPlatform.platform_id;
              // }

              this.showHome = true;
              this.showError = false;
              this.cdr.detectChanges()
            } else {
              this.showErrorForMe = true;
            }
          },
          (error) => {
            this.isLoading = false;
            this.showError = true;
            this.showHome = false;
          }
        );
      } else if (this.selectedSource == 'HomeDepot') {
        this.http.posteData(`Scraper/HomeDepotFileHtmlAnalyse`, formData, true).subscribe(
          (response: any) => {
            this.isLoading = false;
            if (response) {
              this.imgUrl = response.images || [];
              this.image = this.imgUrl[0] ?? "";
              this.price = response.price;
              this.Brand = response.brand;
              this.model = response.model;
              this.storeSku = response.sku;
              this.internet = response.internet;
              this.title = response.title;
              this.description2 = response.desc;
              this.height = response.height
              this.width = response.width
              this.length = response.length
              this.upc = response.upc

              // if (this.imgUrl.length == 0) {
              //   this.showNoImages = true
              // }

              // const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
              // if (matchedPlatform) {
              //   this.platformId = matchedPlatform.platform_id;
              // }
              this.showHome = true;
              this.showError = false;
              this.cdr.detectChanges()
            } else {
              this.showErrorForMe = true;
              this.isLoading = false;
            }
          },
          (error) => {
            this.isLoading = false;
            this.showError = true;
            this.showHome = false;
          }
        );
      }

    } else {
      window.alert("Please choose html file to get data")
    }
  }

  onFile2Selected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.lowesOrHomeDepotFile = files[0];
    }
  }


  confirmDelete(type: FeatureModel) {
    this.showDeleteModal = true;
  }

  onVisibleChange(visible: boolean) {
    this.showDeleteModal = false;
    this.toastVisible.set(visible);
    if (!visible) this.percentage.set(0);
  }

  onTimerChange(value: number) {
    this.percentage.set(value * 25);
  }

  next() {
    this.currentIndex =
      (this.currentIndex + 1) % this.imgUrl.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.imgUrl.length) % this.imgUrl.length;
  }

}
