import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippingService } from './shipping.service';
import { GlobalOrderModel, GlobalOrderDetailModel, statusColor, unitNameFor } from './order.model';
import { UnitModel } from './unit.model';
import { IconComponent } from '@coreui/icons-angular';

@Component({
  selector: 'app-shipping-master-orders-history',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class ShippingMasterOrdersHistoryComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  orders: GlobalOrderModel[] = [];
  units: UnitModel[] = [];
  requesting: boolean = false
  fullImageUrl: string | null = null;
  statusId?: number

  constructor(
    private shipping: ShippingService, private cdr: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      const id = Number(p['statusId']);
      if (id) {
        this.statusId = id
      }
    })
    this.shipping.getUnits().subscribe({
      next: (units) => (this.units = units),
    });
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.shipping.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log(orders)
        this.isLoading = false;
        if (this.statusId) {
          this.orders = this.orders.filter(e => e.orderStatus?.orderStatusId == this.statusId)
        }
        this.cdr.detectChanges()
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل سجل الطرود';
        this.isLoading = false;
      },
    });
  }

  statusColorFor(order: GlobalOrderModel): string {
    return statusColor(order);
  }

  unitNameFor(detail: GlobalOrderDetailModel): string {
    return unitNameFor(detail, this.units);
  }

  customerInitial(order: GlobalOrderModel): string {
    const name = order.customer?.customerName ?? '';
    return name.length > 0 ? name[0] : '?';
  }

  openImage(url?: string): void {
    if (!url) return;
    this.fullImageUrl = url;
  }

  closeImage(): void {
    this.fullImageUrl = null;
  }

  goBack(): void {
    this.router.navigateByUrl('/shipping-master');
  }

  private deliveringIds = new Set<number>();

  isDelivering(orderId: number): boolean {
    return this.deliveringIds.has(orderId);
  }



  orderPendingConfirm: GlobalOrderModel | null = null;



  confirmDeliver(order: GlobalOrderModel) {
    this.orderPendingConfirm = order;
  }

  cancelConfirm() {
    this.orderPendingConfirm = null;
  }

  proceedDeliver() {
    if (this.orderPendingConfirm) {
      this.deliverToRep(this.orderPendingConfirm);
    }
  }

  private deliverToRep(order: GlobalOrderModel) {
    if (this.deliveringIds.has(order.globalOrderId)) return;

    this.deliveringIds.add(order.globalOrderId);
    this.shipping.deliverToRep(order.globalOrderId).subscribe({
      next: (res) => {
        if (res.orderStatus) {
          order.orderStatus = res.orderStatus;
        }
        this.deliveringIds.delete(order.globalOrderId);
        this.orderPendingConfirm = null;
        this.fetchOrders();
        this.cdr.detectChanges();
      },
      error: () => {
        this.deliveringIds.delete(order.globalOrderId);
        this.orderPendingConfirm = null;
        this.cdr.detectChanges();
      }
    });
  }

  async ShareOrderInfoWithShare(order: GlobalOrderModel) {
  // صورة أول طرد فيه صورة (أو صورة العميل)
  const imageUrl =
    order.orderDetails?.find(d => d.imageUrl)?.imageUrl ??
    order.customer?.customerImage ??
    null;

  const text = this.buildOrderText(order, imageUrl);

  try {
    // قائمة المشاركة الأصلية (موبايل) — نص فقط حتى يأخذه واتساب كاملاً
    if (navigator.share) {
      await navigator.share({ title: `طلب #${order.globalOrderId}`, text });
      return;
    }
    // متصفح لا يدعم المشاركة → افتح واتساب مباشرة
    this.openWhatsApp(text);
  } catch (err: any) {
    // المستخدم ألغى المشاركة → لا تفتح واتساب
    if (err?.name === 'AbortError') return;
    console.error('Share error:', err);
    this.openWhatsApp(text);
  }
}

/** فتح واتساب بنص فقط */
private openWhatsApp(text: string) {
  const phone = ''; // فارغ = يختار المستخدم جهة الاتصال. أو ضع رقم المندوب
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/** بناء نص الطلب من نفس البيانات الظاهرة في الـ HTML */
private buildOrderText(order: GlobalOrderModel, imageUrl?: string | null): string {
  const lines: string[] = [];

  lines.push(`🧾 *طلب #${order.globalOrderId}*`);

  // بيانات العميل
  if (order.customer) {
    lines.push('');
    if (order.customer.customerCode) lines.push(`${order.customer.customerCode}`);
    if (order.customer.customerName)   lines.push(`${order.customer.customerName}`);
    if (order.customer.customerMobile) lines.push(`${order.customer.customerMobile}`);

    const addr = order.customer.address?.[0];
    if (addr) {
      const parts = [addr.city?.description, addr.area?.description, addr.landMark]
        .filter(Boolean)
        .join(' - ');
      if (parts) lines.push(`${parts}`);
    }
    
  }

  // تفاصيل الطرود
  if (order.orderDetails?.length) {
    lines.push('');
    lines.push('📦 *تفاصيل الطرود*');
    order.orderDetails.forEach((d, i) => {
      const name = this.unitNameFor(d);
      const value = d.unitValue != null
        ? (name === 'كيس' ? `${d.unitValue} KG` : `${d.unitValue}`)
        : '';
      const price = d.priceIQ != null ? ` - ${d.priceIQ} د.ع` : '';
      lines.push(`${i + 1}. ${name}${value ? ' (' + value + ')' : ''}${price}`);
    });
  }

  // معلومات إضافية
  lines.push('');
  if (order.insertDate) lines.push(`🗓 التاريخ: ${order.insertDate}`);
  if (order.scheduleDt) lines.push(`⏰ موعد: ${order.scheduleDt} ${order.scheduleTime ?? ''}`.trim());
  if (order.notes)      lines.push(`📝 ملاحظات: ${order.notes}`);

  // رابط الصورة بالآخر (يضغط عليه المندوب فيشوف صورة الطرد)
  if (imageUrl) {
    lines.push('');
    lines.push(`🖼 صورة الطرد: ${imageUrl}`);
  }

  return lines.join('\n');
}

}
