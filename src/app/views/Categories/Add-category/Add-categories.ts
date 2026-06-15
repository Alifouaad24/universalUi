import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { Country } from '../../../Models/CountryModel';
import { BusinessModel } from '../../../Models/Business/BusinessModel';
@Component({
  selector: 'app-buttons',
  templateUrl: './Add-categories.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditCategoryComponent implements OnInit {
  description: string = '';
  message: string = '';
  loading: boolean = false
  categoryForEdit?: any;
  EbayCategryId: string = ''
  id?: number
  Businesses?: BusinessModel[] = [];
  isLoading: boolean = false
  selectedBusinessId?: number

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllBusinesses()
    this.route.queryParamMap.subscribe(params => {
      const countryFromQyery = params.get('Category')
      if (countryFromQyery) {
        this.categoryForEdit = JSON.parse(countryFromQyery);
        console.log(this.categoryForEdit)
        this.id = this.categoryForEdit!.category_id
        this.description = this.categoryForEdit!.name;
        this.EbayCategryId = this.categoryForEdit.ebayCategoryId
        this.selectedBusinessId = this.categoryForEdit.business_id
      }
    })
  }

  getAllBusinesses() {
    this.http.getAllData('Business').subscribe(res => {
      this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
        business_id: el.business_id,
        business_name: el.business_name
      }))
      this.cdr.detectChanges()
    }, (error) => {
      console.error(error)
      this.loading = false
    })
    this.cdr.detectChanges()
  }

  addCategory() {
    this.loading = true

    var payload = {
        Name: this.description,
        ebayCategoryId: this.EbayCategryId,
        business_id: this.selectedBusinessId
      }

    if (this.categoryForEdit == null) {
      if (!this.description) {
        this.message = 'Please enter Country name';
        this.loading = false
        return;
      }

      

      this.http.posteData('Category', payload).subscribe(res => {
        this.router.navigate(['Home/categories'])
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

      this.http.putData(`Category/${this.id}`, payload).subscribe(res => {
        this.router.navigate(['Home/categories'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    }



  }
}
