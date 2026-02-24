export class InventoryModel {
    inventory_id?: number;
    product_name?: string;
    item?: any;


    constructor(init: Partial<InventoryModel>) {
        Object.assign(this, init);
    }
}        