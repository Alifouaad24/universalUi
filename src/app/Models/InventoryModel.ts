import { PlatformModel } from './PlatformModel';

export class InventoryModel {
    inventory_id?: number;
    qty?: number;
    product_name?: string;
    sku?: string;
    size_id?: number;
    item?: any;
    category_id?: number;
    platform?: PlatformModel;
    folderImages?: number;
    notFound?: boolean;
    sitePrice?: string;
    size?: any;
    platform_id?: number
    category?: any
    product_description?: string
    status?: string
    ebayInvID?: string;
    ebayOfferID?: string;
    ebayListingId?: string;
    Product_name?: string;
    itemCondition?: any;
    constructor(init: Partial<InventoryModel>) {
        Object.assign(this, init);
    }
}        