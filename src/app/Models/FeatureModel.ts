import { BusinessModel } from "./Business/BusinessModel";
import { ServiceModel } from "./ServiceModel";

export class FeatureModel {
    featureId?: number;
    body?: string;
    status?: string;
    comments?: string[];
    system?: any;
    Business?: BusinessModel
    Service?: ServiceModel
    business_id?: number
    globalSystemId?: number
service_id?: number

    constructor(init?: Partial<FeatureModel>) {
        Object.assign(this, init)
    }
}