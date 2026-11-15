export class SystemModel {
    globalSystemId?: number;
    globalSystemName?: string;
    globalSystemType?: any;
    globalSystemUrl?: string;
    businessGroup?: any


    constructor(init?: Partial<SystemModel>) {
        Object.assign(this, init)
    }
}