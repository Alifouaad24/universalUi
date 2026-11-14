import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ModalModule,
  ProgressComponent,
  RowComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { MultimediaModel } from '../../../Models/MultimediaModel';

@Component({
  selector: 'app-show-multimedia',
  templateUrl: './ShowMultimedia.html',
  imports: [
    CommonModule, IconModule, ModalModule,
    RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, ProgressComponent,
    ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent,
  ],
})
export class ShowMultimediaComponent implements OnInit, OnDestroy {
  businessId = '';

  // ── القائمة ──
  files = signal<MultimediaModel[]>([]);
  isLoading = signal(false);
  message = signal<string | undefined>(undefined);

  // ── الحذف ──
  showDeleteModal = false;
  selectedFile?: MultimediaModel;

  // ── الرفع ──
  showUploadModal = false;
  selectedUpload = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);
  readonly maxSizeMb = 20;
  readonly accept = 'image/*,video/*,application/pdf';

  // ── التوست ──
  toastVisible = signal(false);
  toastTitle = signal('');
  toastMessage = signal('');
  percentage = signal(0);

  constructor(private http: HttpConnectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.queryParamMap.get('businessId') ?? '';
    this.getFiles();
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  // ───────────── جلب الملفات ─────────────
  getFiles() {
    this.isLoading.set(true);
    this.message.set(undefined);
    this.http.getAllData(`Business/getAllMedia/${this.businessId}`).subscribe({
      next: (res: any) => {
        this.files.set((res as any[]).map(item => new MultimediaModel(item)));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.message.set('Error loading files');
      },
    });
  }

  // ───────────── مودال الرفع ─────────────
  openUploadModal() {
    this.resetUpload();
    this.showUploadModal = true;
  }

  onUploadModalChange(visible: boolean) {
    this.showUploadModal = visible;
    if (!visible) this.resetUpload();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.uploadError.set(null);
    this.revokePreview();

    if (!file) {
      this.selectedUpload.set(null);
      return;
    }
    if (file.size > this.maxSizeMb * 1024 * 1024) {
      this.uploadError.set(`Maximum file size is ${this.maxSizeMb} MB`);
      this.selectedUpload.set(null);
      input.value = '';
      return;
    }

    this.selectedUpload.set(file);
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }

  upload() {
    const file = this.selectedUpload();
    if (!file || this.isUploading()) return;

    // الأسماء تطابق الكلاس UploadMedia في السيرفر
    const form = new FormData();
    form.append('businessId', this.businessId);
    form.append('file', file, file.name);

    this.isUploading.set(true);
    this.uploadError.set(null);

    this.http.posteData('Business/UpdateMedia', form).subscribe({
      next: (saved: any) => {
        this.files.update(list => [new MultimediaModel(saved), ...list]);
        this.isUploading.set(false);
        this.showUploadModal = false;
        this.resetUpload();
        this.showToast('Uploaded', `${file.name} uploaded successfully`);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.uploadError.set(
          typeof err?.error === 'string' ? err.error : 'Upload failed. Try again.'
        );
      },
    });
  }

  private resetUpload() {
    this.revokePreview();
    this.selectedUpload.set(null);
    this.uploadError.set(null);
  }

  private revokePreview() {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
  }

  // ───────────── الحذف ─────────────
  confirmDelete(file: MultimediaModel) {
    this.selectedFile = file;
    this.showDeleteModal = true;
  }

  deleteFile(file?: MultimediaModel) {
    if (!file) return;
    this.http.deleteData(`Business/DeleteMedia/${file.id}`).subscribe({
      next: () => {
        this.files.update(list => list.filter(f => f.id !== file.id));
        this.showDeleteModal = false;
        this.showToast('Deleted', `${file.name} deleted successfully`);
      },
      error: () => {
        this.showDeleteModal = false;
        this.showToast('Error', `An error occurred while deleting ${file.name}`);
      },
    });
  }

  // ───────────── أدوات ─────────────
  formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  private showToast(title: string, message: string) {
    this.toastTitle.set(title);
    this.toastMessage.set(message);
    this.toastVisible.set(true);
  }

  onToastVisibleChange(visible: boolean) {
    this.toastVisible.set(visible);
    if (!visible) this.percentage.set(0);
  }

  onTimerChange(value: number) {
    this.percentage.set(value * 25);
  }
} 