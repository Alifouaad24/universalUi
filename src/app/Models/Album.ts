export class AlbumModel {
    userImagesId?: number
    itemId?: number
    imageUrl?: string
    folderId?: number
    isProccessed?: boolean

    constructor(init: Partial<AlbumModel>) {
        Object.assign(this, init);
    }
}