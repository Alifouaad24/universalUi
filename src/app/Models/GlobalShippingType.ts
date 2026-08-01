export class GlobalShippingTypesModel {
    shippingTypeId?: number;
    name?: string;

    constructor(init?: Partial<GlobalShippingTypesModel>) {
        Object.assign(this, init)
    }
}