import { PlatformModel } from './PlatformModel';

export class InventoryModel {
    inventory_id?: number;
    qty?: number;
    product_name?: string;
    size_id?: number;
    item?: any;
    category_id?: number;
    platform?: PlatformModel;
    folderImages?: number;
    notFound?: boolean;
    sitePrice?: string;
    size?: any;


    constructor(init: Partial<InventoryModel>) {
        Object.assign(this, init);
    }
}        