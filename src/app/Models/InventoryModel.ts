import { PlatformModel } from './PlatformModel';

export class InventoryModel {
    inventory_id?: number;
    product_name?: string;
    size_id?: number;
    item?: any;
    platform?: PlatformModel;
    folderImages?: number;
    size?: any;


    constructor(init: Partial<InventoryModel>) {
        Object.assign(this, init);
    }
}        