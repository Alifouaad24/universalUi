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
  templateUrl: './Add-requestWebHosting.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditCategoryComponent implements OnInit {
  domain: string = '';
  hostName: string = '';
  message: string = '';
  loading: boolean = false
  categoryForEdit?: any;
  EbayCategryId: string = ''
  id?: number
  Businesses?: BusinessModel[] = [];
  isLoading: boolean = false
  selectedBusinessId?: number
  selectedParentId?: number
  selectedLinkedId?: number
  Categories: any[] = [];

  constructor(private http: HttpConnectService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.selectedBusinessId = localStorage.getItem('businessId') ? Number(localStorage.getItem('businessId')) : undefined;
    // this.getAllCategories()
    // this.getAllBusinesses()
    // this.route.queryParamMap.subscribe(params => {
    //   const countryFromQyery = params.get('Category')
    //   if (countryFromQyery) {
    //     this.categoryForEdit = JSON.parse(countryFromQyery);
    //     console.log(this.categoryForEdit)
    //     this.id = this.categoryForEdit!.category_id
    //     this.description = this.categoryForEdit!.name;
    //     this.EbayCategryId = this.categoryForEdit.ebayCategoryId
    //     this.selectedBusinessId = this.categoryForEdit.business_id
    //   }
    // })
  }

  // getAllBusinesses() {
  //   this.http.getAllData('Business').subscribe(res => {
  //     this.Businesses = (res as BusinessModel[]).map((el) => new BusinessModel({
  //       business_id: el.business_id,
  //       business_name: el.business_name
  //     }))
  //     this.cdr.detectChanges()
  //   }, (error) => {
  //     console.error(error)
  //     this.loading = false
  //   })
  //   this.cdr.detectChanges()
  // }

  // getAllCategories() {
  //   this.isLoading = true;
  //   const businessId = localStorage.getItem('businessId')
  //   this.http.getAllData(`Category/${businessId}`).subscribe(

  //     (res: any) => {
  //       console.log(res)
  //       this.Categories = res
  //       this.isLoading = false;

  //       if(this.categoryForEdit){
  //         this.selectedParentId = this.categoryForEdit.parentId
  //         this.selectedLinkedId = this.categoryForEdit.linkedCategoryId
  //       }
  //       this.cdr.detectChanges();
  //     },
  //     (err) => {
  //       this.isLoading = false;
  //       this.message = 'Error loading data';
  //       this.cdr.detectChanges();
  //     }
  //   );
  // }

  addRequestHostOrder() {
    this.loading = true

    var payload = {
      Domain: this.domain,
      Name: this.hostName,
      Service_id: 66,
      AssignerTypeId: 1,
      AssignerId: this.selectedBusinessId?.toString(),
      OrderStatusId: 11,
      AssigneeTypeId: 1,
      AssigneeId: '13',
      Business_id: this.selectedBusinessId

    }
    console.log(payload)
    if (this.categoryForEdit == null) {
      if (!this.domain) {
        this.message = 'Please enter Domain';
        this.loading = false
        return;
      }



      this.http.posteData('Orders/AddGlobalOrder', payload).subscribe(res => {
        this.router.navigate(['Home/web-hosting'])
        this.loading = false
      }, (error) => {
        console.error(error)
        this.loading = false
      })
    } else {
      if (!this.domain) {
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
