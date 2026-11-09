import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { Country } from '../../../Models/CountryModel';
@Component({
  selector: 'app-buttons',
  templateUrl: './Add-ShippingTaarefs.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})

export class AddEditCountryComponent implements OnInit {
  description: string = '';
  message: string = '';
  loading: boolean = false
  contryForEdit?: Country;
  id?: number
  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.route.queryParamMap.subscribe(params => {
    //   const countryFromQyery = params.get('country')
    //   if (countryFromQyery) {
    //     this.contryForEdit = JSON.parse(countryFromQyery);
    //     console.log(this.contryForEdit)
    //     this.id = this.contryForEdit!.countryId
    //     this.description = this.contryForEdit!.name;
    //   }
    // })
    this.getBusinesses();
    this.getCountries();
    this.getPlatforms();
    this.getShippingTypes();
    this.getTaarefs();
  }


  model = {
    business_id: null as number | null,
    countryId: null as number | null,
    platform_id: null as number | null,
    shippingTypeId: null as number | null,
    taarefId: null as number | null
  };

  countries: any[] = [];
  businesses: any[] = [];
  platforms: any[] = [];
  shippingTypes: any[] = [];
  tariffs: any[] = [];

  getBusinesses() {
    this.http.getAllData<any[]>('Business').subscribe(res => {
      this.businesses = res;
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error);
    }
    );
  }

  getCountries() {
    this.http.getAllData<any[]>('Country').subscribe(res => {
      this.countries = res;
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error);
    }
    );
  }

  getPlatforms() {
    this.http.getAllData<any[]>('Platform/13').subscribe(res => {
      this.platforms = res;
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error);
    }
    );
  }

  getShippingTypes() {
    this.http.getAllData<any[]>('ShippingTypes').subscribe(res => {
      this.shippingTypes = res;
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error);
    }
    );
  }

  getTaarefs() {
    this.http.getAllData<any[]>('shippingTaaref/GetAllTaarefs').subscribe(res => {
      this.tariffs = res;
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error);
    }
    );
  }


  addShippingTaaref() {
    this.loading = true

    if (this.contryForEdit == null) {

      var payload = {
        "businessId": this.model.business_id,
        "countryId": this.model.countryId,
        "platformId": this.model.platform_id,
        "shippingTypeId": this.model.shippingTypeId,
        "taarefId": this.model.taarefId
      }

      this.http.posteData('ShippingTaaref', payload).subscribe(res => {
        this.router.navigate(['Home/countries'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.description) {
        this.message = 'Please enter Country name';
        this.loading = false
        return;
      }

      this.http.putData(`Country/${this.id}`, { "name": this.description }).subscribe(res => {
        this.router.navigate(['Home/countries'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }



  }
}
