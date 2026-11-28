export class SystemModel {
    globalSystemId?: number;
    globalSystemName?: string;
    globalSystemType?: any;
    globalSystemUrl?: string;
    businessGroup?: any
    businessGroupId?: number


    constructor(init?: Partial<SystemModel>) {
        Object.assign(this, init)
    }
}