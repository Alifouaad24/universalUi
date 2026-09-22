import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippingService } from './shipping.service';
import { GlobalOrderModel, GlobalOrderDetailModel, statusColor, unitNameFor } from './order.model';
import { UnitModel } from './unit.model';

@Component({
  selector: 'app-shipping-master-orders-history',
  standalone: true,
  imports: [CommonModule],
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

}
