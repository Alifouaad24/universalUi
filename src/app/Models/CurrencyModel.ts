export class CurrencyModel {
    currencyId: number = 0
    code: string = ''

    constructor(init?: Partial<CurrencyModel>){
        Object.assign(this, init)
    }
}