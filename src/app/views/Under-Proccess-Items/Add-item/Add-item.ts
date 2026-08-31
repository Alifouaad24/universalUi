import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { LoadingService } from '../../../core/Services/LoadingService';
import { PlatformModel } from '../../../Models/PlatformModel';

interface SelectedImage {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-item.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditItemComponent implements OnInit, AfterViewInit {
  UPC: string = '';
  message: string = '';
  loading: boolean = false;
  Platforms?: PlatformModel[];
  selectedPlatformId?: number;
  payLoadItem: any[] = [];
  @ViewChild('upcInput') upcInput!: ElementRef<HTMLInputElement>;

  // حقول ItemDto
  ItemDescription: string = '';
  ItemDetails: string = '';
  sku: string = '';
  upc: string = '';
  InternetId: string = '';
  BasePrice: number | null = null;
  CategoryId: number | null = null;
  SizeId: number | null = null;
  UnitId: number | null = null;
  PlatformId: number | null = null;
  ColorId: number | null = null;
  CurrencyId: number | null = null;
  UnitValue: number | null = null;
  Model: string = '';
  Height: number | null = null;
  Width: number | null = null;
  Length: number | null = null;

  isEditMode: boolean = false;
  editingItemId: number | null = null;
  existingImages: any[] = [];
  deletedExistingImageIds: number[] = [];


  // ✅ الصور: ملفات فعلية بدل روابط نصية
  selectedImages: SelectedImage[] = [];

  // قوائم Lookup
  Categories: any[] = [];
  Sizes: any[] = [];
  Units: any[] = [];
  Colors: any[] = [];
  Currencies: any[] = [];

  businessId?: number;

  constructor(
    private http: HttpConnectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loader: LoadingService
  ) { }

  ngAfterViewInit(): void {
    this.upcInput?.nativeElement.focus();
  }

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'));

    // ⚠️ ملاحظة: getAllPlatforms() و getPlatforms() الاثنين يعبّون Platforms
    // من endpoint مختلف — الثاني بيلغي نتيجة الأول (تكرار). أبقيته كما هو
    // بالكود الأصلي بدون تعديل لأنه غير مذكور بالطلب، لكن يستحق المراجعة لاحقاً.
    this.getAllPlatforms();
    this.getPlatforms();

    this.getCategories();
    this.getSizes();
    this.getUnits();
    this.getColors();
    this.getCurrencies();

    const nav = this.router.getCurrentNavigation();
    const item = nav?.extras?.state?.['item'] ?? history.state?.item;

    if (item) {
      this.isEditMode = true;
      this.fillFormFromItem(item);
    }
  }

   fillFormFromItem(item: any) {
    this.editingItemId = item.itemId ?? null;
    this.ItemDescription = item.itemDescription ?? '';
    this.ItemDetails = item.itemDetails ?? '';
    this.sku = item.sku ?? '';
    this.upc = item.upc ?? '';
    this.InternetId = item.internetId ?? '';
    this.BasePrice = item.basePrice ?? null;
    this.CategoryId = item.categoryId ?? item.category?.category_id ?? null;
    this.SizeId = item.sizeId ?? item.size?.size_id ?? null;
    this.UnitId = item.unitId ?? item.unit?.unit_id ?? null;
    this.PlatformId = item.platformId ?? item.platform?.platform_id ?? null;
    this.ColorId = item.colorId ?? item.color?.color_id ?? null;
    this.CurrencyId = item.currencyId ?? item.currency?.currencyId ?? null;
    this.UnitValue = item.unitValue ?? null;
    this.Model = item.model ?? '';
    this.Height = item.height ?? null;
    this.Width = item.width ?? null;
    this.Length = item.length ?? null;

    this.existingImages = item.images ?? [];
  }

  removeExistingImage(img: any) {
    if (img.itemImageId) {
      this.deletedExistingImageIds.push(img.itemImageId);
    }
    this.existingImages = this.existingImages.filter(i => i !== img);
  }

  UpdateItem() {
    this.loading = true;

    if (!this.ItemDescription) {
      this.message = 'Please enter item description';
      this.loading = false;
      return;
    }
    if (!this.PlatformId) {
      this.message = 'Please select a platform';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('ItemId', this.editingItemId!.toString());
    formData.append('ItemDescription', this.ItemDescription);
    formData.append('ItemDetails', this.ItemDetails || '');
    formData.append('sku', this.sku || '');
    formData.append('upc', this.upc || '');
    formData.append('businessId', localStorage.getItem('businessId')!);
    formData.append('InternetId', this.InternetId || '');
    if (this.BasePrice != null) formData.append('BasePrice', this.BasePrice.toString());
    if (this.CategoryId != null) formData.append('CategoryId', this.CategoryId.toString());
    if (this.SizeId != null) formData.append('SizeId', this.SizeId.toString());
    if (this.UnitId != null) formData.append('UnitId', this.UnitId.toString());
    formData.append('PlatformId', this.PlatformId.toString());
    if (this.ColorId != null) formData.append('ColorId', this.ColorId.toString());
    if (this.CurrencyId != null) formData.append('CurrencyId', this.CurrencyId.toString());
    if (this.UnitValue != null) formData.append('UnitValue', this.UnitValue.toString());
    formData.append('Model', this.Model || '');
    if (this.Height != null) formData.append('Height', this.Height.toString());
    if (this.Width != null) formData.append('Width', this.Width.toString());
    if (this.Length != null) formData.append('Length', this.Length.toString());

    if (this.deletedExistingImageIds.length > 0) {
      formData.append('DeletedImageIds', JSON.stringify(this.deletedExistingImageIds));
    }

    this.selectedImages.forEach(img => {
      formData.append('Images', img.file);
    });

    this.http.putData(`Item/${this.editingItemId}`, formData).subscribe({
      next: () => {
        this.message = 'Item updated successfully';
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.message = 'An error occurred while updating the item';
        this.loading = false;
      }
    });
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

  // ---------------------------------------------------------------------
  // إدارة الصور (رفع ملفات فعلية)
  // ---------------------------------------------------------------------
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      this.selectedImages.push({ file, previewUrl });
    });

    input.value = ''; // يسمح باختيار نفس الملف مرة ثانية إذا حُذف بالغلط
  }

  removeImageField(index: number) {
    URL.revokeObjectURL(this.selectedImages[index].previewUrl);
    this.selectedImages.splice(index, 1);
  }

  // ---------------------------------------------------------------------
  // إضافة الآيتم — يرسل FormData ليتوافق مع [FromForm] بالباك إند
  // ---------------------------------------------------------------------
  AddItem() {
    this.loading = true;

    if (!this.ItemDescription) {
      this.message = 'Please enter item description';
      this.loading = false;
      return;
    }

    if (!this.PlatformId) {
      this.message = 'Please select a platform';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('ItemDescription', this.ItemDescription);
    formData.append('ItemDetails', this.ItemDetails || '');
    formData.append('sku', this.sku || '');
    formData.append('upc', this.upc || '');
    formData.append('businessId', localStorage.getItem('businessId')!)
    formData.append('InternetId', this.InternetId || '');
    if (this.BasePrice != null) formData.append('BasePrice', this.BasePrice.toString());
    if (this.CategoryId != null) formData.append('CategoryId', this.CategoryId.toString());
    if (this.SizeId != null) formData.append('SizeId', this.SizeId.toString());
    if (this.UnitId != null) formData.append('UnitId', this.UnitId.toString());
    formData.append('PlatformId', this.PlatformId.toString());
    if (this.ColorId != null) formData.append('ColorId', this.ColorId.toString());
    if (this.CurrencyId != null) formData.append('CurrencyId', this.CurrencyId.toString());
    if (this.UnitValue != null) formData.append('UnitValue', this.UnitValue.toString());
    formData.append('Model', this.Model || '');
    if (this.Height != null) formData.append('Height', this.Height.toString());
    if (this.Width != null) formData.append('Width', this.Width.toString());
    if (this.Length != null) formData.append('Length', this.Length.toString());


    // إرفاق ملفات الصور الفعلية — الاسم "Images" يطابق حقل ItemDto.Images
    this.selectedImages.forEach(img => {
      formData.append('Images', img.file);
    });

    this.http.posteData('Item', formData).subscribe({
      next: (res: any) => {
        this.message = 'Item added successfully';
        this.loading = false;
        this.resetForm();
      },
      error: (error) => {
        console.error(error);
        this.message = 'An error occurred while adding the item';
        this.loading = false;
      },
    });
  }

  private resetForm() {
    this.ItemDescription = '';
    this.ItemDetails = '';
    this.sku = '';
    this.upc = '';
    this.InternetId = '';
    this.BasePrice = null;
    this.CategoryId = null;
    this.SizeId = null;
    this.UnitId = null;
    this.PlatformId = null;
    this.ColorId = null;
    this.CurrencyId = null;
    this.UnitValue = null;
    this.Model = '';
    this.Height = null;
    this.Width = null;
    this.Length = null;

    this.selectedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    this.selectedImages = [];
  }

  // ---------------------------------------------------------------------
  // منطق قديم لإضافة عدة UPCs دفعة واحدة (مبقّى كما هو بدون تعديل)
  // ---------------------------------------------------------------------
  addListItems() {
    if (!this.UPC) {
      this.message = 'Please fill in all required fields.';
      return;
    }
    if (this.payLoadItem.find(item => item.upc === this.UPC)) {
      this.UPC = '';
      return;
    }
    this.payLoadItem.push({
      upc: this.UPC,
      platformId: this.selectedPlatformId
    });

    this.UPC = '';
    if (this.upcInput) {
      this.upcInput.nativeElement.focus();
    }
  }

  SaveItems() {
    this.message = 'Items added successfully!';
    if (this.payLoadItem.length === 0) {
      this.message = 'No items to save.';
      return;
    }
    // this.loader.show();
    // this.http.posteData('Item/AddItemFromWeb', this.payLoadItem).subscribe(res => {
    //   this.loader.hide();
    //   this.payLoadItem = [];
    //   this.message = 'Items added successfully!';
    // }, (error) => {
    //   console.error(error)
    //   this.loader.hide();
    // })
  }
}