export class ServiceModel {
    service_id?: number
    description?: String
    activiity?: any
    insert_on?: string

    constructor(init?: Partial<ServiceModel>){
        Object.assign(this, init)
    }
}