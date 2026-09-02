import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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
import { InventoryModel } from '../../../Models/InventoryModel';
import { StorageService } from '../../../core/Services/StorageService';
import saveAs from 'file-saver';
import { ColorModel } from '../../../Models/ColorModel';
import { PlatformModel } from '../../../Models/PlatformModel';
import { UnitModel } from '../../../Models/UnitModel';
import { SizeModel } from '../../../Models/SizeModel';
import { CurrencyModel } from '../../../Models/CurrencyModel';
import { CategoryModel } from '../../../Models/CategoryModel';
import { FeatureModel } from '../../../Models/FeatureModel';
declare const bootstrap: any; // NEW: بدل import { Modal } from 'bootstrap';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-items.html',
  imports: [RowComponent, ColComponent, CardComponent, IconModule, ModalModule, SpinnerComponent,
    CardHeaderComponent, CardBodyComponent, ButtonGroupComponent,
    ButtonDirective, RouterLink, ReactiveFormsModule,
    FormCheckLabelDirective, ButtonToolbarComponent,
    InputGroupComponent, InputGroupTextDirective, RouterLink, RouterOutlet,
    FormControlDirective, DropdownComponent, FormsModule, CommonModule,
    DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective,
    ButtonDirective, FormCheckComponent,
    ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class ShowItemsComponent implements OnInit {

  inventory: any[] = [];
  message?: string
  isLoading: boolean = false;
  showDeleteModal: boolean = false;
  selectedItem?: any;
  selectedType: any = {};
  DetailsModalVisible: boolean = false;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  ForDropShipping: boolean = false
  businessId?: number
  categories: any[] = [];
  brands: any[] = [];
  itemConditions: any[] = [];
  currencies: any[] = [];

  selectedCurrency?: string
  selectedPrice?: number
  selectedCategory?: string
  selectedCondition?: string
  selectedBrand?: string
  selectedQuantity?: number
  selectedUpc?: string
  BrandId?: string
  // قوائم Lookup
  Categories: any[] = [];
  Sizes: any[] = [];
  Units: any[] = [];
  Colors: any[] = [];
  Currencies: any[] = [];
  loading: boolean = false;


  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute, private storage: StorageService) { }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'))
    this.getItems()
    this.getPlatforms();
    this.getCategories();
    this.getSizes();
    this.getUnits();
    this.getColors();
    this.getCurrencies();

    this.getAllCategories()
    this.getAllCurrencies()
  }

  getPlatforms() {
    this.http.getAllData(`Platform/${this.businessId}`).subscribe((res: any) => {
      this.Platforms = res;
      this.cdr.detectChanges();
    });
  }

  getAllPlatforms() {
    this.http.getAllData('Platform').subscribe(res => {
      this.Platforms = (res as PlatformModel[]).map((el) => new PlatformModel({
        platform_id: el.platform_id,
        description: el.description,
      }));
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error);
      this.loading = false;
    });
  }

  getCategories() {
    this.http.getAllData(`Category/${this.businessId}`).subscribe((res: any) => {
      this.Categories = res;
      this.cdr.detectChanges();
    });
  }

  getSizes() {
    this.http.getAllData('Size').subscribe((res: any) => {
      this.Sizes = res;
      this.cdr.detectChanges();
    });
  }

  getUnits() {
    this.http.getAllData('Unit').subscribe((res: any) => {
      this.Units = res;
      this.cdr.detectChanges();
    });
  }

  getColors() {
    this.http.getAllData('Color').subscribe((res: any) => {
      this.Colors = res;
      this.cdr.detectChanges();
    });
  }

  getCurrencies() {
    this.http.getAllData('Currency').subscribe((res: any) => {
      this.Currencies = res;
      this.cdr.detectChanges();
    });
  }

  getAllCategories() {
    this.http.getAllData(`Category/${this.businessId}`).subscribe((res: any) => {
      console.log(res)
      this.categories = res
    })
  }

  getAllCurrencies() {
    this.http.getAllData('Currency').subscribe((res: any) => {
      console.log(res)
      this.currencies = res
    })
  }

  getItems() {
    this.isLoading = true;
    const businessId = localStorage.getItem('businessId')
    this.http.getAllData(`Item/GetAllUndeProccessItems/${businessId}`).subscribe(
      (res: any) => {
        console.log(res)
        this.inventory = res;
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

  confirmDelete(type: any) {
    this.selectedItem = type;
    this.showDeleteModal = true;
  }

  deleteActivity(type?: any) {
    if (!type) return;
    this.http.deleteData(`Item/${type.itemId}`,).subscribe(() => {
      this.inventory = this.inventory.filter(t => t.itemId !== type.itemId);
      this.showDeleteModal = false;
      this.toastMessage.set(`${type.upc || type.sku || 'Item'} deleted successfully`);
      this.toastVisible.set(true);
    }, (error) => {
      this.toastMessage.set(`An error occured during delete (${type.upc || type.sku || 'Item'})`);
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

  isItemModalVisible = false;

  openItemModal(item: any) {
    this.selectedItem = item;
    this.isItemModalVisible = true;
  }

  IsScrapeItemModalVisible = false;

  openItemModalScrapeItemModal(item: any) {
    this.selectedItem = item;
    this.IsScrapeItemModalVisible = true;
  }

  copyText(text: string | undefined) {

    if (!text) return;

    navigator.clipboard.writeText(text);
    this.toastMessage.set('Text copied successfully');
    this.toastVisible.set(true);
    this.cdr.detectChanges();

  }

  selectedImagesToEbay: any[] = [];

  toggleImage(image: any) {
    const index = this.selectedImagesToEbay.findIndex(i => i.imageUrl === image.imageUrl);

    if (index === -1) {
      // إضافة
      this.selectedImagesToEbay.push(image);
    } else {
      // حذف
      this.selectedImagesToEbay.splice(index, 1);
    }
  }

  getImageIndex(image: any): number {
    return this.selectedImagesToEbay.findIndex(i => i.imageUrl === image.imageUrl) + 1;
  }

  isSelected(image: any): boolean {
    return this.selectedImagesToEbay.some(i => i.imageUrl === image.imageUrl);
  }

  loadingImages: boolean = false;
  selectedFiles: File[] = [];
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);


    console.log(this.selectedFiles);
  }





  selectItem(item: any) {
    console.log('Selected item:', item);
    this.cdr.detectChanges();
  }

  async downloadAllImages() {

    const images =
      this.selectedImagesToEbay;
    if (!images?.length) {
      return;
    }
    const upc =
      this.selectedType?.item?.upc ??
      'images';

    const body = {
      folderName: upc,
      urls: images.map(
        (x: any) => x.imageUrl
      )
    };

    const response = await fetch(
      'https://apxapi.somee.com/api/Inventory/download-images',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    const blob = await response.blob();
    saveAs(blob, `${upc}.zip`);
  }


  selctedInvId: number = 0
  MarketPlaceOfferUrl: string = ''
  showMarketPlacePopup: boolean = false
  showMarketPlaceModal(id: number | undefined) {
    this.selctedInvId = id ?? 0
    this.showMarketPlacePopup = true
  }

  isDeleteingImages: boolean = false;
  deleteSelectedImages() {
    if (!this.selectedImagesToEbay || this.selectedImagesToEbay.length === 0) {
      this.toastMessage.set('Please select at least one image to delete.');
      this.cdr.detectChanges();
      this.toastVisible.set(true);
      this.cdr.detectChanges();
      return;
    }

    const imageNamesToDelete = this.selectedImagesToEbay.map(img => img.itemImageId);
    console.log('Deleting selected images with IDs:', imageNamesToDelete);
    this.isDeleteingImages = true;
    this.http.putData(`Item/DeleteImages`, { imagesIds: imageNamesToDelete }).subscribe(
      (res: any) => {
        this.isDeleteingImages = false;
        this.toastMessage.set('Selected images successfully deleted from the item.');
        this.toastVisible.set(true);
        this.selectedType!.item.images = this.selectedType?.item?.images.filter((img: any) => !this.selectedImagesToEbay.some(selImg => selImg.imageUrl === img.imageUrl));
        this.selectedImagesToEbay = [];
        this.cdr.detectChanges();
      },
      (err) => {
        this.isDeleteingImages = false;
        this.toastMessage.set('Error deleting selected images from the item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }

  ShowDetailsModal(item: any) {
    this.selectedImagesToEbay = [];
    this.selectedType = item;
    this.DetailsModalVisible = true;
    item.images.map((el: any) => {
      if (el.isPublishedOnEbay) {
        this.selectedImagesToEbay.push(el)
      }
    })
  }

  PublishingByEbay = false
  isAuthInEbay = false
  isLoading1 = false




  goToEditItem(item: any) {
    this.router.navigate(['./add-edit-item'], {
      relativeTo: this.route,
      state: { item }
    });
  }

  ///////////////////////////////////////////////////

  features: FeatureModel[] = [];
  upc?: string
  imgUrl: string[] = []
  price?: number
  model?: string
  Brand?: string
  storeSku?: string
  internet?: string
  Notes?: string
  CondId?: number
  SysyemId?: number
  CategoryId?: number
  allCondetions: any = []
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
  currencis: CurrencyModel[] = []
  colors: ColorModel[] = []
  platforms: PlatformModel[] = []
  sizes: SizeModel[] = []
  units: UnitModel[] = []
  categoryId: number | null = null;
  currencyId: number | null = null;
  colorId: number | null = null;
  platformId: number | null = null;
  sizeId: number | null = null;
  unitId: number | null = null;
  visible = false
  ///// for toastr ////////
  IHerb: string = ''
  buinessId?: number

  chooseType(event: any) {
    const type = event.target.value
    this.selectedSource = type;
    if (type == 'Build' || type == 'Milwaukee' || type == 'Ryobi' || type == 'UPCItems' || type == 'IHerb') {
      this.useInput = true
    } else {
      this.useInput = false
    }
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
          this.onVisibleChange(true)
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
          this.onVisibleChange(true)
        }
      );
    }
    else if (this.selectedSource === 'UPCItems') {
      this.http.posteData(`Scraper/ByUPCItems/${upc}`, null).subscribe(
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
          this.onVisibleChange(true)
        }
      );
    }
    else if (this.selectedSource === 'IHerb') {
      this.http.posteData(`Scraper/ByIherb/${upc}`, null).subscribe(
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
            this.showHome = true;
            this.showError = false;
            this.upc = upc
            this.cdr.detectChanges()
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
          this.onVisibleChange(true)
        }
      );
    }
  }

  onFile2Selected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.lowesOrHomeDepotFile = files[0];
    }
  }

  htmlContent: string = '';

  GetPriceAndPhotoForLowes() {
    this.showHome = false;
    if (this.htmlContent && this.htmlContent.trim() !== '') {
      this.isLoading = true;
      const formData = new FormData();
      const htmlFile = new File(
        [this.htmlContent],
        'page.html',
        { type: 'text/html' }
      );

      formData.append('file', htmlFile);
      if (this.selectedSource == 'Lowes') {
        this.http.posteData(`Scraper/ParseLowesHtml`, formData, true).subscribe(

          (response: any) => {
            console.log(response)
            this.isLoading = false;

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
            console.log(response)
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
              //this.onVisibleChange(true)
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
            this.onVisibleChange(true)
          }
        );
      }
    } else {
      window.alert("Please choose html file to get data")
    }
  }


  next() {
    this.currentIndex =
      (this.currentIndex + 1) % this.imgUrl.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.imgUrl.length) % this.imgUrl.length;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    this.http.posteData('Scraper', formData, true).subscribe({
      next: (res: string[]) => {
        this.imgUrl.push(...res);
        this.image = res[0];
        console.log(this.imgUrl);
      },
      error: () => {
        // toaster error
      }
    });
  }

  SaveIngItemInDB: boolean = false
  SaveItemInDB() {
    this.SaveIngItemInDB = true;
    const payLoad = {
      itemDescription: this.title ?? '',
      itemDetails: this.description2 ?? '',
      sku: this.storeSku ?? null,
      internetId: this.internet ?? null,
      upc: this.upc ?? null,
      model: this.model ?? null,
      platformId: this.platformId ? Number(this.platformId) : null,
      height: this.height ? Number(this.height) : null,
      width: this.width ? Number(this.width) : null,
      length: this.length ? Number(this.length) : null,
      unitId: this.unitId ?? null,
      unitValue: this.unitId ?? null,
      businessId: Number(localStorage.getItem('businessId')) ?? null,
      colorId: this.colorId ?? null,
      sizeId: this.sizeId ?? null,
      categoryId: this.categoryId ?? null,
      basePrice: Number(this.price ?? 0),
      currencyId: this.currencyId ?? null,
      images: this.imgUrl ?? []
    };


    console.log(payLoad)
    this.http.posteData(`Item/AddItemJson/${this.selectedItem?.itemId}`, payLoad).subscribe(res => {
      this.SaveIngItemInDB = false;
      window.location.reload()
      console.log(res)
    }, (error) => {
      this.SaveIngItemInDB = false;
    })

  }
  SetItemCannotScraped1 = false
  SetItemCannotScraped() {
    this.SetItemCannotScraped1 = true
    this.http.putData(`Item/SetItemCannotScraped/${this.selectedItem?.itemId}`, {}).subscribe(res => {
      console.log(res)
      this.SetItemCannotScraped1 = false
      this.selectedItem.canScrape = false
      this.toastMessage.set('Item set as cannot scraped successfully');
      this.toastVisible.set(true);
      this.IsScrapeItemModalVisible = false;
      this.cdr.detectChanges()
    }, (error) => {
    })

  }

}
