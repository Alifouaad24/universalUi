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
    const text = this.buildOrderText(order);

    // صورة أول طرد فيه صورة (أو صورة العميل) — عدّل حسب رغبتك
    const imageUrl =
      order.orderDetails?.find(d => d.imageUrl)?.imageUrl ??
      order.customer?.customerImage ??
      null;

    try {
      // لو في صورة والمتصفح بيدعم مشاركة الملفات
      if (imageUrl) {
        const file = await this.urlToFile(imageUrl);
        if (file && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: `طلب #${order.globalOrderId}`,
            text,
            files: [file],
          });
          return;
        }
      }

      // لا صورة أو المتصفح ما بيدعم الملفات → شارك النص فقط
      if (navigator.share) {
        await navigator.share({ title: `طلب #${order.globalOrderId}`, text });
        return;
      }

      // fallback أخير → افتح واتساب بنص فقط
      this.openWhatsApp(text);
    } catch (err) {
      // المستخدم ألغى المشاركة أو صار خطأ → جرّب واتساب نص
      console.error('Share error:', err);
      this.openWhatsApp(text);
    }
  }

  /** تحويل رابط صورة إلى File لمشاركته */
  private async urlToFile(url: string): Promise<File | null> {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      return new File([blob], `order.${ext}`, { type: blob.type });
    } catch (e) {
      console.error('Could not fetch image for sharing:', e);
      return null;
    }
  }

  /** فتح واتساب بنص فقط */
  private openWhatsApp(text: string) {
    const phone = ''; // اتركه فارغاً ليختار المستخدم جهة الاتصال، أو ضع رقم العميل
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  /** بناء نص الطلب من نفس البيانات الظاهرة في الـ HTML */
  private buildOrderText(order: GlobalOrderModel): string {
    const lines: string[] = [];

    lines.push(`🧾 *طلب #${order.globalOrderId}*`);

    if (order.orderStatus?.statusAr) {
      lines.push(`الحالة: ${order.orderStatus.statusAr}`);
    }

    // بيانات العميل
    if (order.customer) {
      lines.push('');
      lines.push('👤 *معلومات العميل*');
      if (order.customer.customerName) lines.push(`الاسم: ${order.customer.customerName}`);
      if (order.customer.customerMobile) lines.push(`الهاتف: ${order.customer.customerMobile}`);

      const addr = order.customer.address?.[0];
      if (addr) {
        const parts = [addr.city?.description, addr.area?.description, addr.landMark]
          .filter(Boolean)
          .join(' - ');
        if (parts) lines.push(`العنوان: ${parts}`);
      }
      if (order.customer.customerCode) lines.push(`كود العميل: ${order.customer.customerCode}`);
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

    // // معلومات إضافية
    // lines.push('');
    // if (order.insertDate) lines.push(`🗓 التاريخ: ${order.insertDate}`);
    // if (order.scheduleDt) lines.push(`⏰ موعد: ${order.scheduleDt} ${order.scheduleTime ?? ''}`.trim());
    // if (order.notes) lines.push(`📝 ملاحظات: ${order.notes}`);

    return lines.join('\n');
  }

}
