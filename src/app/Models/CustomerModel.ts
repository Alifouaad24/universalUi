import { Country } from "./CountryModel"
import { AddressModel } from "./AddressModel"
import { CustomerBusenessModel } from "./customerBusiness"

export class CustomerModel {
    GlobalCustomerId: number = 0
    CustomerName: string = ''
    CustomerMobile: string = ''
    CustomerEmail: string = ''
    CustomerImage: string = ''
    Country_id: number = 0
    Country: Country = new Country()
    AddressId: number = 0
    Address: AddressModel = new AddressModel()
    Buseness_Customer: CustomerBusenessModel[] = []
    constructor(init?: Partial<CustomerModel>) {
        Object.assign(this, init)
    }
}