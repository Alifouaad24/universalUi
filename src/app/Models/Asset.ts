export class AssetModel {
    assetId?: number
    assetName?: string
    assetType?: string

    constructor(init: Partial<AssetModel>) {
        Object.assign(this, init);
    }
}