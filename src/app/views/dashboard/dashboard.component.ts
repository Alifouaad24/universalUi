import { ChangeDetectorRef, Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonCloseDirective,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  FormModule,
  GutterDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { BusinessModel } from '../../Models/Business/BusinessModel';
import { BusinessContextService } from '../../core/Services/business-context.service';
import { Router } from '@angular/router';
import { AlbumStateService } from '../../core/Services/countOfFolders';
import { CommonModule } from '@angular/common';
import { HttpConnectService } from '../../Services/http-connect.service';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

interface CustomerGroup {
  customerId: number;
  customerName: string;
  customerImage: string;
  customerMobile: string;
  ordersCount: number;
  orders: any[];
}

interface ComplaintType {
  complaintTypeId: number;
  name: string;
}

interface Cause {
  causeId: number;
  causeName: string;
}



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [WidgetsDropdownComponent, CardComponent, CardBodyComponent,
    RowComponent, ColComponent, ButtonDirective, IconDirective,
    ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective,
    ChartjsComponent, CardFooterComponent, GutterDirective, ProgressComponent, CommonModule, FormModule,
    WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent,
    BadgeComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ButtonDirective,
    FormsModule
  ]
})


export class DashboardComponent implements OnInit {
  user?: any = JSON.parse(localStorage.getItem('currentUser') || '{}');
  userName = this.user?.userName || 'Guest';
  businesses: BusinessModel[] = [];
  currentBusiness: any;
  showCRMActions = false;
  showCountOfFolders = false;
  businessName: string = ''
  orders: any[] = []
  groupedCustomers: CustomerGroup[] = [];
  selectedCustomer: CustomerGroup | null = null;
  services: any[] = [];

  newComplaint = {
    serviceId: null as number | null,   // ← جديد
    complaintTypeId: null as number | null,
    value: '',
    description: '',
    causeId: null as number | null,
  };

  modalVisible = false;
  modalView: 'customerOrders' | 'orderDetails' = 'customerOrders';


  constructor(private businessCtx: BusinessContextService, private cdr: ChangeDetectorRef, private albumState: AlbumStateService,
    private router: Router, private http: HttpConnectService) { }

  ngOnInit(): void {

    this.initCharts();
    this.updateChartOnColorModeChange();
    this.businesses = this.businessCtx.getBusinesses();
    this.businessCtx.getCurrentBusiness().subscribe(b => {
      this.currentBusiness = b;
      this.businessName = this.currentBusiness.business_name
      if (this.businessName == 'The Geist ') {
        this.getTheGeistOrders()
        this.getComplaintTypes();
        this.getCauses();
        this.getServices();
      }
      console.log(this.businessName)
    });
  }

  getServices() {
    this.http.getAllData('Service/40').subscribe((res: any) => {
      this.services = res;
    });
  }

  getTheGeistOrders() {
    this.http.getAllData('Orders/40').subscribe((res: any) => {
      this.orders = res;
      this.groupOrdersByCustomer();
    });
  }

  private groupOrdersByCustomer() {
    const map = new Map<number, CustomerGroup>();

    for (const order of this.orders) {
      const customer = order.customer;
      const customerId = customer?.globalCustomerId ?? order.globalCustomerId;
      if (!customerId) continue;

      if (!map.has(customerId)) {
        map.set(customerId, {
          customerId,
          customerName: customer?.customerName ?? 'بدون اسم',
          customerImage: customer?.customerImage ?? 'assets/images/avatars/default.png',
          customerMobile: customer?.customerMobile ?? '',
          ordersCount: 0,
          orders: [],
        });
      }

      const group = map.get(customerId)!;
      group.ordersCount++;
      group.orders.push(order);
    }

    this.groupedCustomers = Array.from(map.values());
  }

  openCustomerOrders(customer: CustomerGroup) {
    this.selectedCustomer = customer;
    this.modalView = 'customerOrders';
    this.modalVisible = true;
  }



  getStatusColor(status: any): string {
    switch (status?.statusEn?.toLowerCase()?.trim()) {
      case 'pending': return 'warning';
      case 'confirmed':
      case 'in progress': return 'info';
      case 'completed':
      case 'delivered': return 'success';
      case 'cancelled':
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  }

  backToCustomerOrders() {
    this.selectedOrder = null;
    this.modalView = 'customerOrders';
  }


  closeModal() {
    this.modalVisible = false;
    this.selectedCustomer = null;
    this.selectedOrder = null;
    this.modalView = 'customerOrders';
  }

  selectedOrder: any = null;

  openOrderDetails(order: any) {
    this.selectedOrder = order;
    this.modalView = 'orderDetails'; // فقط تبديل المحتوى، بدون setTimeout ولا إغلاق/فتح مودال جديد
  }


  selectBusiness(b: any) {
    this.currentBusiness = b;
    this.businessCtx.setCurrentBusiness(b);
  }

  // complaint logic

  complaintModalVisible = false;
  selectedDetail: any = null; // GlobalOrderDetail المختار حالياً لإضافة شكوى له

  complaintTypes: ComplaintType[] = [];
  causes: Cause[] = [];
  submittingComplaint = false;





  getComplaintTypes() {
    this.http.getAllData('ComplaintTypes').subscribe((res: any) => {
      this.complaintTypes = res;
    });
  }

  getCauses() {
    this.http.getAllData('Cause').subscribe((res: any) => {
      this.causes = res;
    });
  }


  // فتح مودال إضافة/عرض شكوى لتفصيل (Detail) معيّن
  openComplaintModal(detail: any | null = null) {
    this.selectedDetail = detail;
    this.resetNewComplaintForm();

    if (detail?.complaint) {
      const existing = detail.complaint?.complaint_Value;
      this.newComplaint = {
        serviceId: detail.service?.service_id ?? null,
        complaintTypeId: existing?.complaintTypeId ?? existing?.complaintType?.complaintTypeId ?? null,
        value: existing?.value ?? '',
        description: existing?.description ?? '',
        causeId: detail.causeId ?? detail.cause?.causeId ?? null,
      };
    }

    this.complaintModalVisible = true;
  }


  closeComplaintModal() {
    this.complaintModalVisible = false;
    this.selectedDetail = null;
  }

  resetNewComplaintForm() {
    this.newComplaint = { serviceId: null, complaintTypeId: null, value: '', description: '', causeId: null };
  }



  submitComplaint() {
    const hasExistingDetail = !!this.selectedDetail;
    const requiredFieldsOk = this.newComplaint.complaintTypeId && this.newComplaint.causeId
      && (hasExistingDetail || this.newComplaint.serviceId); // بدون detail، الخدمة إجبارية

    if (!requiredFieldsOk || !this.selectedOrder) return;

    this.submittingComplaint = true;

    if (hasExistingDetail) {
      // ------- الحالة القديمة: تفصيل موجود مسبقاً -------
      const payload = {
        complaintTypeId: this.newComplaint.complaintTypeId,
        value: this.newComplaint.value,
        description: this.newComplaint.description,
        causeId: this.newComplaint.causeId,
      };

      this.http.posteData(
        `GlobalOrderDetails/${this.selectedDetail.globalOrderDetailId}/AddComplaint`,
        payload
      ).subscribe({
        next: (updatedDetail: any) => {
          const idx = this.selectedOrder.globalOrderDetail.findIndex(
            (d: any) => d.globalOrderDetailId === this.selectedDetail.globalOrderDetailId
          );
          if (idx > -1) this.selectedOrder.globalOrderDetail[idx] = updatedDetail;
          else this.selectedOrder.globalOrderDetail.push(updatedDetail);

          this.submittingComplaint = false;
          this.closeComplaintModal();
        },
        error: () => { this.submittingComplaint = false; },
      });

    } else {
      // ------- الحالة الجديدة: لا يوجد تفصيل، ننشئ واحداً مع الشكوى -------
      const payload = {
        globalOrderId: this.selectedOrder.globalOrderId,
        serviceId: this.newComplaint.serviceId,
        complaintTypeId: this.newComplaint.complaintTypeId,
        value: this.newComplaint.value,
        description: this.newComplaint.description,
        causeId: this.newComplaint.causeId,
      };

      this.http.posteData(
        'GlobalOrderDetails/CreateWithComplaint',
        payload
      ).subscribe({
        next: (newDetail: any) => {
          if (!this.selectedOrder.globalOrderDetail) {
            this.selectedOrder.globalOrderDetail = [];
          }
          this.selectedOrder.globalOrderDetail.push(newDetail);

          this.submittingComplaint = false;
          this.closeComplaintModal();
        },
        error: () => { this.submittingComplaint = false; },
      });
    }
  }





  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/images/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/images/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/images/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/images/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/images/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });



  initCharts(): void {
    this.mainChartRef()?.stop();
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}
