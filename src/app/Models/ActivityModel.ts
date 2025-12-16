export class ActiviityModel {
    activity_id?: number;
    description?: string
    Business_id?: number
    business?: any
    insert_on?: string

    constructor(init?: Partial<ActiviityModel>) {
        Object.assign(this, init)
    }
}