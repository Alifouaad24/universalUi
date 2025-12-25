import { AreaModel } from "./AreaModel";
import { Country } from "./CountryModel";

export class CityModel {
  cityId: number = 0;
  description: string = '';
  countryId: number = 0;
  Country: Country = new Country();
  Areas: AreaModel[] = [];

    constructor(init?: Partial<CityModel>) {
        Object.assign(this, init);
    }
}