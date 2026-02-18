export class AlbumModel {
    userImagesId?: number
    imageUrl?: string
    folderId?: number

    constructor(init: Partial<AlbumModel>) {
        Object.assign(this, init);
    }
}