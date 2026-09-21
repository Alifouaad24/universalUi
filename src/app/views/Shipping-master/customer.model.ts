export interface AddressModel {
  countryId?: number;
  country?: string;
  cityId?: number;
  city?: string;
  areaId?: number;
  area?: string;
  landmark?: string;
}

export interface CustomerModel {
  id: number;
  code: string;
  name: string;
  phone: string;
  addressModel?: AddressModel[];
}

/** يطابق CustomerModel.fromJson في تطبيق Flutter */
export function parseCustomer(json: any): CustomerModel {
  return {
    id: json.globalCustomerId,
    code: json.customerCode?.toString() ?? '',
    name: json.customerName?.toString() ?? '',
    phone: json.customerMobile?.toString() ?? '',
    addressModel: (json.address as any[] | undefined)?.map((e) => ({
      countryId: e.country?.countryId,
      country: e.country?.name ?? e.country?.description,
      cityId: e.city?.cityId,
      city: e.city?.description,
      areaId: e.area?.areaId,
      area: e.area?.description,
      landmark: e.land_Mark,
    })),
  };
}

/** يطابق getter address في CustomerModel (Flutter): المدينة - المنطقة - نقطة العلام */
export function customerAddress(c: CustomerModel): string {
  const a = c.addressModel?.[0];
  if (!a) return '—';
  const parts = [a.city, a.area, a.landmark]
    .map((p) => p?.trim())
    .filter((p): p is string => !!p && p.length > 0);
  return parts.length ? parts.join(' - ') : '—';
}
