import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { BadgeComponent, ButtonDirective, ButtonModule, CardModule, FormModule, GridModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalModule, ProgressBarComponent, ProgressComponent, TableDirective, ToastBodyComponent, ToastCloseDirective, ToastComponent, ToastModule } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

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
    ButtonModule, ImageCropperComponent,
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
  groupedAlbums: { folderId: number, images: AlbumModel[] }[] = [];
  selectedFolderId: number | null = null;
  folderImages: AlbumModel[] = [];

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef) { }
  Businesses?: any[]
  ngOnInit(): void {
    this.getAlbum()
  }


  // getAlbum() {
  //   var businessId = localStorage.getItem('businessId');
  //   this.isLoading = true;
  //   this.http.getAllData(`ImageUploader/${businessId}`).subscribe((res: any) => {
  //     this.allAlbums = (res as AlbumModel[]).map(el => new AlbumModel({
  //       userImagesId: el.userImagesId,
  //       imageUrl: el.imageUrl,
  //     }))
  //     this.isLoading = false;
  //     this.cdr.detectChanges();
  //   },
  //     (err) => {
  //       this.isLoading = false;
  //       this.message = 'Error loading data';
  //       this.cdr.detectChanges();
  //     })
  // }

  getAlbum() {
    const businessId = localStorage.getItem('businessId');
    this.isLoading = true;

    this.http.getAllData(`ImageUploader/${businessId}`)
      .subscribe((res: any) => {
        console.log(res)
        this.allAlbums = (res as AlbumModel[]).map(el => new AlbumModel({
          userImagesId: el.userImagesId,
          imageUrl: el.imageUrl,
          folderId: el.folderId
        }));

        // Group by folderId
        this.groupedAlbums = this.allAlbums.reduce((acc, curr) => {
          const found = acc.find(x => x.folderId === curr.folderId);
          if (found) {
            found.images.push(curr);
          } else {
            acc.push({
              folderId: curr.folderId!,
              images: [curr]
            });
          }
          return acc;
        }, [] as { folderId: number, images: AlbumModel[] }[]);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
        (err) => {
          this.isLoading = false;
          this.message = 'Error loading data';
          this.cdr.detectChanges();
        });
  }

  openFolder(folderId: number) {
    this.selectedFolderId = folderId;
    this.folderImages = this.groupedAlbums
      .find(f => f.folderId === folderId)?.images || [];
  }

  goBack() {
    this.selectedFolderId = null;
    this.folderImages = [];
  }

  // openModal(index: number) {
  //   this.currentIndex = index;
  //   this.modalVisible = true;
  // }

  closeModal() {
    this.modalVisible = false;
  }

  nextImage() {
    const images = this.selectedFolderId ? this.folderImages : this.allAlbums;
    if (this.currentIndex < images.length - 1) {
      this.currentIndex++;
      const imgUrl = this.folderImages[this.currentIndex]?.imageUrl;
      if (!imgUrl) return;

      this.convertImageToBase64(imgUrl).then(base64 => {
        this.currentImageBase64 = base64;
        this.modalVisible = true;
        this.cdr.detectChanges()
      });
    }

    this.cdr.detectChanges()
  }

  prevImage() {
    if (this.currentIndex > 0) this.currentIndex--;
    const imgUrl = this.folderImages[this.currentIndex]?.imageUrl;
    if (!imgUrl) return;

    this.convertImageToBase64(imgUrl).then(base64 => {
      this.currentImageBase64 = base64;
      this.modalVisible = true;
      this.cdr.detectChanges()
    });

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

  currentImageBase64: string = '';
  croppedImage: string | null = null;
  rotation = 0;

  openModal(index: number) {
    this.currentIndex = index;
    const imgUrl = this.folderImages[this.currentIndex]?.imageUrl;
    if (!imgUrl) return;

    this.convertImageToBase64(imgUrl).then(base64 => {
      this.currentImageBase64 = base64;
      this.modalVisible = true;
      this.cdr.detectChanges()
    });
  }

  convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) reject('Cannot get canvas context');
        ctx!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = err => reject(err);
      img.src = url;
    });
  }

  zoom = 1;

  zoomIn() { this.zoom += 0.1; }

  zoomOut() {
    if (this.zoom == 1) return
    this.zoom = Math.max(0.1, this.zoom - 0.1);
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
  }

  rotateImage() {
    this.rotation = (this.rotation + 90) % 360;
  }

  saveCroppedImage() {
    if (!this.croppedImage) return;

    const original = this.folderImages[this.currentIndex];
    const businessId = localStorage.getItem('businessId');

    const file = this.base64ToFile(this.croppedImage);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', original.folderId!.toString());
    formData.append('businessId', businessId!);

    this.http.posteData('ImageUploader', formData)
      .subscribe((res: any) => {
        const newImage = new AlbumModel({
          userImagesId: res.userImagesId,
          imageUrl: res.imageUrl,
          folderId: original.folderId
        });

        this.folderImages.push(newImage);
        this.allAlbums.push(newImage);

        const folder = this.groupedAlbums.find(f => f.folderId === original.folderId);
        if (folder) folder.images.push(newImage);

        // تنظيف الحالة
        this.zoom = 1;
        this.rotation = 0;
        this.croppedImage = null;

        this.modalVisible = false;
        this.cdr.detectChanges();
      });
  }

  private base64ToFile(base64: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'edited.png', { type: mime });
  }
}
