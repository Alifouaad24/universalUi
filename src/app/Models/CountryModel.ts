export class Country {
  countryId?: number;
  name: string = '';
  businesses?: any[]; 
  insert_on: string = ''; 
  insert_by?: string;
  visible: boolean = true;

  constructor(init?: Partial<Country>) {
    Object.assign(this, init);
  }
}
