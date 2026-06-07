export class FeatureModel {
    featureId?: number;
    title?: string;
    body?: string;
    status?: string;
    comments?: string[];
    system?: any;

    constructor(init?: Partial<FeatureModel>) {
        Object.assign(this, init)
    }
}