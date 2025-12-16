export class AddressModel{
    address_id?: number;
    line_1?: string
    line_2?: string
    state?: string
    post_code?: string
    city?: string
    businessAddresses?: string
    insert_on?: string
    insert_by?: string
    visible?: string

    constructor(init?: Partial<AddressModel>){
        Object.assign(this, init)
    }
}