import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  // ===== قسم المنتجات =====
  private readonly productKeyStorageKey = 'product_key_type';
  productKeyType: 'UPC' | 'SKU' = 'UPC';

  // رسالة الحفظ لكل قسم (المفتاح = اسم القسم)
  savedMessages: { [section: string]: string } = {};

  ngOnInit(): void {
    // قراءة الإعدادات المحفوظة عند فتح الصفحة
    const savedKeyType = localStorage.getItem(this.productKeyStorageKey);
    if (savedKeyType === 'UPC' || savedKeyType === 'SKU') {
      this.productKeyType = savedKeyType;
    }
  }

  // حفظ إعدادات قسم المنتجات
  saveProductSettings(): void {
    localStorage.setItem(this.productKeyStorageKey, this.productKeyType);
    this.showSavedMessage('products');
  }

  // دالة مساعدة تعرض رسالة "تم الحفظ" للقسم المطلوب ثم تخفيها
  private showSavedMessage(section: string): void {
    this.savedMessages[section] = 'تم الحفظ بنجاح ✓';
    setTimeout(() => (this.savedMessages[section] = ''), 3000);
  }
}