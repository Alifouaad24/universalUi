import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
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
  ToastHeaderComponent,
  ButtonModule
} from '@coreui/angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { BusinessType } from '../../../Models/Business/BusinessType';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { Country } from '../../../Models/CountryModel';
import { ServiceModel } from '../../../Models/ServiceModel';
import { InventoryModel } from '../../../Models/InventoryModel';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { AppConstants } from '../../../shared/constant';

@Component({
  selector: 'app-button-groups',
  templateUrl: './Show-inventory.html',
  imports: [RowComponent, ColComponent, CardComponent, IconModule, ModalModule,
    CardHeaderComponent, CardBodyComponent, ButtonGroupComponent,
    ButtonDirective, ReactiveFormsModule,
    FormCheckLabelDirective, ButtonToolbarComponent,
    InputGroupComponent, InputGroupTextDirective, RouterLink, RouterOutlet,
    FormControlDirective, DropdownComponent, FormsModule, CommonModule,
    DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective,
    ButtonDirective, ImageCropperComponent,
    ProgressComponent,
    ToasterComponent, ButtonModule,
    ToastComponent,
    ToastHeaderComponent,

    ToastBodyComponent]
})
export class ShowInventoryComponent implements OnInit {

  inventory: InventoryModel[] = [];
  message?: string
  isLoading: boolean = false;
  showScrapeModal: boolean = false;
  selectedType?: InventoryModel;
  ImagesUrlsFromScrape: string[] = [];
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  businessId?: number;
  sourceCode: string = '';
  priceFromScrape: string = '';
  productNameFromScrape: string = '';
  SizeId: number | null = null;
  CategoryId: number | null = null;
  Categories?: any[]
  Sizes?: any[]
  notFound: boolean = false;
  notFoundMsg: string = 'Item not found. You can try to scrape it or set it as not found.';
  tempInventory: InventoryModel[] = [];
  skuToScrapeByAinAlfhd: string = '';
  Msg: string = 'No results found for the provided SKU.';
  showMsg: boolean = false;
  SKUFOREDIT: string = '';
  isLoadingScrape = false;
  defaultBusinessLogo = AppConstants.DEFAULT_BUSINESS_LOGO;

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'));
    this.getInventory()
    this.getCategories()
    this.getSizes()
  }

  getCategories() {
    this.http.getAllData('Category').subscribe((res: any) => {
      console.log(res)
      this.Categories = res;
    })
  }

  getSizes() {
    this.http.getAllData('Size').subscribe((res: any) => {
      console.log(res)
      this.Sizes = res;
    })
  }
  getInventory() {
    this.isLoading = true;
    this.http.getAllData(`Inventory/${this.businessId}`).subscribe(
      (res: any) => {
        console.log(res);
        this.inventory = (res as any[]).map(item => new InventoryModel({
          inventory_id: item.inventory_id,
          item: item.item,
          platform: item.platform,
          folderImages: item.folderImages,
          size_id: item.size_id,
          category_id: item.category_id,
          size: item.size,
          qty: item.qty,
          notFound: item.notFound
        }));
        this.tempInventory = [...this.inventory];
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

  idItemForBindWithImages?: number;
  fullFkuToScrapeByAinAlfhd?: string;
  currentInventoryId?: number;
  ShowScrape(itemId?: number, inventoryId?: number) {
    this.showMsg = false
    this.ImagesUrlsFromScrape = [];
    this.idItemForBindWithImages = itemId;
    this.fullFkuToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.sku || '';
    this.skuToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.sku || '';

    console.log('Selected Item ID for Scraping:', this.idItemForBindWithImages);
    console.log('Selected Inventory ID for Scraping:', inventoryId);
    this.currentInventoryId = inventoryId;
    this.showScrapeModal = true;
  }


  onVisibleChange(visible: boolean) {
    this.showScrapeModal = false;
    this.idItemForBindWithImages = undefined;
    this.toastVisible.set(visible);
    if (!visible) this.percentage.set(0);
  }

  onTimerChange(value: number) {
    this.percentage.set(value * 25);
  }



  getImagesFromScrape() {
    if (!this.sourceCode.trim()) {
      this.toastMessage.set('Please paste the source code to scrape.');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading = true;
    var formData = new FormData();
    var file = new File([this.sourceCode], 'sourceCode.html', { type: 'text/html' });
    formData.append('htmlFile', file);
    this.http.posteData(`Scraper/getImagesFromShein`, formData, true).subscribe(
      (res: any) => {
        this.sourceCode = '';
        this.ImagesUrlsFromScrape = res.images as string[];
        this.priceFromScrape = res.price;
        this.productNameFromScrape = res.name;
        console.log(this.ImagesUrlsFromScrape);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.toastMessage.set('Error scraping the source code. Please ensure it is valid HTML.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }

  SaveImagesForItem() {
    if (!this.idItemForBindWithImages) {
      this.toastMessage.set('No item selected for binding images.');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading = true;

    const payLoad = {
      itemId: this.idItemForBindWithImages,
      ImagesUrls: this.ImagesUrlsFromScrape
    }

    console.log('Payload for binding images:', payLoad);
    this.http.posteData(`Item/BindImagesWithItem`, payLoad).subscribe(
      (res: any) => {
        this.isLoading = false;
        console.log('res: ', res);
        this.AddPriceAndTitle()
        this.toastMessage.set('Images successfully bound to the item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.toastMessage.set('Error binding images to the item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }

  AddPriceAndTitle() {
    if (!this.currentInventoryId) {
      this.toastMessage.set('No item selected for adding price and title.');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading = true;
    const payLoad = {
      Price: this.priceFromScrape,
      Title: this.productNameFromScrape
    }

    console.log('Payload for adding price and title:', payLoad);
    this.http.putData(`Inventory/AddPriceTitleToInv/${this.currentInventoryId}`, payLoad).subscribe(
      (res: any) => {
        this.isLoading = false;
        console.log('res: ', res);
        this.getInventory()
        this.toastMessage.set('Price and title successfully added to the item.');
        this.toastVisible.set(true);
        this.priceFromScrape = '';
        this.productNameFromScrape = '';
        this.showScrapeModal = false;
        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.toastMessage.set('Error adding price and title to the item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }


  showFactoryImagesModal = false;
  factoryImages: string[] = [];



  ShowFactoryImages(itemId?: number) {
    const factoryImagesTemp = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.images || [];
    this.factoryImages = factoryImagesTemp.map((img: any) => img.imageUrl);
    console.log('Factory Images for Item ID', itemId, ':', this.factoryImages);
    this.showFactoryImagesModal = true;

  }

  removeImage(index: number) {
    this.ImagesUrlsFromScrape.splice(index, 1);
  }

  scrapeItemFromAinAlfhd() {
    this.showMsg = false;
    console.log('Scraping SKU from AinAlfhd:', this.skuToScrapeByAinAlfhd);
    this.isLoadingScrape = true;
    this.http.getAllData(`Item/getItemFromAinAlfhdDB/${this.skuToScrapeByAinAlfhd}`).subscribe(
      (res: any) => {
        this.isLoadingScrape = false;
        this.ImagesUrlsFromScrape = res as string[];
        console.log('Scraped Images from AinAlfhd:', this.ImagesUrlsFromScrape);
        if (this.ImagesUrlsFromScrape.length == 0) {
          this.showMsg = true
          this.Msg = 'No results found for the provided SKU.';
          this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
      }, (error) => {
        this.isLoadingScrape = false;
        console.error('Error scraping from AinAlfhd:', error);
        this.showMsg = true
        this.Msg = 'Error scraping from AinAlfhd. Please try again later.';
        this.cdr.detectChanges();

      }
    );
  }

  removeImageFromDb(imageUrl: string) {
    this.isLoading = true;
    const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    this.http.deleteData(`ItemImages/${imageName}`).subscribe(
      (res: any) => {
        this.isLoading = false;
        console.log('res: ', res);
        this.factoryImages = this.factoryImages.filter(url => url !== imageUrl);
        this.toastMessage.set('Image successfully removed from the item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.toastMessage.set('Error removing image from the item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }


  filterInventory(event: any) {
    this.inventory = [...this.tempInventory];
    const filterValue = event.target.value;
    if (filterValue === 'Unprocessed') {
      this.inventory = this.inventory.filter(inv => !inv.item?.images || inv.item.images.length === 1);
    } else if (filterValue === 'NotFound') {
      this.inventory = this.inventory.filter(inv => inv.notFound);
    }
    else {
      this.inventory = [];
      this.getInventory();
      this.cdr.detectChanges();
    }
  }

  setInvItemNotFound() {
    if (!this.currentInventoryId) {
      this.toastMessage.set('No item selected to set as not found.');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading = true;
    this.http.putData(`Inventory/${this.currentInventoryId}`, {}).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toastMessage.set('Item successfully set as not found.');
        this.toastVisible.set(true);
        this.inventory.map(inv => {
          if (inv.inventory_id === this.currentInventoryId) {
            inv.notFound = true;
          } return inv;
        });
        this.currentInventoryId = undefined;
        this.showScrapeModal = false;
        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.toastMessage.set('Error setting item as not found.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }

  ShowEditModal(inventoryId?: number, categoryId?: number, sizeId?: number, sku?: string) {
    this.currentInventoryId = inventoryId;
    this.SizeId = sizeId || null;
    this.CategoryId = categoryId || null;
    this.SKUFOREDIT = sku || '';
    this.showEditModal = true;
  }


  showEditModal = false;
  EditInventoryItem() {
    if (!this.currentInventoryId) {
        
      this.toastMessage.set('No inventory item selected for editing.');
      this.toastVisible.set(true);
      return;
    }
    // if (!this.CategoryId || !this.SizeId) {

    //   this.toastMessage.set('Please select both category and size.');
    //   this.toastVisible.set(true);
    //   return;
    // }
    this.isLoading = true;
    const payload = {
      CategoryId: this.CategoryId,
      SizeId: this.SizeId,
      SKU: this.SKUFOREDIT
    };
    console.log('Payload for editing inventory item:', payload);
    this.http.putData(`Inventory/AddCategoryAndSizeToInv/${this.currentInventoryId}`, payload).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toastMessage.set('Inventory item successfully updated.');
        this.toastVisible.set(true);
        this.showEditModal = false;
        this.CategoryId = null;
        this.SizeId = null;
        this.SKUFOREDIT = '';
        this.cdr.detectChanges();
        this.getInventory();
      },
      (err) => {
        this.isLoading = false;
        this.toastMessage.set('Error updating inventory item.');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
      }
    );
  }
  imagesForCurrentAlbum: string = '';
  showAlbumImages() {
    const albumImages = this.inventory.find(inv => inv.item?.itemId === this.idItemForBindWithImages)?.item?.images || [];
    this.imagesForCurrentAlbum = albumImages[0]?.imageUrl || '';
    this.openModal(this.imagesForCurrentAlbum);
  }
  modalVisible: boolean = false;
  closeModal() {
    this.modalVisible = false;
  }

  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  translateH = 0;
  translateV = 0;
  isDragging = false;
  startX = 0;
  startY = 0;
  currentImageBase64: string = '';
  croppedImage: string | null = null;
  rotation = 0;

  openModal(url: string) {
    const imgUrl = url;
    if (!imgUrl) return;

    this.convertImageToBase64(imgUrl).then(base64 => {
      this.currentImageBase64 = base64;
      this.croppedImage = base64;
      this.modalVisible = true;

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }

  convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) reject('Cannot get canvas context');
        ctx!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = err => reject(err);
      img.src = url;
    });
  }





  transform = {
    scale: this.zoom,
    translateH: this.translateH,
    translateV: this.translateV
  };


  updateTransform() {
    this.transform = {
      scale: this.zoom,
      translateH: this.translateH,
      translateV: this.translateV
    };
  }
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    this.translateH += dx;
    this.translateV += dy;

    this.startX = event.clientX;
    this.startY = event.clientY;

    this.updateTransform();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  zoomIn() {
    this.zoom += 0.1;

    this.updateTransform();
  }

  zoomOut() {
    if (this.zoom == 1) return;
    this.zoom = Math.max(0.1, this.zoom - 0.1);
    this.updateTransform();
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = event.base64;
    } else if (event.blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.croppedImage = reader.result as string;
      };
      reader.readAsDataURL(event.blob);
    }
  }

  rotateImage() {
    console.log('rotate');
    this.rotation = (this.rotation + 1) % 4;
  }

}
