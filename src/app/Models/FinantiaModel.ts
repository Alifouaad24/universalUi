export class FinantiaModel {
    finantial_itemId?: number;
    finantial_description?: string;

    constructor(init?: Partial<FinantiaModel>) {
        Object.assign(this, init)
    }
}