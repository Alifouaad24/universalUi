import { UnitModel, parseUnit } from './unit.model';

export interface OrderStatusModel {
  orderStatusId: number;
  statusAr: string;
  statusEn: string;
}

export interface CaseImageModel {
  caseImageId: number;
  imageUrl: string;
}

export interface CityModel {
  cityId: number;
  description?: string;
  countryId?: number;
  isNorth?: number;
}

export interface AreaModel {
  areaId: number;
  description?: string;
  cityId?: number;
  sector?: number;
  zone?: number;
  spec?: number;
}

export interface AddressModel {
  address_id: number;
  line_1?: string;
  line_2?: string;
  logntute?: string;
  lattute?: string;
  stateId?: number;
  postCode?: string;
  usCity?: string;
  landMark?: string;
  cityId?: number;
  city?: CityModel;
  areaId?: number;
  area?: AreaModel;
  countryId?: number;
  insertOn?: string;
  insertBy?: string;
  visible?: boolean;
}

export interface OrderCustomerModel {
  globalCustomerId: number;
  customerName: string;
  customerMobile?: string;
  customerEmail?: string;
  customerCode?: string;
  customerImage?: string;
  address?: AddressModel[];
}

export interface GlobalOrderDetailModel {
  globalOrderDetailId: number;
  unitId?: number;
  notes?: string;
  imageUrl?: string;
  cost?: number;
  discount?: number;
  paid?: number;
  priceDollar?: number;
  priceIQ?: number;
  unitValue?: number;
  unit?: UnitModel;
  orderStatus?: OrderStatusModel;
}

export interface GlobalOrderModel {
  globalOrderId: number;
  insertDate: string;
  scheduleDt?: string;
  scheduleTime?: string;
  notes?: string;
  images?: CaseImageModel[];
  orderStatus?: OrderStatusModel;
  orderDetails?: GlobalOrderDetailModel[];
  customer?: OrderCustomerModel;
}

function parseOrderStatus(json: any): OrderStatusModel | undefined {
  if (!json) return undefined;
  return {
    orderStatusId: json.orderStatusId,
    statusAr: json.statusAr,
    statusEn: json.statusEn,
  };
}

function parseOrderDetail(json: any): GlobalOrderDetailModel {
  return {
    globalOrderDetailId: json.globalOrderDetailId,
    unitId: json.unitId ?? undefined,
    notes: json.notes ?? undefined,
    cost: json.cost != null ? Number(json.cost) : undefined,
    discount: json.discount != null ? Number(json.discount) : undefined,
    paid: json.paid != null ? Number(json.paid) : undefined,
    priceDollar: json.priceDollar != null ? Number(json.priceDollar) : undefined,
    priceIQ: json.priceIQ != null ? Number(json.priceIQ) : undefined,
    unitValue: json.unitValue != null ? Number(json.unitValue) : undefined,
    unit: json.unit ? parseUnit(json.unit) : undefined,
    imageUrl: json.imageUrl ?? '',
    orderStatus: parseOrderStatus(json.orderStatus),
  };
}

function parseCity(json: any): CityModel | undefined {
  if (!json) return undefined;
  return {
    cityId: json.cityId,
    description: json.description ?? undefined,
    countryId: json.countryId ?? undefined,
    isNorth: json.isNorth ?? undefined,
  };
}

function parseArea(json: any): AreaModel | undefined {
  if (!json) return undefined;
  return {
    areaId: json.areaId,
    description: json.description ?? undefined,
    cityId: json.cityId ?? undefined,
    sector: json.sector ?? undefined,
    zone: json.zone ?? undefined,
    spec: json.spec ?? undefined,
  };
}

function parseAddress(json: any): AddressModel {
  return {
    address_id: json.address_id,
    line_1: json.line_1 ?? undefined,
    line_2: json.line_2 ?? undefined,
    logntute: json.logntute ?? undefined,
    lattute: json.lattute ?? undefined,
    stateId: json.stateId ?? undefined,
    postCode: json.post_code ?? json.postCode ?? undefined,
    usCity: json.us_city ?? json.usCity ?? undefined,
    landMark: json.land_Mark ?? json.land_Mark ?? undefined,
    cityId: json.cityId ?? undefined,
    city: parseCity(json.city),
    areaId: json.areaId ?? undefined,
    area: parseArea(json.area),
    countryId: json.countryId ?? undefined,
    insertOn: json.insert_on ?? json.insertOn ?? undefined,
    insertBy: json.insert_by ?? json.insertBy ?? undefined,
    visible: json.visible ?? undefined,
  };
}

function parseOrderCustomer(json: any): OrderCustomerModel | undefined {
  if (!json) return undefined;
  return {
    globalCustomerId: json.globalCustomerId,
    customerName: json.customerName,
    customerMobile: json.customerMobile ?? undefined,
    customerEmail: json.customerEmail ?? undefined,
    customerCode: json.customerCode ?? undefined,
    customerImage: json.customerImage ?? undefined,
    address: Array.isArray(json.address)
      ? (json.address as any[]).map(parseAddress)
      : undefined,
  };
}

/** يطابق GlobalOrderModel.fromJson في Flutter */
export function parseGlobalOrder(json: any): GlobalOrderModel {
  return {
    globalOrderId: json.globalOrderId,
    insertDate: json.insertDate,
    scheduleDt: json.schedule_dt ?? undefined,
    scheduleTime: json.schedule_time ?? undefined,
    notes: json.notes ?? undefined,
    images: json.orderImages
      ? (json.orderImages as any[]).map((e) => ({
        caseImageId: e.caseImageId,
        imageUrl: e.imageUrl,
      }))
      : undefined,
    orderStatus: parseOrderStatus(json.orderStatus),
    orderDetails: json.globalOrderDetail
      ? (json.globalOrderDetail as any[]).map(parseOrderDetail)
      : undefined,
    customer: parseOrderCustomer(json.customer),
  };
}

/** لون شارة الحالة — يطابق _statusColor في showOrdersHistoryScreen.dart */
export function statusColor(order: GlobalOrderModel): string {
  switch (order.orderStatus?.orderStatusId) {
    case 11:
      return '#3B82F6';
    case 17:
      return '#F59E0B';
    case 13:
      return '#10B981';
    default:
      return '#6B7280';
  }
}

/** يطابق _unitNameFor في showOrdersHistoryScreen.dart */
export function unitNameFor(detail: GlobalOrderDetailModel, units: UnitModel[]): string {
  if (detail.unit?.name) return detail.unit.nameAr;
  if (detail.unitId != null) {
    const found = units.find((u) => u.unitId === detail.unitId);
    if (found) return found.nameAr;
  }
  return '—';
}