import { Country } from "./CountryModel";

export class StateModel {
  stateId: number = 0;
  name: string = '';
  countryId: number = 0;
  country: Country = new Country();
  
    constructor(init?: Partial<StateModel>) {
        Object.assign(this, init);
    }
}