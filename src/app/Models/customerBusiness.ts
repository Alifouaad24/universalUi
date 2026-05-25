import { Country } from "./CountryModel"
import { AddressModel } from "./AddressModel"
import { CustomerModel } from "./CustomerModel"
import { BusinessModel } from "./Business/BusinessModel"

export class CustomerBusenessModel {
    buseness_CustomerId: number = 0
    globalCustomer: CustomerModel = new CustomerModel()
    globalCustomerId: number = 0
    business: BusinessModel = new BusinessModel()
    business_id: number = 0
    
    constructor(init?: Partial<CustomerBusenessModel>) {
        Object.assign(this, init)
    }
}