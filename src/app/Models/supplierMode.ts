import { BusinessModel } from "../Models/Business/BusinessModel";
export class SupplierModel {
    supplierId?: number
    business?: BusinessModel
    Business_id?: number
    isActive?: boolean
    supplierPlatform?: any[]
    constructor(init?: Partial<SupplierModel>) {
        Object.assign(this, init)
    }
}