export class InventoryModel {
    inventory_id?: number;
    product_name?: string;


    constructor(init: Partial<InventoryModel>) {
        Object.assign(this, init);
    }
}        