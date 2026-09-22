import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalOrderModel } from './order.model';
import { ShippingService } from './shipping.service';

interface ActionItem {
  icon: 'list' | 'add' | 'receive';
  title: string;
  subtitle: string;
  accent: 'navy' | 'amber';
  route: string;
  query: Record<string, any>;
}

@Component({
  selector: 'app-shipping-master-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class ShippingMasterLandingComponent implements OnInit {

  constructor(private router: Router, private shipping: ShippingService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  orders: GlobalOrderModel[] = [];

  get actions(): ActionItem[] {
    return [
      {
        icon: 'list',
        title: `في المخزن (${this.orders.length})`,
        subtitle: 'استعرض جميع الطرود وتابع حالتها',
        accent: 'navy',
        route: '/shipping-master/orders',
        query: {}
      },
      {
        icon: 'receive',
        title: 'الطرود المسلمة',
        subtitle: 'استعرض الطرود التي تم تسليمها للمندوب',
        accent: 'amber',
        route: '/shipping-master/orders',
        query: { statusId: 17 }
      },
      {
        icon: 'add',
        title: 'إضافة',
        subtitle: 'أنشئ طردا جديدًا خطوة بخطوة',
        accent: 'amber',
        route: '/shipping-master/add',
        query: {}
      },
    ];
  }

  fetchOrders(): void {
    this.shipping.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.filter(e => e.orderStatus?.orderStatusId != 17);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  onActionTap(item: ActionItem): void {
    this.router.navigate([item.route], { queryParams: item.query });
  }
}