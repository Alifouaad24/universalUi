import { BusinessModel } from "./Business/BusinessModel";
import { ServiceModel } from "./ServiceModel";

export class FeatureModel {
    featureId?: number;
    title?: string;
    body?: string;
    status?: string;
    comments?: string[];
    system?: any;
    Business?: BusinessModel
    Service?: ServiceModel


    constructor(init?: Partial<FeatureModel>) {
        Object.assign(this, init)
    }
}