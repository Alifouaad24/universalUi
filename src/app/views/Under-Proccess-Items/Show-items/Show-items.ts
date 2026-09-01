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
  ToastHeaderComponent
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
declare const bootstrap: any; // NEW: بدل import { Modal } from 'bootstrap';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-items.html',
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


  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute, private storage: StorageService) { }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'))
    this.getItems()

    this.getAllCategories()
    this.getAllBrands()
    this.getAllItemCondition()
    this.getAllCurrencies()
  }

  getAllCategories() {
    this.http.getAllData('Category').subscribe((res: any) => {
      console.log(res)
      this.categories = res
    })
  }
  getAllBrands() {
    this.http.getAllData('Brand').subscribe((res: any) => {
      console.log(res)
      this.brands = res
    })
  }
  getAllItemCondition() {
    this.http.getAllData('ItemCondition').subscribe((res: any) => {
      console.log(res)
      this.itemConditions = res
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

  PublishByEbay(product: any) {

    if (!this.selectedImagesToEbay || this.selectedImagesToEbay.length === 0) {
      this.toastMessage.set('Please select at least one image to publish the product on eBay.');
      this.toastVisible.set(true);
      this.cdr.detectChanges();
      return;
    }
    const token = this.storage.getWithExpiry('ebayToken')
    if (!token) {
      this.isAuthInEbay = false;
      this.toastMessage.set('You must log in to eBay first');
      this.toastVisible.set(true);
      this.cdr.detectChanges();
      return;
    }
    this.isLoading1 = true;

    const skuValue = product.sku && product.sku.trim() !== ''
      ? product.sku
      : this.generateUniqueSku();

    const titleValue = product.itemDescription
      ? product.itemDescription.substring(0, 80)
      : 'Untitled Item';

    const payload = {
      'sku': skuValue,
      'title': titleValue,
      'description': product.itemDetails,
      'brand': this.selectedBrand,
      'quantity': Number(this.selectedQuantity),
      'condition': this.selectedCondition ?? 'NEW',
      'imageUrls': (() => {
        const imageUrls = this.selectedImagesToEbay.map(img => img.imageUrl);

        while (imageUrls.length < 8) {
          imageUrls.push(imageUrls[imageUrls.length - 1]);
        }

        return imageUrls;
      })(),

      'price': Number(product?.basePrice),
      'currency': "USD",
      'fulfillmentPolicyId': '373826822023',
      'paymentPolicyId': '373648989023',
      'returnPolicyId': '373648988023',
      'categoryId': this.selectedCategory,
      'upc': product.upc,
      'ebayOfferID': ''
    };

    console.log(payload)
    this.PublishingByEbay = true;
    this.http.posteData(`Ebay/PublishDropShippingProduct/${token}`, payload).subscribe({
      next: () => {
        this.toastMessage.set('Product published successfully (Drop Shipping)');
        this.toastVisible.set(true);
      },

      error: (err) => {
        this.PublishingByEbay = false;
        console.error(err);
        let errorMessage = 'Unknown error';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else {
            errorMessage = JSON.stringify(err.error, null, 2);
          }
        }
        if (err.status === 400) {
          alert(errorMessage);
        }
        this.toastMessage.set('Error republishing product');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    });
    // } else {
    //   //this.updateProductOnEbay(product)
    // }

  }

  generateUniqueSku(): string {
    return 'SKU-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  goToEditItem(item: any) {
    this.router.navigate(['./add-edit-item'], {
      relativeTo: this.route,
      state: { item }
    });
  }

}
