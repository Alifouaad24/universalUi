import { CityModel } from "./CityModel";

export class AreaModel {
  areaId: number = 0;
  description: string = '';
  cityId: number = 0;
  zone: number = 0;
  sector: number = 0;
  spec: number = 0;   
  City: CityModel = new CityModel();
  
    constructor(init?: Partial<AreaModel>) {
        Object.assign(this, init);
    }
}