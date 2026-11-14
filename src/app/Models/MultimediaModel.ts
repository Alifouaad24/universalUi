export type MultimediaResourceType = 'image' | 'video' | 'raw';

export class MultimediaModel {
  multimediaId?: number;
  business_id = 0;
  fileUrl = '';
  publicId = '';
  resourceType: MultimediaResourceType = 'image';
  format = '';
  name = '';
  bytes = 0;
  createdAt?: string;

  constructor(init?: Partial<MultimediaModel>) {
    Object.assign(this, init);
  }

  // ── أسماء مختصرة يستخدمها الكومبوننت والقالب ──
  get id() { return this.multimediaId; }
  get url() { return this.fileUrl; }

  // Cloudinary يصنّف PDF كـ image، لذلك نفحص الصيغة
  get isPdf() { return this.format?.toLowerCase() === 'pdf'; }
  get isImage() { return this.resourceType === 'image' && !this.isPdf; }
  get isVideo() { return this.resourceType === 'video'; }

  /** نسخة مصغّرة ومضغوطة من الصورة للعرض في الشبكة */
  get thumbnail() {
    return this.isImage
      ? this.fileUrl.replace('/upload/', '/upload/c_fill,w_400,h_260,q_auto,f_auto/')
      : this.fileUrl;
  }
}