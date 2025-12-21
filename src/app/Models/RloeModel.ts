export class RloeModel{
    id: string = ''
    name: string = ''

    constructor(init?: Partial<RloeModel>){
        Object.assign(this, init)
    }
}