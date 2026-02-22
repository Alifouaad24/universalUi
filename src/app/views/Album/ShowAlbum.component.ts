import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal, ViewChild } from '@angular/core';
import { BadgeComponent, ButtonDirective, ButtonModule, CardModule, FormModule, GridModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalModule, ProgressBarComponent, ProgressComponent, TableDirective, ToastBodyComponent, ToastCloseDirective, ToastComponent, ToastModule } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  RowComponent,
} from '@coreui/angular';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../Services/http-connect.service';
import { AlbumModel } from '../../Models/Album';
import { LoadingService } from '../../core/Services/LoadingService';

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
  userId?: string

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef, public  loadingService: LoadingService,
     private router: Router) { }
  Businesses?: any[]
  ngOnInit(): void {
    this.getAlbum()
  }

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
    const images = this.selectedFolderId ? this.folderImages : this.allAlbums;
    const deletedImage = images[this.currentIndex];
    if (!deletedImage) return;
    if (!confirm('Are you sure you want to delete this image?')) return;
    this.http.deleteData(`ImageUploader/${deletedImage.userImagesId}`).subscribe((res) => {
      this.toastMessage.set('Image deleted successfully');
      this.toastVisible.set(true);
      images.splice(this.currentIndex, 1);
      if (this.selectedFolderId) {
        const indexInAll = this.allAlbums.findIndex(x => x.userImagesId === deletedImage.userImagesId);
        if (indexInAll >= 0) this.allAlbums.splice(indexInAll, 1);
      }
      if (this.currentIndex >= images.length) {
        this.currentIndex = images.length - 1;
        this.cdr.detectChanges();
        this.closeModal();
      }
      if (images.length === 0) {
        this.closeModal();
      }

      this.cdr.detectChanges();
    });
  }

  currentImageBase64: string = '';
  croppedImage: string | null = null;
  rotation = 0;

  openModal(index: number) {
    this.currentIndex = index;
    const imgUrl = this.folderImages[this.currentIndex]?.imageUrl;
    if (!imgUrl) return;

    this.convertImageToBase64(imgUrl).then(base64 => {
      this.currentImageBase64 = base64;
      this.croppedImage = base64;
      this.modalVisible = true;

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
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
    if (event.base64) {
      this.croppedImage = event.base64;
    } else if (event.blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.croppedImage = reader.result as string;
      };
      reader.readAsDataURL(event.blob);
    }
  }

  rotateImage() {
    console.log('rotate');
    this.rotation = (this.rotation + 1) % 4;
  }

//   saveCroppedImage() {
//     if (!this.croppedImage) {
//       console.error('No cropped image available');
//       return;
//     }
// this.loadingService.show();
// this.percentage.set(0);
//     const original = this.folderImages[this.currentIndex];
//     const businessId = localStorage.getItem('businessId');
//     const files: File[] = [];
//     const file = this.base64ToFile(this.croppedImage);
//     files.push(file);
//     const formData = new FormData();

//     files.forEach(file => formData.append('Images', file));
//     formData.append('FolderId', original.folderId!.toString());
//     formData.append('BusinessId', businessId!);

//     this.http.posteData('ImageUploader', formData).subscribe((res: any) => {

//       this.closeModal()
//       this.goBack()
//       this.getAlbum()
//       this.zoom = 1;
//       this.rotation = 0;
//       this.croppedImage = null;
//       this.modalVisible = false;
// this.loadingService.hide();
//       this.cdr.detectChanges();
//     });
//     this.loadingService.hide();
//   }
saveCroppedImage() {
  if (!this.croppedImage) {
    console.error('No cropped image available');
    return;
  }

  const original = this.folderImages[this.currentIndex];
  const businessId = localStorage.getItem('businessId');
  const files: File[] = [];
  const file = this.base64ToFile(this.croppedImage);
  files.push(file);

  const formData = new FormData();
  files.forEach(file => formData.append('Images', file));
  formData.append('FolderId', original.folderId!.toString());
  formData.append('BusinessId', businessId!);

  // أظهر شريط التحميل
  this.loadingService.show();
  this.percentage.set(0);

  this.http.posteData('ImageUploader', formData).subscribe((res: any) => {
    this.closeModal();
    this.goBack();
    this.getAlbum();
    this.zoom = 1;
    this.rotation = 0;
    this.croppedImage = null;
    this.modalVisible = false;

    // أخفي شريط التحميل بعد ما ينجح الطلب
    this.loadingService.hide();
    this.cdr.detectChanges();
  }, (err) => {
    // أخفي شريط التحميل لو صار خطأ
    this.loadingService.hide();
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

  deleteFolder(folderId: number) {
    if (!confirm(`Are you sure you want to delete folder-${folderId} folder?`)) return;

  }
}
