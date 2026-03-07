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
import { InventoryModel } from '../../../Models/InventoryModel';

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
    ButtonDirective,
    ProgressComponent,
    ToasterComponent,
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
  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'));
    this.getInventory()
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
          size: item.size
        }));
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

  ShowScrape(itemId?: number) {
    this.ImagesUrlsFromScrape = [];
    this.idItemForBindWithImages = itemId;
    this.skuToScrapeByAinAlfhd = this.inventory.find(inv => inv.item?.itemId === itemId)?.item?.sku || '';
    console.log('Selected Item ID for Scraping:', this.idItemForBindWithImages);
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

  skuToScrapeByAinAlfhd: string = '';
  Msg: string = 'No results found for the provided SKU.';
  showMsg: boolean = false;
  scrapeItemFromAinAlfhd() {
    this.showMsg = false;
    console.log('Scraping SKU from AinAlfhd:', this.skuToScrapeByAinAlfhd);
    this.isLoading = true;
    this.http.getAllData(`Item/getItemFromAinAlfhdDB/${this.skuToScrapeByAinAlfhd}`).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.ImagesUrlsFromScrape = res as string[];
        console.log('Scraped Images from AinAlfhd:', this.ImagesUrlsFromScrape);
        this.showMsg = true
        this.cdr.detectChanges();
      },(error) =>{
        this.isLoading = false;
        
        console.error('Error scraping from AinAlfhd:', error);
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
}
