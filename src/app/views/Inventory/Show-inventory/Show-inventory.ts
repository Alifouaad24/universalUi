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
import { StorageService } from '../../../core/Services/StorageService';
import { BusinessModel } from '../../../Models/Business/BusinessModel';

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
  showScrapeDutyModal: boolean = false;
  selectedType?: InventoryModel;
  ImagesUrlsFromScrape: string[] = [];
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);
  businessId?: number;
  currentBusiness?: BusinessModel;
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
  UPCFOREDIT: string = '';
  isLoadingScrape = false;
  CategoryIdForScrape?: number;
  defaultBusinessLogo = AppConstants.DEFAULT_BUSINESS_LOGO;
  height: string = ''
  width: string = ''
  length: string = ''
  desc?: string
  Model?: string
  Internet?: string
  Brand?: string
  Dimention?: string
  SKU?: string
  weight: string = ''
  DetailsModalVisible: boolean = false;
  currentBusinessName: string = 'Business';
  itemConditions?: any[]
  ItemConditionId: number | null = null;
  UPCFromScrape: string = '';

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef, private storage: StorageService) { }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'));
    this.currentBusiness = JSON.parse(localStorage.getItem('currentBusiness') || 'null');
    console.log('Current MY Business:', this.currentBusiness);
    this.currentBusinessName = this.currentBusiness?.business_name ?? 'Business';
    this.getInventory()
    this.getCategories()
    this.getSizes()
    this.getPlatforms()
    this.getItemConditions()
  }

  getItemConditions() {
    this.http.getAllData(`ItemCondition`).subscribe((res: any) => {
      console.log(res)
      this.itemConditions = res;
    })
  }

  getCategories() {
    this.http.getAllData(`Category/${this.businessId}`).subscribe((res: any) => {
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
          platform_id: item.platform_id,
          category_id: item.category_id,
          size: item.size,
          sku: item.sku,
          sitePrice: item.sitePrice,
          qty: item.qty,
          status: item.status,
          category: item.category,
          notFound: item.notFound,
          Product_name: item.product_name,
          product_description: item.product_description,
          itemCondition: item.itemCondition
        }));
        this.tempInventory = [...this.inventory];
        this.isLoading = false;
        this.selectedFilter = 'All';
        this.cdr.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this.message = 'Error loading data';
        this.cdr.detectChanges();
      }
    );
  }
  PlatformId: number | null = null;
  Platforms?: any[]
  getPlatforms() {
    this.http.getAllData(`Platform/${this.businessId}`).subscribe((res: any) => {
      console.log(res)
      this.Platforms = res;
      if (this.Platforms && this.Platforms.length > 0) {
        this.PlatformId = this.Platforms[0].platform_id;
      }
    })
  }

  platform?: string;
  idItemForBindWithImages?: number;
  fullFkuToScrapeByAinAlfhd?: string;
  currentInventoryId?: number;
  fullUPCToScrapeByAinAlfhd?: string
  ShowScrape(itemId?: number, inventoryId?: number, platform?: string) {
    console.log(platform);
    if (platform == 'SHEIN') {
      this.platform = platform;
      this.showMsg = false
      this.ImagesUrlsFromScrape = [];
      this.idItemForBindWithImages = itemId;
      this.fullFkuToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.sku || 'no sku';
      this.skuToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.sku || '';

      console.log('Selected Item ID for Scraping:', this.idItemForBindWithImages);
      console.log('Selected Inventory ID for Scraping:', inventoryId);
      this.currentInventoryId = inventoryId;
      this.showScrapeModal = true;
    } else if (platform == 'Home Depot') {
      this.showScrapeDutyModal = true;
      this.showMsg = false
      this.currentInventoryId = inventoryId;
      this.ImagesUrlsFromScrape = [];
      this.idItemForBindWithImages = itemId;
      this.fullUPCToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.upc ?? 'no upc';
      this.skuToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.upc || 'no upc';
      console.log('Selected Item ID for Scraping:', this.idItemForBindWithImages);
      console.log('Selected Inventory ID for Scraping:', inventoryId);
    }


  }


  // onVisibleChange(visible: boolean) {
  //   this.showScrapeModal = false;
  //   this.idItemForBindWithImages = undefined;
  //   this.toastVisible.set(visible);
  //   if (!visible) this.percentage.set(0);
  // }
  onVisibleChange(visible: boolean) {
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
        if (err.status === 400) {
          this.toastMessage.set('change shein website currency to $ USD and try again.');
          console.error('Error scraping from Shein:', err.error);

        } else {
          this.toastMessage.set('Error scraping the source code. Please ensure it is valid HTML.');
        }
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
      Title: this.productNameFromScrape,
      categoryId: this.CategoryIdForScrape,
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
        this.CategoryIdForScrape = undefined;
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
        this.inventory = this.inventory.map(inv => {
          if (inv.item?.images) {
            inv.item.images = inv.item.images.filter((img: any) => img.imageUrl !== imageUrl);
          } return inv;
        });
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

  selectedFilter: string = 'All';
  filterInventory(event: any) {
    this.inventory = [...this.tempInventory];

    const filterValue = event.target.value;
    this.selectedFilter = filterValue;
    if (filterValue === 'Unprocessed') {
      this.inventory = this.inventory.filter(inv => !inv.item?.images || inv.item.images.length === 1 && !inv.notFound);
    } else if (filterValue === 'NotFound') {
      this.inventory = this.inventory.filter(inv => inv.notFound);
    }
    else {
      this.inventory = [];
      this.getInventory();
      this.cdr.detectChanges();
    }
  }
  selectedDutyFilter: string = 'All';
  filterDutyInventory(event: any) {
    this.inventory = [...this.tempInventory];

    const filterValue = event.target.value;
    this.selectedDutyFilter = filterValue;
    if (filterValue === 'needUpdates') {
      this.inventory = this.inventory.filter(inv => !inv.category == null ||
         inv.itemCondition == null || inv.sitePrice?.replace(/\$/g, '') != inv.item?.basePrice);
    } else if (filterValue === 'published') {
      this.inventory = this.inventory.filter(inv => inv.status?.includes('Published') );
    }
    else if (filterValue === 'unpublished') {
      this.inventory = this.inventory.filter(inv => inv.status == null );
    }
    else if (filterValue === 'needScrape') {
      this.inventory = this.inventory.filter(inv => !inv.item?.images || inv.item.images.length === 1);
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

  PriceFOREDIT: string = '';

  ShowEditModal(inventoryId?: number, categoryId?: number, sizeId?: number, sku?: string, upc?: string, price?: string, platformId?: number) {
    this.currentInventoryId = inventoryId;
    this.SizeId = sizeId || null;
    this.CategoryId = categoryId || null;
    this.PlatformId = platformId || null;
    this.SKUFOREDIT = sku || '';
    this.UPCFOREDIT = upc || '';
    this.PriceFOREDIT = price || '';
    this.showEditModal = true;
  }


  showEditModal = false;
  EditInventoryItem() {
    if (!this.currentInventoryId) {

      this.toastMessage.set('No inventory item selected for editing.');
      this.toastVisible.set(true);
      return;
    }

    this.isLoading = true;
    const realPrice = this.PriceFOREDIT.trim().replace(/\$/g, '').length > 0 ? this.PriceFOREDIT.replace(/\$/g, '') + '$' : undefined;
    const payload = {
      CategoryId: this.CategoryId,
      SizeId: this.SizeId,
      SKU: this.SKUFOREDIT,
      upc: this.UPCFOREDIT,
      price: realPrice,
      platformId: this.PlatformId,
      itemCondition: this.ItemConditionId

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

  getImagesFromScrapeForDuty() {
    if (!this.sourceCode.trim()) {
      this.toastMessage.set('Please paste the source code to scrape.');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading = true;
    var formData = new FormData();
    var file = new File([this.sourceCode], 'sourceCode.html', { type: 'text/html' });
    formData.append('file', file);
    this.http.posteData(`Scraper/HomeDepotFileHtmlAnalyse`, formData, true).subscribe(
      (res: any) => {
        this.sourceCode = '';
        this.ImagesUrlsFromScrape = res.images as string[];
        this.priceFromScrape = res.price;
        this.UPCFromScrape = res.upc;
        this.productNameFromScrape = res.title;
        this.height = res.height
        this.width = res.width
        this.length = res.length
        this.desc = res.desc
        this.weight = res.weight
        this.Model = res.model
        this.Internet = res.internet
        this.Brand = res.brand
        this.Dimention = res.dimention
        this.SKU = res.sKU
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
    this.cdr.detectChanges();
  }

  SaveItemForDuty() {
    if (!this.idItemForBindWithImages) {
      this.toastMessage.set('No item selected for binding images.');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading = true;

    const payLoad = {
      itemId: this.idItemForBindWithImages,
      ImagesUrls: this.ImagesUrlsFromScrape,
      title: this.productNameFromScrape,
      description: this.desc,
      brand: this.Brand,
      price: parseFloat(this.priceFromScrape) ?? 0,
      height: parseFloat(this.height) ?? 0,
      width: parseFloat(this.width) ?? 0,
      length: parseFloat(this.length) ?? 0,
      model: this.Model,
      weight: parseFloat(this.weight) ?? 0,
      internet: this.Internet,
      sKU: this.SKU,
      upc: this.UPCFromScrape,
      currentInventoryId: this.currentInventoryId

    }

    console.log('Payload for binding images:', payLoad);
    this.http.posteData(`Item/BindImagesWithItemForDuty`, payLoad).subscribe(
      (res: any) => {
        this.isLoading = false;
        console.log('res: ', res);
        this.toastMessage.set('Images successfully bound to the item.');
        this.toastVisible.set(true);
        this.showScrapeDutyModal = false
        this.getInventory();
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

  ShowDetailsModal(inventory: InventoryModel) {
    this.selectedImagesToEbay = [];
    this.selectedType = inventory;
    this.DetailsModalVisible = true;
    inventory.item.images.map((el: any) => {
      if (el.isPublishedOnEbay) {
        this.selectedImagesToEbay.push(el)
      }
    })
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

  // جلب رقم الصورة
  getImageIndex(image: any): number {
    return this.selectedImagesToEbay.findIndex(i => i.imageUrl === image.imageUrl) + 1;
  }

  // هل الصورة مختارة؟
  isSelected(image: any): boolean {
    return this.selectedImagesToEbay.some(i => i.imageUrl === image.imageUrl);
  }

  ///// Ebay /////////////////////////////////////
  ///////////////////////////////////////////////
  rePublishByEbay(product: any) {
    const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
    if (!token) {
      // this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
      return;
    }
    this.isLoading1 = true;

    const imageUrls: string[] = product.item.itemImages
      .filter((img: any) => img.imageSourceLink && img.imageSourceLink.trim() !== '').slice(0, 7)
      .map((img: any) => img.imageSourceLink);

    const skuValue = product.item.sku && product.item.sku.trim() !== ''
      ? product.item.sku
      : this.generateUniqueSku();

    const titleValue = product.item.engName
      ? product.item.engName.substring(0, 80)
      : 'Untitled Item';

    const payload = {
      'sku': skuValue,
      'title': titleValue,
      'description': product.item?.arDesc ?? product.item.engName,
      'brand': product.item.make.makeDescription,
      'quantity': Number(product.qty),
      'condition': product.itemCondetion?.description ?? 'NEW',
      'imageUrls': imageUrls,
      'price': Number(product.sellingprice ?? product.item.sitePrice),
      'currency': "USD",
      'fulfillmentPolicyId': '373826822023',
      'paymentPolicyId': '373648989023',
      'returnPolicyId': '373648988023',
      'categoryId': (product.item?.category?.ebayCategoryId).toString(),
      'upc': product.item.upc,
      'ebayOfferID': product.ebayInvID

    };

    console.log(payload)

    this.http.posteData(`Ebay/publish-product/${token}`, payload).subscribe({
      next: () => {
        // this.toastr.success('تم نشر المنتج بنجاح');
        this.toastMessage.set('Product republished successfully');
        this.toastVisible.set(true);
        product.status = "Auto Published"
        this.isLoading1 = false;

      },
      error: (err) => {
        this.isLoading1 = false;

        // this.toastr.error('حدث خطأ أثناء نشر المنتج الرجاء المحاولة مجددًا');
        this.toastMessage.set('Error republishing product');
        this.toastVisible.set(true);
        console.error(err);
      }
    });

  }

  PublishingByEbay: boolean = false;

  isLoading1: boolean = false;
  generateUniqueSku(): string {
    return 'SKU-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }


  PublishByEbay(product: any) {
    if (!this.selectedImagesToEbay || this.selectedImagesToEbay.length === 0) {
      this.toastMessage.set('Please select at least one image to publish the product on eBay.');
      this.toastVisible.set(true);
      this.cdr.detectChanges();
      return;
    }
    if (product.ebayInvID == null || product.ebayInvID == '') {
      const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
      if (!token) {
        // this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
        this.toastMessage.set('You must log in to eBay first');
        this.toastVisible.set(true);
        this.cdr.detectChanges();
        return;
      }
      this.isLoading1 = true;

      const skuValue = product.item.sku && product.item.sku.trim() !== ''
        ? product.item.sku
        : this.generateUniqueSku();

      const titleValue = product.Product_name
        ? product.Product_name.substring(0, 80)
        : 'Untitled Item';

      const payload = {
        'sku': skuValue,
        'title': titleValue,
        'description': product.product_description,
        'brand': product.item.brand,
        'quantity': Number(product.qty),
        'condition': product.itemCondition?.description ?? 'NEW',
        'imageUrls': this.selectedImagesToEbay.map(img => img.imageUrl),
        'price': Number(product.sitePrice.replace('$', '').trim()) ?? product.item?.basePrice,
        'currency': "USD",
        'fulfillmentPolicyId': '373826822023',
        'paymentPolicyId': '373648989023',
        'returnPolicyId': '373648988023',
        'categoryId': (product.category?.ebayCategoryId).toString(),
        'upc': product.item.upc,
        'ebayOfferID': product.ebayInvID

      };

      console.log(payload)
      this.PublishingByEbay = true;
      this.http.posteData(`Ebay/publish-product/${token}`, payload).subscribe({
        next: () => {
          // this.toastr.success('تم نشر المنتج بنجاح');
          this.toastMessage.set('Product republished successfully');
          this.toastVisible.set(true);
          product.status = "Auto Published"
          this.PublishingByEbay = false;
          this.cdr.detectChanges();

        },
        error: (err) => {
          this.PublishingByEbay = false;

          // this.toastr.error('حدث خطأ أثناء نشر المنتج الرجاء المحاولة مجددًا');
          this.toastMessage.set('Error republishing product');
          this.toastVisible.set(true);
          console.error(err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.updateProductOnEbay(product)
    }

  }

  updateProductOnEbay(product: any) {
    const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
    if (!token) {
      //this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
      this.toastMessage.set('You must log in to eBay first');
      this.toastVisible.set(true);
      return;
    }
    this.isLoading1 = true;

    const imageUrls: string[] = product.item.itemImages
      .filter((img: any) => img.imageSourceLink && img.imageSourceLink.trim() !== '').slice(0, 7)
      .map((img: any) => img.imageSourceLink);

    const skuValue = product.item.sku && product.item.sku.trim() !== ''
      ? product.item.sku
      : this.generateUniqueSku();

    const titleValue = product.item.engName
      ? product.item.engName.substring(0, 80)
      : 'Untitled Item';

    const payload = {
      'sku': skuValue,
      'title': titleValue,
      'description': product.product_description,
      'brand': product.item.brand,
      'quantity': Number(product.qty),
      'condition': product.itemCondition?.description ?? 'NEW',
      'imageUrls': this.selectedImagesToEbay.map(img => img.imageUrl),
      'price': Number(product.sitePrice.replace('$', '').trim()) ?? product.item?.basePrice,
      'currency': "USD",
      'fulfillmentPolicyId': '373826822023',
      'paymentPolicyId': '373648989023',
      'returnPolicyId': '373648988023',
      'categoryId': (product.category?.ebayCategoryId).toString(),
      'upc': product.item.upc,
      'ebayOfferID': product.ebayOfferID
      /////////////////////////////////////////////
    };

    console.log(payload)

    this.http.putData(`Ebay/update-product/${token}`, payload).subscribe({
      next: () => {
        this.isLoading1 = false;

        // this.toastr.info('تم تعديل المنتج بنجاح');
        this.toastMessage.set('Product updated successfully');
        this.toastVisible.set(true);
      },
      error: (err) => {
        this.isLoading1 = false;

        // this.toastr.error('حدث خطأ أثناء تعديل المنتج الرجاء المحاولة مجددًا');
        this.toastMessage.set('Error updating product');
        this.toastVisible.set(true);
        console.error(err);
      }
    });
  }

  loginingInToEbay = false;
  LogInToEbayDiredty(token: string, inputElement: HTMLInputElement) {
    this.loginingInToEbay = true;
    this.http.posteData('Ebay/save-token', {
      'accessToken': token
    }).subscribe(res => {
      console.log(res);
      this.storage.setItem('ebayToken', res.tokenId, 2 * 60 * 60 * 1000) // localStorage.setItem('tokenId', res.tokenId);
      this.toastMessage.set('Token stored successfully');
      this.loginingInToEbay = false;
      this.toastVisible.set(true);
      inputElement.value = '';
    }, (err) => {
      this.toastMessage.set('Failed to store token, please try again');
      this.loginingInToEbay = false;
      this.toastVisible.set(true);
      console.error(err);
    })
  }

  countOfSoldItems: number = 0;
  invIdsSoldOnEbay: { invId: number, qty: number }[] = [];
  isLoading11: boolean = false;
  soldItems: any[] = [];

  GetSoldItems() {
    const token = this.storage.getWithExpiry('ebayToken');
    console.log('Retrieved eBay token:', token);

    if (!token) {
      this.toastMessage.set('You must log in to eBay first');
      this.toastVisible.set(true);
      return;
    }

    this.isLoading11 = true;
    this.http.getAllData(`Ebay/GetSoldItemsAsync/${token}`).subscribe((res: any) => {
      this.soldItems = res
      this.toastMessage.set('Sold items retrieved successfully');
      this.toastVisible.set(true);

      this.countOfSoldItems = res.filter((item: any) =>
        this.isMatchedSku(item)
      ).length;

      this.invIdsSoldOnEbay = res.filter((item: any) =>
        this.isMatchedSku(item)
      ).map((item: any) => {
        const matchingInv = this.inventory.find(inv => inv.sku === item.sku);
        return { invId: matchingInv?.inventory_id, qty: item.quantity };
      });

      this.showSoldPopup = true;
      this.isLoading11 = false;
      this.cdr.detectChanges();

    }, (err) => {
      this.isLoading11 = false;
      this.toastMessage.set('Failed to retrieve sold items \n please login to eBay and try again');
      this.toastVisible.set(true);
    });
  }
  showSoldPopup = false;

  markAsSold() {
    console.log('Inventory IDs to mark as sold:', this.invIdsSoldOnEbay);
    if (this.invIdsSoldOnEbay.length === 0) return;

    this.http.posteData('Inventory/MarkAsSold', {
      invIds: this.invIdsSoldOnEbay
    })
      .subscribe(() => {
        this.toastMessage.set('Items updated successfully');
        this.toastVisible.set(true);
        this.showSoldPopup = false;

      }, () => {
        this.toastMessage.set('Error updating items');
        this.toastVisible.set(true);
      });
  }

  isMatchedSku(item: any): boolean {
    return item.sku &&
      item.sku.trim() !== '' &&
      this.inventory.some(inv => inv.sku === item.sku);
  }


}
