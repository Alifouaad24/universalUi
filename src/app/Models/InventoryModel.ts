import { PlatformModel } from './PlatformModel';

export class InventoryModel {
    inventory_id?: number;
    product_name?: string;
    item?: any;
    platform?: PlatformModel;
    folderImages?: number;


    constructor(init: Partial<InventoryModel>) {
        Object.assign(this, init);
    }
}        