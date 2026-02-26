import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { BadgeComponent, ButtonDirective, ButtonModule, CardModule, FormModule, GridModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalModule, ProgressBarComponent, ProgressComponent, TableDirective, ToastBodyComponent, ToastCloseDirective, ToastComponent, ToastModule } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule } from '@angular/forms';
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
import { AlbumStateService } from '../../core/Services/countOfFolders';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'ShowAlbum.component.html',
  imports: [CardComponent, CardHeaderComponent, ToastComponent, ToastBodyComponent, FormsModule,
    ToastCloseDirective, ToastModule, ProgressComponent, CardModule,
    ButtonModule, ImageCropperComponent,
    ModalModule,
    GridModule, ProgressBarComponent,
    ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent,
    CardBodyComponent, RowComponent, RouterLink, RouterOutlet,
    BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective]
})
export class ShowAlbumComponent implements OnInit, OnDestroy {

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
  PlatformId: number | null = null;
  SizeId: number | null = null;
  CategoryId: number | null = null;
  Categories?: any[]
  Sizes?: any[]
  Platforms?: any[]
  businessId?: number
  UPC: string = '';
  SKU: string = '';
  currentImgUrl?: string;
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  translateH = 0;
  translateV = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  constructor(private http: HttpConnectService, private cdr: ChangeDetectorRef,
    public loadingService: LoadingService, private albumState: AlbumStateService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.albumState.reset();
  }
  Businesses?: any[]
  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'));
    this.getAlbum()
    this.getCategories()
    this.getSizes()
    this.getPlatforms()
  }

  getFolderBackground(folder: { images: AlbumModel[] }): string {
    if (!folder?.images) return 'rgba(255,0,0,0.5)';

    const hasProcessed = folder.images.some(img => img.isProccessed);
    return hasProcessed
      ?
      'rgba(30, 204, 7, 0.5)' : 'rgba(0,0,0,0.5)';
  }

  getCategories() {
    this.http.getAllData('Category').subscribe((res: any) => {
      console.log(res)
      this.Categories = res;
    })
  }

  getSizes() {
    this.http.getAllData('Size').subscribe((res: any) => {
      console.log(res)
      this.Sizes = res;
    })
  }

  getPlatforms() {
    this.http.getAllData(`Platform/${this.businessId}`).subscribe((res: any) => {
      console.log(res)
      this.Platforms = res;
    })
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
          folderId: el.folderId,
          isProccessed: el.isProccessed
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
        this.albumState.setCount(this.groupedAlbums.length);
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
    this.currentImgUrl = this.folderImages[this.currentIndex]?.imageUrl;
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





  transform = {
    scale: this.zoom,
    translateH: this.translateH,
    translateV: this.translateV
  };


  updateTransform() {
    this.transform = {
      scale: this.zoom,
      translateH: this.translateH,
      translateV: this.translateV
    };
  }
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    this.translateH += dx;
    this.translateV += dy;

    this.startX = event.clientX;
    this.startY = event.clientY;

    this.updateTransform();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  zoomIn() {
    this.zoom += 0.1;

    this.updateTransform();
  }

  zoomOut() {
    if (this.zoom == 1) return;
    this.zoom = Math.max(0.1, this.zoom - 0.1);
    this.updateTransform();
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

      this.loadingService.hide();
      this.cdr.detectChanges();
    }, (err) => {
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

  deleteFolder(folderIdd: number) {
    if (!confirm(`Are you sure you want to delete folder-${folderIdd} folder?`)) return;

    this.http.deleteData(`ImageUploader/DeleteImageByFolderId/${folderIdd}`).subscribe((res: any) => {
      this.groupedAlbums = this.groupedAlbums.filter(el => el.folderId != folderIdd)
    }, (error) => {
      alert(error)
    })

  }

  SaveInInvAndItem() {
    this.isLoading = true;
    const payload = {
      categoryId: this.CategoryId,
      sizeId: this.SizeId,
      platformId: this.PlatformId,
      upc: this.UPC,
      sku: this.SKU,
      imageUrl: this.currentImgUrl,
      folderId: this.selectedFolderId,
      businessId: this.businessId
    }

    console.log(payload)

    this.http.posteData('Item/addItemAndInv', payload).subscribe((res: any) => {
      this.isLoading = false;
      alert('Data saved successfully')
      this.closeModal();
      this.getAlbum();
      this.goBack();
    }, (err) => {
      this.isLoading = false;
      alert('Error saving data')
    })

  }

}
