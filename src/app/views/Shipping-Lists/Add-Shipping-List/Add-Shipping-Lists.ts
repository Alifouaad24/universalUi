
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router';

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';

// غيّر أسماء الخصائص حسب الـ Models الموجودة عندك إذا لزم الأمر
interface ShippingListModel {
  id?: string | number;
  fromCountryId?: string | number;
  toCountryId?: string | number;
  currencyId?: string | number;
  shippingTypeId?: string | number;
  isActive: boolean;
}

@Component({
  selector: 'app-add-edit-shipping-list',
  templateUrl: './Add-Shipping-List.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CommonModule,
    FormsModule,
    RouterOutlet,
    ButtonDirective,
    IconDirective,
    RouterLink
  ]
})
export class AddEditShippingListComponent implements OnInit {

  shippingList: ShippingListModel = {
    fromCountryId: undefined,
    toCountryId: undefined,
    currencyId: undefined,
    shippingTypeId: undefined,
    isActive: true
  };

  countries: any[] = [];
  currencies: any[] = [];
  shippingTypes: any[] = [];

  message: string = '';
  loading: boolean = false;
  idForEdit?: string | number;

  // ضع مسارات الـ API الفعلية هنا
  private readonly api = {
    countries: 'Country',
    currencies: 'Currency',
    shippingTypes: 'ShippingTypes',
    getShippingList: 'YOUR_GET_SHIPPING_LIST_API',
    createShippingList: 'ShippingList',
    updateShippingList: 'YOUR_UPDATE_SHIPPING_LIST_API'
  };

  constructor(
    private http: HttpConnectService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCountries();
    this.loadCurrencies();
    this.loadShippingTypes();

    // في حال التعديل
    const shippingListStr =
      this.route.snapshot.queryParamMap.get('shippingList');

    if (shippingListStr) {
      try {
        const data = JSON.parse(shippingListStr);

        this.shippingList = {
          ...this.shippingList,
          ...data
        };

        this.idForEdit = data.id;
      } catch (error) {
        console.error('Invalid ShippingList data:', error);
      }
    } else {
      // في حال تم تمرير ID فقط
      const id = this.route.snapshot.queryParamMap.get('id');

      if (id) {
        this.idForEdit = id;
        this.loadShippingList(id);
      }
    }
  }

  // جلب الدول
  loadCountries(): void {
    this.http.getAllData(this.api.countries).subscribe({
      next: (res: any) => {
        this.countries = res;
      },
      error: (error: any) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  // جلب العملات
  loadCurrencies(): void {
    this.http.getAllData(this.api.currencies).subscribe({
      next: (res: any) => {
        this.currencies = res;
      },
      error: (error: any) => {
        console.error('Error loading currencies:', error);
      }
    });
  }

  // جلب أنواع الشحن
  loadShippingTypes(): void {
    this.http.getAllData(this.api.shippingTypes).subscribe({
      next: (res: any) => {
        this.shippingTypes = res;
      },
      error: (error: any) => {
        console.error('Error loading shipping types:', error);
      }
    });
  }

  // جلب Shipping List عند التعديل باستخدام ID
  loadShippingList(id: string | number): void {
    this.loading = true;

    this.http.getAllData(`${this.api.getShippingList}/${id}`).subscribe({
      next: (res: any) => {
        this.shippingList = {
          ...this.shippingList,
          ...res
        };

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading shipping list:', error);
        this.message = 'Failed to load shipping list';
        this.loading = false;
      }
    });
  }

  // إضافة أو تعديل Shipping List
  saveShippingList(): void {
    this.message = '';

    if (!this.shippingList.fromCountryId) {
      this.message = 'Please select the source country';
      return;
    }

    if (!this.shippingList.toCountryId) {
      this.message = 'Please select the destination country';
      return;
    }

    if (this.shippingList.fromCountryId === this.shippingList.toCountryId) {
      this.message = 'Source and destination countries cannot be the same';
      return;
    }

    if (!this.shippingList.currencyId) {
      this.message = 'Please select a currency';
      return;
    }

    if (!this.shippingList.shippingTypeId) {
      this.message = 'Please select a shipping type';
      return;
    }

    this.loading = true;

    if (this.idForEdit) {
      this.updateShippingList();
    } else {
      this.createShippingList();
    }
  }

  // إضافة Shipping List
  createShippingList(): void {
    this.http.posteData(
      this.api.createShippingList,
      this.shippingList
    ).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.router.navigate(['/Home/shipping-lists']);
      },
      error: (error: any) => {
        console.error('Error creating shipping list:', error);
        this.message =
          error?.error?.message || 'Failed to create shipping list';
        this.loading = false;
      }
    });
  }

  // تعديل Shipping List
  updateShippingList(): void {
    this.http.putData(
      `${this.api.updateShippingList}/${this.idForEdit}`,
      this.shippingList
    ).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.router.navigate(['/Home/shipping-lists']);
      },
      error: (error: any) => {
        console.error('Error updating shipping list:', error);
        this.message =
          error?.error?.message || 'Failed to update shipping list';
        this.loading = false;
      }
    });
  }

}
