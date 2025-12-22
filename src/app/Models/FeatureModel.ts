export class FeatureModel {
    featureId?: number;
    name?: string;
    service?: any;

    constructor(init?: Partial<FeatureModel>) {
        Object.assign(this, init)
    }
}