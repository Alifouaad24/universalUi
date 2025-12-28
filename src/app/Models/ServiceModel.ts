export class ServiceModel {
    service_id?: number
    description?: String
    activiity?: any
    insert_on?: string
    service_icon?: string
    isPublic?: boolean
    business_Services?: any
    service_Route?: string
    service_Activities?: any
    constructor(init?: Partial<ServiceModel>){
        Object.assign(this, init)
    }
}