export class PlatformModel {
    platform_id: number = 0
    description: string = ''

    constructor(init?: Partial<PlatformModel>){
        Object.assign(this, init)
    }
}