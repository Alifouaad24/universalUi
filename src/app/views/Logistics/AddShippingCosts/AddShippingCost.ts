import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-buttons',
  templateUrl: './AddShippingCost.html',
  imports: [
    RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddShippingCostComponent implements OnInit {
  message: string = '';
  loading: boolean = false;
  isUpdate: boolean = false;
  // ===== بيانات الدروبداون =====
  weightUnits: any[] = [];
  logistics: any[] = [];
  item: any = null;
  id?: number

  // ===== نموذج الإدخال =====
  model: {
    business_id: number | null;
    weight_UnitId: number | null;
    weight_Value: number | null;
    logisticId: number | null;
    costAmount: number | null;
    saleAmount: number | null;
  } = {
      business_id: null,
      weight_UnitId: null,
      weight_Value: null,
      logisticId: null,
      costAmount: null,
      saleAmount: null
    };

  constructor(
    private http: HttpConnectService, private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // جلب businessId من الكاش (نفس النمط المستخدم بباقي المشروع)
    const businessId = localStorage.getItem('businessId');
    this.model.business_id = businessId ? parseInt(businessId) : null;
    this.getWeightUnits();
    this.getLogistics();

    this.route.queryParamMap.subscribe(params => {
      const itemParam = params.get('item');
      if (itemParam) {
        this.item = JSON.parse(itemParam);
        console.log('Received item:', this.item);
        this.id = this.item.shippingCostId

        this.isUpdate = true
        this.model.weight_Value = this.item.weight_Value;
        this.model.costAmount = this.item.costAmount;
        this.model.saleAmount = this.item.saleAmount;
      }
    });
  }

  getWeightUnits() {
    this.http.getAllData('WeightUnit').subscribe(
      (res: any) => {
        this.weightUnits = res;
        this.model.weight_UnitId = this.item.weight_UnitId;
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error loading weight units', err);
      }
    );
  }

  getLogistics() {
    this.http.getAllData('Logistic').subscribe(
      (res: any) => {
        this.logistics = res;
        this.model.logisticId = this.item.logisticId;
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error loading logistics', err);
      }
    );
  }

  submit() {
    if (this.isUpdate) {
      this.update();
      return
    }
    if (
      !this.model.logisticId ||
      !this.model.weight_UnitId ||
      !this.model.weight_Value ||
      !this.model.costAmount ||
      !this.model.saleAmount
    ) {
      this.message = 'يرجى تعبئة جميع الحقول المطلوبة';
      return;
    }

    this.loading = true;
    this.message = '';

    this.http.posteData('ShippingCost/AddNewLogistic', this.model).subscribe(
      (res: any) => {
        this.loading = false;
        this.message = '✅ تمت الإضافة بنجاح';
        this.resetForm();
        this.cdr.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.message = '❌ حدث خطأ أثناء الإضافة';
        console.error(err);
        this.cdr.detectChanges();
      }
    );
  }

  update() {
    if (
      !this.model.logisticId ||
      !this.model.weight_UnitId ||
      !this.model.weight_Value ||
      !this.model.costAmount ||
      !this.model.saleAmount
    ) {
      this.message = 'يرجى تعبئة جميع الحقول المطلوبة';
      return;
    }

    this.loading = true;
    this.message = '';

    this.http.putData(`ShippingCost/${this.id}`, this.model).subscribe(
      (res: any) => {
        this.loading = false;
        this.message = '✅ تمت الإضافة بنجاح';
        this.cdr.detectChanges();
        this.location.back(); // العودة إلى الصفحة السابقة بعد التحديث
      },
      (err) => {
        this.loading = false;
        this.message = '❌ حدث خطأ أثناء الإضافة';
        console.error(err);
        this.cdr.detectChanges();
      }
    );
  }

  resetForm() {
    this.model = {
      business_id: this.model.business_id, // نحتفظ بالـ Business_id
      weight_UnitId: null,
      weight_Value: null,
      logisticId: null,
      costAmount: null,
      saleAmount: null
    };
  }
}