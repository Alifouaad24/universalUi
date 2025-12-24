export class ServiceModel {
    service_id?: number
    description?: String
    activiity?: any
    insert_on?: string
    service_icon?: string
    isPublic?: boolean

    constructor(init?: Partial<ServiceModel>){
        Object.assign(this, init)
    }
}