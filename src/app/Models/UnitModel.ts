export class UnitModel {
    unitId: number = 0
    name: string = ''

    constructor(init?: Partial<UnitModel>){
        Object.assign(this, init)
    }
}