
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

import { HttpConnectService } from '../../../Services/http-connect.service';

interface TariffModel {
  taarefId?: number;
  platform_id: number | null;
  tariffType: number | null;
  isActive: boolean;
}

interface TariffDetailModel {
  tariffDetailsId?: number;
  taarefId?: number;
  service_id: number | null;
  shippingListId: number | null;
  itemId: number | null;
  currencyId: number | null;
  unitId: number | null;
  price: number | null;
  isActive: boolean;
}

@Component({
  selector: 'app-add-edit-tariff',
  templateUrl: './Add-ShippingTaarefs.html',
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
    RouterLink
  ]
})
export class AddEditTariffComponent implements OnInit {

  tariff: TariffModel = {
    platform_id: null,
    tariffType: null,
    isActive: true
  };

  // One detail only
  detail: TariffDetailModel = this.createEmptyDetail();

  platforms: any[] = [];
  services: any[] = [];
  shippingLists: any[] = [];
  items: any[] = [];
  currencies: any[] = [];
  units: any[] = [];

  loading = false;
  loadingDetails = false;

  message = '';

  idForEdit?: number;

  businessId?: number;

  // 1 = Service, 2 = Product
  readonly tariffTypes = {
    service: 1,
    product: 2
  };

  private readonly api = {
    platforms: 'Platform',
    services: 'Service',
    shippingLists: 'ShippingList',
    items: 'Item',
    currencies: 'Currency',
    units: 'Unit',

    tariffs: 'ShippingTaaref',

    tariffDetails: 'ShippingTaaref/AddTariffDetails',

    loadTariffDetails: 'ShippingTaaref/GetTaarefDetails'
  };

  constructor(
    private http: HttpConnectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.businessId = Number(localStorage.getItem('businessId'));

    this.loadPlatforms();
    this.loadServices();
    this.loadShippingLists();
    this.loadItems();
    this.loadCurrencies();
    this.loadUnits();

    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.idForEdit = Number(id);

      this.loadTariff(this.idForEdit);
      this.loadTariffDetails(this.idForEdit);
    }
  }

  // Empty detail

  createEmptyDetail(): TariffDetailModel {

    return {
      service_id: null,
      shippingListId: null,
      itemId: null,
      currencyId: null,
      unitId: null,
      price: null,
      isActive: true
    };
  }

  // Tariff type getters

  get isServiceTariff(): boolean {

    return this.tariff.tariffType === this.tariffTypes.service;

  }

  get isProductTariff(): boolean {

    return this.tariff.tariffType === this.tariffTypes.product;

  }

  // Load dropdown data

  loadPlatforms(): void {

    this.http.getAllData<any[]>(
      this.api.platforms + '/' + this.businessId
    ).subscribe({

      next: res => {
        this.platforms = res || [];
      },

      error: error => {
        console.error('Failed to load platforms:', error);
      }

    });

  }

  loadServices(): void {

    this.http.getAllData<any[]>(
      this.api.services + '/' + this.businessId
    ).subscribe({

      next: res => {
        this.services = res || [];
      },

      error: error => {
        console.error('Failed to load services:', error);
      }

    });

  }

  loadShippingLists(): void {

    this.http.getAllData<any[]>(
      this.api.shippingLists
    ).subscribe({

      next: res => {
        this.shippingLists = res || [];
      },

      error: error => {
        console.error('Failed to load shipping lists:', error);
      }

    });

  }

  loadItems(): void {

    this.http.getAllData<any[]>(
      this.api.items + '/' + this.businessId
    ).subscribe({

      next: res => {
        this.items = res || [];
      },

      error: error => {
        console.error('Failed to load products:', error);
      }

    });

  }

  loadCurrencies(): void {

    this.http.getAllData<any[]>(
      this.api.currencies
    ).subscribe({

      next: res => {
        this.currencies = res || [];
      },

      error: error => {
        console.error('Failed to load currencies:', error);
      }

    });

  }

  loadUnits(): void {

    this.http.getAllData<any[]>(
      this.api.units
    ).subscribe({

      next: res => {
        this.units = res || [];
      },

      error: error => {
        console.error('Failed to load units:', error);
      }

    });

  }

  // Load main tariff for editing

  loadTariff(id: number): void {

    this.loading = true;

    this.http.getAllData<any>(
      `${this.api.tariffs}/${id}`
    ).subscribe({

      next: res => {

        if (!res) {
          this.message = 'Tariff not found';
          this.loading = false;
          return;
        }

        this.tariff = {

          taarefId: res.taarefId ?? res.TaarefId,

          platform_id:
            res.platform_id ??
            res.Platform_id ??
            res.platformId ??
            res.PlatformId ??
            null,

          tariffType:
            res.tariffType ??
            res.TariffType ??
            null,

          isActive:
            res.isActive ??
            res.IsActive ??
            true

        };

        this.loading = false;

      },

      error: error => {

        console.error(error);

        this.message = 'Failed to load tariff';

        this.loading = false;

      }

    });

  }

  // Load the single tariff detail

  loadTariffDetails(id: number): void {

    this.loadingDetails = true;

    this.http.getAllData<any>(
      `${this.api.loadTariffDetails}/${id}`
    ).subscribe({

      next: res => {

        // Backend currently returns FirstOrDefaultAsync,
        // but also support an array response.

        const item = Array.isArray(res)
          ? res[0]
          : res;

        if (!item) {

          this.detail = this.createEmptyDetail();

          this.loadingDetails = false;

          return;
        }

        this.detail = {

          tariffDetailsId:
            item.tariffDetailsId ??
            item.TariffDetailsId,

          taarefId:
            item.taarefId ??
            item.TaarefId,

          service_id:
            item.service_id ??
            item.Service_id ??
            null,

          shippingListId:
            item.shippingListId ??
            item.ShippingListId ??
            null,

          itemId:
            item.itemId ??
            item.ItemId ??
            null,

          currencyId:
            item.currencyId ??
            item.CurrencyId ??
            null,

          unitId:
            item.unitId ??
            item.UnitId ??
            null,

          price:
            item.price ??
            item.Price ??
            null,

          isActive:
            item.isActive ??
            item.IsActive ??
            true

        };

        this.loadingDetails = false;

      },

      error: error => {

        console.error(error);

        this.message = 'Failed to load tariff detail';

        this.loadingDetails = false;

      }

    });

  }

  // Validate the single detail

  validateDetail(): boolean {

    if (this.isServiceTariff) {

      if (this.detail.service_id == null) {

        this.message = 'Please select a Service';

        return false;

      }

      if (this.detail.shippingListId == null) {

        this.message = 'Please select a Shipping List';

        return false;

      }

    }

    if (this.isProductTariff) {

      if (this.detail.itemId == null) {

        this.message = 'Please select a Product';

        return false;

      }

    }

    if (this.detail.currencyId == null) {

      this.message = 'Please select a Currency';

      return false;

    }

    if (this.detail.unitId == null) {

      this.message = 'Please select a Unit';

      return false;

    }

    if (
      this.detail.price == null ||
      !Number.isFinite(this.detail.price) ||
      this.detail.price < 0
    ) {

      this.message = 'Please enter a valid Price';

      return false;

    }

    return true;

  }

  // Prepare detail payload

  createDetailPayload(tariffId: number): any {

    return {

      TaarefId: tariffId,

      Service_id: this.isServiceTariff
        ? this.detail.service_id
        : null,

      ShippingListId: this.isServiceTariff
        ? this.detail.shippingListId
        : null,

      ItemId: this.isProductTariff
        ? this.detail.itemId
        : null,

      CurrencyId: this.detail.currencyId,

      UnitId: this.detail.unitId,

      Price: this.detail.price,

      IsActive: this.detail.isActive

    };

  }

  // Save tariff and its single detail

  saveTariff(): void {

    this.message = '';

    if (this.loading || this.loadingDetails) {
      return;
    }

    if (this.tariff.platform_id == null) {

      this.message = 'Please select a Platform';

      return;

    }

    if (this.tariff.tariffType == null) {

      this.message = 'Please select Tariff Type';

      return;

    }

    if (!this.validateDetail()) {
      return;
    }

    this.loading = true;

    const tariffPayload = {

      PlatformId: this.tariff.platform_id,

      TariffType: this.tariff.tariffType,

      IsActive: this.tariff.isActive

    };

    // Edit existing tariff
    if (this.idForEdit) {

      this.updateTariff(tariffPayload);

      return;

    }

    // Create new tariff
    this.createTariff(tariffPayload);

  }

  // Create main tariff first

  createTariff(payload: any): void {

    this.http.posteData(
      this.api.tariffs,
      payload
    ).subscribe({

      next: (res: any) => {

        const tariffId =
          res?.taarefId ??
          res?.TaarefId ??
          res?.id ??
          res?.Id;

        if (tariffId == null) {

          this.loading = false;

          this.message =
            'Tariff was created but TaarefId was not returned';

          return;

        }

        // After creating the main tariff,
        // save its single detail directly.

        this.saveTariffDetail(Number(tariffId));

      },

      error: error => {

        console.error(error);

        this.message =
          error?.error?.message ||
          'Failed to create tariff';

        this.loading = false;

      }

    });

  }

  // Save exactly one detail

  saveTariffDetail(tariffId: number): void {

    const detailPayload = this.createDetailPayload(tariffId);

    this.http.posteData(
      this.api.tariffDetails,
      detailPayload
    ).subscribe({

      next: () => {

        this.loading = false;

        this.router.navigate(['/Home/shipping-taaref']);

      },

      error: error => {

        console.error(error);

        this.message =
          error?.error?.message ||
          'Tariff was created, but saving its detail failed';

        this.loading = false;

      }

    });

  }

  // Update existing main tariff
  // This endpoint must exist in your backend.

  updateTariff(payload: any): void {

    this.http.putData(
      `${this.api.tariffs}/${this.idForEdit}`,
      payload
    ).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/Home/shipping-taaref']);
      },
      error: error => {
        console.error(error);
        this.message =
          error?.error?.message ||
          'Failed to update tariff';
        this.loading = false;
      }
    });
  }
}
