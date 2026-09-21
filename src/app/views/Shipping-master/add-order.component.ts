import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ShippingService, PackageSubmission } from './shipping.service';
import { CustomerModel, customerAddress } from './customer.model';
import { UnitModel } from './unit.model';

type SearchStatus = 'idle' | 'found' | 'notFound';

/**
 * حالة طرد واحد قيد الإدخال — تطابق PackageDraft في shipping_controller.dart:
 * نوعه، وزنه/عدده، وصورته، بحالة مستقلة عن باقي الطرود.
 */
interface PackageDraft {
  selectedUnit: UnitModel | null;
  weightValue: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  /** يُملأ بعد نجاح رفع الصورة — يسمح بإعادة محاولة الحفظ بدون إعادة رفع الصور الناجحة */
  imageUrl: string | null;
}

interface Toast {
  kind: 'info' | 'success' | 'error';
  message: string;
}

function emptyDraft(defaultUnit: UnitModel | null): PackageDraft {
  return {
    selectedUnit: defaultUnit,
    weightValue: defaultUnit?.name === 'BOX' ? '1' : '',
    imageFile: null,
    imagePreviewUrl: null,
    imageUrl: null,
  };
}

@Component({
  selector: 'app-shipping-master-add-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
})
export class ShippingMasterAddOrderComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  firstChar = '';
  customerCode = '';

  isSearching = false;
  isSubmitting = false;
  isLoadingUnits = false;

  searchStatus: SearchStatus = 'idle';
  customer: CustomerModel | null = null;

  units: UnitModel[] = [];
  packageDrafts: PackageDraft[] = [emptyDraft(null)];

  toast: Toast | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingCaptureIndex: number | null = null;

  constructor(
    private shipping: ShippingService,
    private router: Router,
     private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchFirstCharacter();
    this.fetchUnits();
  }

  customerAddress(): string {
    return this.customer ? customerAddress(this.customer) : '—';
  }

  private fetchFirstCharacter(): void {
    this.shipping.getFirstCharacter().subscribe({
      next: (firstChar) => {
        this.firstChar = firstChar ?? '';
        this.customerCode = this.firstChar;
        this.cdr.detectChanges()
      },
      error: () => this.showToast('error', 'تعذر جلب كود العميل الافتراضي'),
    });
  }

  private fetchUnits(): void {
    this.isLoadingUnits = true;
    this.shipping.getUnits().subscribe({
      next: (units) => {
        this.units = units;
        this.isLoadingUnits = false;
        if (units.length > 0) {
          for (const draft of this.packageDrafts) {
            if (!draft.selectedUnit) {
              draft.selectedUnit = units[0];
            }
          }
        }
        this.cdr.detectChanges()
      },
      error: () => {
        this.isLoadingUnits = false;
        this.showToast('error', 'تعذر جلب أنواع الطرود');
      },
    });
  }


  onCustomerCodeInput(rawValue: string): void {
    let digitsOnly: string;
    if (rawValue.startsWith(this.firstChar)) {
      digitsOnly = rawValue.substring(this.firstChar.length);
    } else {
      digitsOnly = rawValue;
    }
    digitsOnly = digitsOnly.replace(/[^0-9]/g, '');
    this.customerCode = this.firstChar + digitsOnly;
  }

  searchCustomer(): void {
    const code = this.customerCode.trim();
    if (!code || code === this.firstChar) {
      this.showToast('info', 'الرجاء إدخال كود العميل');
      return;
    }

    this.isSearching = true;
    this.searchStatus = 'idle';
    this.customer = null;

    this.shipping.searchCustomer(code).subscribe({
      next: (customer) => {
        this.isSearching = false;
        this.searchStatus = 'found';
        this.customer = customer;
        this.cdr.detectChanges()
        this.resetPackageDrafts();
        this.cdr.detectChanges()
      },
      error: () => {
        this.isSearching = false;
        this.searchStatus = 'notFound';
        this.customer = null;
      },
    });
  }

  private resetPackageDrafts(): void {
    const defaultUnit = this.units.length > 0 ? this.units[0] : null;
    this.packageDrafts = [emptyDraft(defaultUnit)];
  }

  resetForm(): void {
    this.customerCode = this.firstChar;
    this.customer = null;
    this.searchStatus = 'idle';
    this.resetPackageDrafts();
  }

  addPackageDraft(): void {
    const defaultUnit = this.units.length > 0 ? this.units[0] : null;
    this.packageDrafts.push(emptyDraft(defaultUnit));
  }

  removePackageDraft(index: number): void {
    if (this.packageDrafts.length <= 1) return;
    const draft = this.packageDrafts[index];
    if (draft.imagePreviewUrl) URL.revokeObjectURL(draft.imagePreviewUrl);
    this.packageDrafts.splice(index, 1);
  }

  selectUnitForDraft(index: number, unit: UnitModel): void {
    const draft = this.packageDrafts[index];
    draft.selectedUnit = unit;
    draft.weightValue = unit.name === 'BOX' ? '1' : '';
  }

  needsWeightField(draft: PackageDraft): boolean {
    return draft.selectedUnit?.name !== 'BOX';
  }


  triggerCapture(index: number): void {
    this.pendingCaptureIndex = index;
    this.fileInputRef.nativeElement.value = '';
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const index = this.pendingCaptureIndex;
    this.pendingCaptureIndex = null;
    if (!file || index === null) return;

    const draft = this.packageDrafts[index];
    if (draft.imagePreviewUrl) URL.revokeObjectURL(draft.imagePreviewUrl);
    draft.imageFile = file;
    draft.imagePreviewUrl = URL.createObjectURL(file);
    draft.imageUrl = null; // صورة جديدة تحتاج رفع من جديد
  }

  removeCapturedImage(index: number): void {
    const draft = this.packageDrafts[index];
    if (draft.imagePreviewUrl) URL.revokeObjectURL(draft.imagePreviewUrl);
    draft.imageFile = null;
    draft.imagePreviewUrl = null;
    draft.imageUrl = null;
  }


  async addNewOrder(): Promise<void> {
    if (this.isSubmitting) return;
    if (this.packageDrafts.length === 0) {
      this.showToast('info', 'أضف طرد واحد على الأقل');
      return;
    }
    if (!this.customer) {
      this.showToast('info', 'ابحث عن عميل أولاً');
      return;
    }

    for (let i = 0; i < this.packageDrafts.length; i++) {
      const draft = this.packageDrafts[i];
      const orderNumber = i + 1;

      if (!draft.selectedUnit) {
        this.showToast('info', `اختر نوع الطرد رقم ${orderNumber}`);
        return;
      }
      if (!draft.weightValue.trim()) {
        this.showToast('info', `أدخل الوزن أو العدد للطرد رقم ${orderNumber}`);
        return;
      }
      if (Number.isNaN(parseFloat(draft.weightValue.trim()))) {
        this.showToast('error', `قيمة غير صحيحة في الطرد رقم ${orderNumber}`);
        return;
      }
      if (!draft.imageFile && !draft.imageUrl) {
        this.showToast('info', `التقط صورة للطرد رقم ${orderNumber}`);
        return;
      }
    }

    this.isSubmitting = true;

    for (const draft of this.packageDrafts) {
      if (draft.imageUrl) continue;
      try {
        const url = await firstValueFrom(this.shipping.uploadImage(draft.imageFile as File));
        draft.imageUrl = url;
      } catch {
        this.isSubmitting = false;
        this.showToast('error', 'فشل رفع صورة أحد الطرود');
        return; 
      }
    }

    const packages: PackageSubmission[] = this.packageDrafts.map((d) => ({
      unitId: d.selectedUnit!.unitId,
      value: parseFloat(d.weightValue.trim()),
      imageUrl: d.imageUrl,
    }));

    this.shipping.addOrder(this.customer.id, packages).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showToast('success', 'تم حفظ الطلب بنجاح');
        this.resetForm();
      },
      error: () => {
        this.isSubmitting = false;
        this.showToast('error', 'حدث خطأ أثناء حفظ الطلب');
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/shipping-master');
  }

  private showToast(kind: Toast['kind'], message: string): void {
    this.toast = { kind, message };
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }
}
