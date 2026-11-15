export class PlatformModel {
    platform_id: number = 0
    description: string = ''
    productUrl: string = ''
    productKey: string = ''
    businessPlatforms: any
    chat?: boolean
    post?: boolean
    ads?: boolean
    account?: boolean

    constructor(init?: Partial<PlatformModel>){
        Object.assign(this, init)
    }
}