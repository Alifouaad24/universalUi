import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './ShippingCost.html',
  imports: [
    RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class ShippingCostComponent implements OnInit {
  message: string = '';
  loading: boolean = false;
  ShippingTypeId?: number;

  shippingCosts: any[] = [];


  weights: { [key: number]: number } = {};

  constructor(
    private http: HttpConnectService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param => {
      const id = param.get('shippingTypeId');
      console.log('shippingTypeId:', id);
      if (id) {
        this.ShippingTypeId = parseInt(id);
        this.getShippingCost(this.ShippingTypeId);
      }
    });
  }

  getShippingCost(shippTypeId: number) {
    const businessId = localStorage.getItem('businessId');
    this.loading = true;
    this.message = '';
    console.log('businessId:', businessId);

    this.http.getAllData(`ShippingCosts?businessId=${businessId}&ShippTypeId=${shippTypeId}`)
      .subscribe(
        (res: any) => {
          this.loading = false;
          if (res && res.length > 0) {
            this.shippingCosts = res;
            this.shippingCosts.forEach((item) => {
              this.weights[item.shippingCostId] = item.weight_Value ?? 1;
            });
            this.cdr.detectChanges();
          } else {
            this.shippingCosts = [];
            this.message = 'No shipping cost data found.';
          }
        },
        (error) => {
          this.loading = false;
          this.message = 'Error fetching shipping cost data.';
        }
      );
  }

  onWeightChange(shippingCostId: number): void { }

  getCalculatedCost(item: any): number {
    const unitWeight = item.weight_Value || 1;
    const enteredWeight = this.weights[item.shippingCostId] || 0;
    const rate = (item.costAmount || 0) / unitWeight;
    return rate * enteredWeight;
  }

  getCalculatedSale(item: any): number {
    const unitWeight = item.weight_Value || 1;
    const enteredWeight = this.weights[item.shippingCostId] || 0;
    const rate = (item.saleAmount || 0) / unitWeight;
    return rate * enteredWeight;
  }

  getCalculatedMargin(item: any): number {
    return this.getCalculatedSale(item) - this.getCalculatedCost(item);
  }
}