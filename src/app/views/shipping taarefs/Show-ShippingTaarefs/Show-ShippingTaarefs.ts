import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-show-tariffs',
  templateUrl: './Show-ShippingTaarefs.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ]
})
export class ShowTariffsComponent implements OnInit {

  tariffs: any[] = [];
  isLoading = false;
  message = '';

  constructor(
    private http: HttpConnectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllTariffs();
  }

  getAllTariffs(): void {
  this.isLoading = true;
  this.message = '';

  this.http.getAllData('ShippingTaaref').subscribe({
    next: (res: any) => {

      const tariffList = Array.isArray(res) ? res : [];

      if (tariffList.length === 0) {
        this.tariffs = [];
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      const requests = tariffList.map((tariff: any) => {

        const tariffId = tariff.taarefId ?? tariff.TaarefId;

        return this.http
          .getAllData(`ShippingTaaref/GetTaarefDetails/${tariffId}`)
          .pipe(
            catchError(err => {
              console.error(
                `Error loading details for tariff ${tariffId}`,
                err
              );
              return of(null);
            })
          );
      });

      forkJoin(requests).subscribe({

        next: (detailsList: any[]) => {

          this.tariffs = tariffList.map((tariff: any, index: number) => {

            const detail = detailsList[index];

            return {
              ...tariff,

              // Backend returns one object, not an array
              details: detail ? [detail] : []
            };

          });

          this.isLoading = false;
          this.cdr.detectChanges();

          console.log('Loaded tariffs:', this.tariffs);
        },

        error: err => {
          console.error(err);
          this.message = 'Error loading tariff details';
          this.isLoading = false;
          this.cdr.detectChanges();
        }

      });

    },

    error: err => {
      console.error(err);
      this.message = 'Error loading tariffs';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  getDetailType(detail: any): string {
    if (detail.service_id) {
      return 'Service';
    }

    if (detail.itemId) {
      return 'Product';
    }

    return '-';
  }

  getDetailName(detail: any): string {
    return detail.service.description || detail.itemName || '-';
  }

}