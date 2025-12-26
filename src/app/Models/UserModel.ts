import { BusinessModel } from "./Business/BusinessModel"
import { RloeModel } from "./RloeModel"

export class UserModel {
    id: string = ''
    userName: string = ''
    email: string = ''
    userPassword: string = ''
    roles?: any[]
    businesses?: BusinessModel[]

    constructor(init?: Partial<UserModel>) {
        Object.assign(this, init)
    }
}