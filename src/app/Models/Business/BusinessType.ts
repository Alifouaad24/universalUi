export class BusinessType {
  business_type_id: number = 0;
  description: string = '';
  businessTypes?: any[]; 
  insert_on: string = ''; 
  insert_by?: string;
  visible: boolean = true;

  constructor(init?: Partial<BusinessType>) {
    Object.assign(this, init);
  }
}
