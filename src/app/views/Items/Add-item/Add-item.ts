import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { ActiviityModel } from '../../../Models/ActivityModel';
import { PlatformModel } from '../../../Models/platformModel';
import { LoadingService } from '../../../core/Services/LoadingService';

@Component({
  selector: 'app-buttons',
  templateUrl: './Add-item.html',
  imports: [RowComponent, ColComponent,
    CardComponent, CardHeaderComponent,
    CardBodyComponent, CommonModule, FormsModule, RouterOutlet,
    ButtonDirective, IconDirective, RouterLink,
  ]
})
export class AddEditItemComponent implements OnInit, AfterViewInit {
  UPC: string = '';
  message: string = '';
  loading: boolean = false
  Platforms?: PlatformModel[]
  selectedPlatformId?: number;
  payLoadItem: any[] = []
  @ViewChild('upcInput') upcInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpConnectService, private router: Router, private cdr: ChangeDetectorRef, private loader: LoadingService) { }
  ngAfterViewInit(): void {
    this.upcInput.nativeElement.focus();
  }

  ngOnInit(): void {

    this.getAllPlatforms()
  }

  getAllPlatforms() {
    this.http.getAllData('Platform').subscribe(res => {
      this.Platforms = (res as PlatformModel[]).map((el) => new PlatformModel({
        platform_id: el.platform_id,
        description: el.description,

      }))
      this.cdr.detectChanges();
    }, (error) => {
      console.error(error)
      this.loading = false
    })
  }

  addListItems() {
    if (!this.UPC) {
      this.message = 'Please fill in all required fields.';
      return;
    }
    if (this.payLoadItem.find(item => item.upc === this.UPC)) {
      this.UPC = '';
      return;
    }
    this.payLoadItem.push({
      upc: this.UPC,
      platformId: this.selectedPlatformId
    });

    console.log(this.payLoadItem);

    this.UPC = '';
    if (this.upcInput) {
      this.upcInput.nativeElement.focus();
    }
  }

  SaveItems() {
    this.message = 'Items added successfully!';
    if (this.payLoadItem.length === 0) {
      this.message = 'No items to save.';
      return;
    }
    // this.loader.show();
    // this.http.posteData('Item/AddItemFromWeb', this.payLoadItem).subscribe(res => {
    //   this.loader.hide();
    //   this.payLoadItem = [];
    //   this.message = 'Items added successfully!';
    // }, (error) => {
    //   console.error(error)
    //   this.loader.hide();
    // })
  }
}