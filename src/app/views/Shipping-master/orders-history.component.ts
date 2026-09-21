import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  fullImageUrl: string | null = null;

  constructor(
    private shipping: ShippingService, private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
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
        this.isLoading = false;
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
}
