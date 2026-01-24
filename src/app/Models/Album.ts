export class AlbumModel {
    userImagesId?: number
    imageUrl?: string

    constructor(init: Partial<AlbumModel>) {
        Object.assign(this, init);
    }
}