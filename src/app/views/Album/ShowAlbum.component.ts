import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { BadgeComponent, ButtonDirective, ButtonModule, CardModule, FormModule, GridModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalModule, ProgressBarComponent, ProgressComponent, TableDirective, ToastBodyComponent, ToastCloseDirective, ToastComponent, ToastModule } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';

import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  RowComponent,
} from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
import { AlbumModel } from '../../Models/Album';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'ShowAlbum.component.html',
  imports: [CardComponent, CardHeaderComponent, ToastComponent, ToastBodyComponent,
    ToastCloseDirective, ToastModule, ProgressComponent, CardModule,
    ButtonModule,
    ModalModule,
    GridModule, ProgressBarComponent,
    ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent,
    CardBodyComponent, RowComponent, RouterLink, RouterOutlet,
    BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective]
})
export class ShowAlbumComponent implements OnInit {

  allAlbums: AlbumModel[] = []
  message?: string
  isLoading: boolean = false;
  modalVisible = false;
  currentIndex = 0;
  showDeleteModal: boolean = false;
  ///// for toastr ////////
  position = 'top-end';
  toastVisible = signal(false);
  toastMessage = signal('');
  percentage = signal(0);
  autoHideToast = signal(true);

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }
  Businesses?: any[]
  ngOnInit(): void {
    this.getAlbum()
  }


  getAlbum() {
    this.http.getAllData('ImageUploader').subscribe((res: any) => {
      this.allAlbums = (res as AlbumModel[]).map(el => new AlbumModel({
        userImagesId: el.userImagesId,
        imageUrl: el.imageUrl,
      }))
      this.isLoading = false;
      this.cdr.detectChanges();
    },
      (err) => {
        this.isLoading = false;
        this.message = 'Error loading data';
        this.cdr.detectChanges();
      })
  }

  openModal(index: number) {
    this.currentIndex = index;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex < this.allAlbums.length - 1) {
      this.currentIndex++;
    }
  }

  deleteImage() {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const deletedImage = this.allAlbums[this.currentIndex];
    this.http.deleteData(`ImageUploader/${deletedImage.userImagesId}`).subscribe((res) => {
      this.toastMessage.set('Image deleted successfully');
      this.toastVisible.set(true);
      this.allAlbums.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.allAlbums.length) {
        this.currentIndex = this.allAlbums.length - 1;
      }
      if (this.allAlbums.length === 0) {
        this.closeModal();
      }
      this.cdr.detectChanges();
    })

  }

  // confirmDelete(type: AddressModel) {
  //   this.selectedType = type;
  //   this.showDeleteModal = true;
  // }


  // deleteAddress(type?: AddressModel) {
  //   if (!type) return;
  //   this.http.deleteData(`Address/${type.address_id}`,).subscribe((res) => {
  //     console.log(res)
  //     this.allAddresses = this.allAddresses.filter(t => t.address_id !== type.address_id);
  //     this.showDeleteModal = false;
  //     this.toastMessage.set(`$ deleted successfully`);
  //     this.toastVisible.set(true);
  //   }, (error) => {
  //     this.toastMessage.set(`An error occured during delete`);
  //     this.toastVisible.set(true);
  //   });
  // }
  // onVisibleChange(visible: boolean) {
  //   this.showDeleteModal = false;
  //   this.toastVisible.set(visible);
  //   if (!visible) this.percentage.set(0);
  // }

  // onTimerChange(value: number) {
  //   this.percentage.set(value * 25);
  // }
}
