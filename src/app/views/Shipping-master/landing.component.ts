import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ActionItem {
  icon: 'list' | 'add' | string;
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
export class ShippingMasterLandingComponent {

  readonly actions: ActionItem[] = [
    {
      icon: 'list',
      title: 'عرض',
      subtitle: 'استعرض جميع الطرود وتابع حالتها',
      accent: 'navy',
      route: '/shipping-master/orders',
      query: {}
    },
    {
      icon: 'recice',
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

  constructor(private router: Router) { }

  onActionTap(item: ActionItem): void {
    this.router.navigate([item.route], { queryParams: item.query });
  }
}
