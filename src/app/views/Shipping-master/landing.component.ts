import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * عنصر إجراء واحد في شاشة الهبوط (Landing).
 * لإضافة بطاقة جديدة: أضف عنصرًا جديدًا إلى المصفوفة actions في الأسفل.
 */
interface ActionItem {
  icon: 'list' | 'add' | string;
  title: string;
  subtitle: string;
  accent: 'navy' | 'amber';
  route: string;
}

@Component({
  selector: 'app-shipping-master-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class ShippingMasterLandingComponent {
  /**
   * نفس البيانات الموجودة في LandingScree (Flutter) تمامًا:
   * - عرض  -> يذهب إلى شاشة عرض كل الطرود
   * - إضافة -> يذهب إلى شاشة إضافة طرد جديد
   * غيّر المسارات (route) لتطابق مسارات مشروعك الفعلية.
   */
  readonly actions: ActionItem[] = [
    {
      icon: 'list',
      title: 'عرض',
      subtitle: 'استعرض جميع الطرود وتابع حالتها',
      accent: 'navy',
      route: '/shipping-master/orders',
    },
    {
      icon: 'add',
      title: 'إضافة',
      subtitle: 'أنشئ طردا جديدًا خطوة بخطوة',
      accent: 'amber',
      route: '/shipping-master/add',
    },
  ];

  constructor(private router: Router) {}

  onActionTap(item: ActionItem): void {
    this.router.navigateByUrl(item.route);
  }
}
