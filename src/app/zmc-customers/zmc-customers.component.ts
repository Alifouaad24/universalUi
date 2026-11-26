import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZmcService } from '../core/Services/zmc.service';

@Component({
  selector: 'app-zmc-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zmc-customers.component.html',
  styleUrl: './zmc-customers.component.scss'
})
export class ZmcCustomersComponent implements OnInit {

  private zmcService: any = inject(ZmcService);
  private cdr = inject(ChangeDetectorRef);

  sessionKey = '';

  customers: any[] = [];
  columns: string[] = [];
  cities: any[] = [];

  loading = false;
  loadingCities = false;
  saving = false;

  loginModal = false;
  addCustomerModal = false;

  search = '';
  errorMessage = '';
  successMessage = '';

  login = {
    username: '',
    password: ''
  };

  customer = this.emptyCustomer();

  private emptyCustomer() {
    return {
      sFullname: '',
      sEmail: '',
      cPhone: '',
      sPhone: '',
      sLogo: '',
      sCusType: '0',
      addBusinessType: 'Individual',

      addCompanyName: '',
      addCompanyAddress: '',
      addCompanyRepresentative: '',
      addCompanyRepresentativesPhoneNumber: '',
      addCompanyDeliveryAddress: '',
      addCompanyRepresentativeForReceipt: '',
      addCompanyReceiversNumber: '',
      addCompanyWarehouse: '',
      addCompanyWarehouseAddress: '',
      addCompanyRepresentativeAtWarehouse: '',
      addCompanyRelatedContactNumber: '',

      sCountry: '1',
      sCity: '',
      sAddress: '',
      sBD: '',
      preferedLang: '0'
    };
  }

  /** تحديث الواجهة بعد أي رد من الـ API */
  private refresh(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.checkSession();
  }

  // Check existing session
  checkSession(): void {

    const key = sessionStorage.getItem('zmc_session');

    if (!key) {
      this.showLogin();
      return;
    }

    this.sessionKey = key;
    this.loading = true;

    this.zmcService.testSession(key).subscribe({
      next: (res: any) => {

        this.loading = false;

        if (res.success) {
          this.loadCustomers();
        } else {
          this.logout();
        }

        this.refresh();
      },
      error: () => {
        this.loading = false;
        this.logout();
        this.refresh();
      }
    });
  }

  showLogin(): void {
    this.loginModal = true;
    this.addCustomerModal = false;
  }

  // Login
  submitLogin(): void {

    if (!this.login.username || !this.login.password)
      return;

    this.loading = true;
    this.errorMessage = '';

    this.zmcService.login(
      this.login.username,
      this.login.password
    ).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res.success && res.sessionKey) {

          this.sessionKey = res.sessionKey;

          sessionStorage.setItem(
            'zmc_session',
            res.sessionKey
          );

          this.loginModal = false;

          this.login.password = '';

          this.loadCustomers();

        } else {
          this.errorMessage =
            res.message || 'Login failed.';
        }

        this.refresh();
      },

      error: (err: any) => {

        this.loading = false;

        this.errorMessage =
          err.error?.message || 'Unable to login.';

        this.refresh();
      }
    });
  }

  // Load customers
  loadCustomers(): void {

    if (!this.sessionKey) {
      this.showLogin();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.zmcService.loadCustomers(
      this.sessionKey,
      this.search
    ).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res?.success === false &&
          res?.message?.toLowerCase().includes('session')) {
          this.logout();
          this.refresh();
          return;
        }

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        this.customers = data;

        if (data.length > 0) {

          const first = data[0];

          this.columns = Array.isArray(first)
            ? first.map((_: any, i: number) => String(i))
            : Object.keys(first);
        } else {
          this.columns = [];
        }

        this.refresh();
      },

      error: (err: any) => {

        this.loading = false;

        if (err.status === 401) {
          this.logout();
          this.refresh();
          return;
        }

        this.errorMessage =
          err.error?.message || 'Failed to load customers.';

        this.refresh();
      }
    });
  }

  // Search
  searchCustomers(): void {
    this.loadCustomers();
  }

  // Open add customer modal
  openAddCustomer(): void {

    this.loadingCities = true;
    this.errorMessage = '';

    // Fetch cities BEFORE opening the modal
    this.zmcService.getCities(
      this.sessionKey,
      this.customer.sCountry
    ).subscribe({

      next: (res: any) => {

        this.loadingCities = false;

        if (res.success && Array.isArray(res.data)) {

          this.cities = res.data;

          this.customer = this.emptyCustomer();

          // Open modal after cities are loaded
          this.addCustomerModal = true;

        } else {
          this.errorMessage =
            res.message || 'Failed to load cities.';
        }

        this.refresh();
      },

      error: (err: any) => {

        this.loadingCities = false;

        if (err.status === 401) {
          this.logout();
          this.refresh();
          return;
        }

        this.errorMessage =
          err.error?.message || 'Failed to load cities.';

        this.refresh();
      }
    });
  }

  // Update logo initial
  updateLogo(): void {

    this.customer.sLogo =
      this.customer.sFullname.trim().charAt(0).toUpperCase();
  }

  // Update phone
  updatePhone(): void {

    this.customer.sPhone =
      this.customer.cPhone.replace(/^\+964/, '');
  }

  // Create customer
  submitCustomer(): void {

    if (!this.customer.sFullname.trim()) {
      this.errorMessage = 'Customer name is required.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.zmcService.createCustomer(
      this.sessionKey,
      this.customer
    ).subscribe({

      next: (res: any) => {

        this.saving = false;

        if (res.success && !res.error) {

          this.addCustomerModal = false;

          this.successMessage =
            res.message || 'Customer created successfully.';

          this.customer = this.emptyCustomer();

          this.loadCustomers();

        } else {
          this.errorMessage =
            res.message || 'Failed to create customer.';
        }

        this.refresh();
      },

      error: (err: any) => {

        this.saving = false;

        if (err.status === 401) {
          this.logout();
          this.refresh();
          return;
        }

        this.errorMessage =
          err.error?.message || 'Failed to create customer.';

        this.refresh();
      }
    });
  }

  closeAddCustomer(): void {
    this.addCustomerModal = false;
    this.customer = this.emptyCustomer();
  }

  // Logout
  logout(): void {

    sessionStorage.removeItem('zmc_session');

    this.sessionKey = '';
    this.customers = [];
    this.columns = [];

    this.addCustomerModal = false;

    this.showLogin();
  }

  // Display table values
  getCellValue(row: any, column: string): any {

    return Array.isArray(row)
      ? row[Number(column)]
      : row[column];
  }


private cell(row: any, key: number): string {
  const v = row?.[key];
  return v == null ? '' : String(v).trim();
}

customerCode(row: any): string {
  return this.cell(row, 0);
}

customerName(row: any): string {
  return this.cell(row, 1);
}

/** ZMC يرجع الرقم بفاصلة في آخره: "+9647721823310," */
customerPhone(row: any): string {
  return this.cell(row, 6).replace(/,+$/, '');
}

customerCity(row: any): string {
  return this.cell(row, 11);
}

/** نتجاهل العناوين الفارغة أو المكتوبة نقاطًا فقط مثل "...." */
customerAddress(row: any): string {
  const address = this.cell(row, 9);
  return /^[.\s]*$/.test(address) ? '' : address;
}

  selectedCustomerId = '';
  uploadingCustomerId = '';
  /** مفتاح العمود الذي يدل على وجود مستند في صف ZMC (ضع الرقم عندما تعرفه) */
  private readonly documentIndex: number | null = null;

  /** العملاء الذين رُفع لهم مستند من هذا المتصفح */
  private uploadedIds = new Set<string>(
    JSON.parse(localStorage.getItem('zmc_uploaded_docs') ?? '[]')
  );

  private markUploaded(customerId: string): void {
    this.uploadedIds.add(customerId);
    localStorage.setItem('zmc_uploaded_docs', JSON.stringify([...this.uploadedIds]));
  }
  // استخراج معرّف العميل من صف الجدول
  /** مفتاح العمود الذي فيه معرّف العميل في صفوف ZMC */
  private readonly customerIdIndex = 0;

  getCustomerId(row: any): string {
    // صفوف ZMC تأتي بمفاتيح رقمية: row[0] يعمل مع المصفوفة والكائن معًا
    const byIndex = row?.[this.customerIdIndex];
    if (byIndex != null && String(byIndex).trim() !== '') {
      return String(byIndex).replace(/<[^>]*>/g, '').trim();
    }

    const value =
      row?.customerId ??
      row?.CustomerId ??
      row?.cusId ??
      row?.CusId ??
      row?.id ??
      row?.Id;

    return value == null ? '' : String(value);
  }

  // التحقق مما إذا كان العميل يملك مستنداً
  

  // فتح نافذة اختيار الملف
  selectDocument(row: any, input: HTMLInputElement): void {
    console.log('ROW:', row);
    const customerId = this.getCustomerId(row);

    if (!customerId) {
      this.errorMessage = 'Customer ID was not found.';
      return;
    }

    this.selectedCustomerId = customerId;
    input.click();
  }

  // رفع الملف المختار
  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.selectedCustomerId) {
      input.value = '';
      return;
    }

    const customerId = this.selectedCustomerId;

    this.uploadingCustomerId = customerId;
    this.errorMessage = '';
    this.successMessage = '';

    this.zmcService.uploadCustomerDocument(
      this.sessionKey,
      customerId,
      file
    ).subscribe({
      next: (res: any) => {
        this.uploadingCustomerId = '';

        if (res?.status === true || res?.data === true || res?.success === true) {
          this.successMessage = 'Document uploaded successfully.';
          if (res?.status === true || res?.data === true || res?.success === true) {
            this.markUploaded(customerId);
            this.successMessage = 'Document uploaded successfully.';
            this.loadCustomers();
          }
        } else {
          this.errorMessage =
            res?.message || 'Failed to upload document.';
        }

        this.selectedCustomerId = '';
        input.value = '';
        this.refresh();
      },

      error: (err: any) => {
        this.uploadingCustomerId = '';
        this.selectedCustomerId = '';
        input.value = '';

        if (err.status === 401) {
          this.logout();
          this.refresh();
          return;
        }

        this.errorMessage =
          err.error?.message || 'Failed to upload document.';

        this.refresh();
      }
    });
  }
  isUploading(row: any): boolean {
    const id = this.getCustomerId(row);
    return !!this.uploadingCustomerId && id === this.uploadingCustomerId;
  }


  /** المفتاح 21 في صف ZMC = عدد المستندات المرفوعة للعميل */
private readonly documentsCountIndex = 21;

documentsCount(row: any): number {
  const n = Number(row?.[this.documentsCountIndex]);
  return Number.isFinite(n) ? n : 0;
}

hasDocument(row: any): boolean {
  return this.documentsCount(row) > 0;
}



}