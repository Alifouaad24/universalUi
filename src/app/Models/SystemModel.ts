export class SystemModel {
    globalSystemId?: number;
    globalSystemName?: string;
    globalSystemType?: any;
    globalSystemUrl?: string;


    constructor(init?: Partial<SystemModel>) {
        Object.assign(this, init)
    }
}