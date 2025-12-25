export class UserModel {
    id: string = ''
    userName: string = ''
    email: string = ''
    userPassword: string = ''
    constructor(init?: Partial<UserModel>) {
        Object.assign(this, init)
    }
}