export class ComplaimentModel {
    complaintId?: number
    complaint_ValueId?: number
    complaint_Value?: Complaint_Value

    constructor(init?: Partial<ComplaimentModel>) {
        Object.assign(this, init)
    }

}



export class Complaint_Value {
    complaint_ValueId?: number
    complaintTypeId?: number
    value?: string
    description?: string
    complaintType?: ComplaintType

    constructor(init?: Partial<Complaint_Value>) {
        Object.assign(this, init)
    }
}

export class ComplaintType {
    complaintTypeId?: number
    name?: string

    constructor(init?: Partial<ComplaintType>) {
        Object.assign(this, init)
    }
}