import { ActiviityModel } from "../ActivityModel";
import { Country } from "../CountryModel";

export class BusinessModel {
  business_id!: number;
  business_name!: string;
  countryId!: number;
  country?: Country;
  is_active!: boolean;
  business_phone?: string;
  business_webSite?: string;
  business_fb?: string;
  business_instgram?: string;
  business_tiktok?: string;
  business_google?: string;
  business_youtube?: string;
  business_whatsapp?: string;
  business_email?: string;
  business_LogoUrl?: string;
  activites?: ActiviityModel[];
  activities?: ActiviityModel[];
  businessTypes?: any[];
  businessAddresses?: any[];

  insert_on!: string;
  insert_by?: string;

  visible: boolean = true;

  constructor(init?: Partial<BusinessModel>){
    Object.assign(this, init)
  }
}
