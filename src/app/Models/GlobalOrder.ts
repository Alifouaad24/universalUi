export class GlobalOrder {
  globalOrderId!: number;

  customer?: any | null;
  globalCustomerId?: number | null;

  business?: any | null;
  business_id!: number;

  carInfoTbl?: any | null;
  carInfoTblId?: number | null;

  insertDate!: string;
  schedule_dt?: string | null;
  schedule_time?: string | null;
  notes?: string | null;

  orderImages?: any[] | null;

  platform?: any | null;
  platform_id?: number | null;

  shippingType?: any | null;
  shippingTypeId?: number | null;

  service?: any | null;
  service_id?: number | null;

  orderStatus?: UniversalOrderStatus | null;
  orderStatusId?: number | null;

  globalOrderDetail?: GlobalOrderDetail[] | null;

  cart_value?: string | null;

  createdBy?: string | null;
  modified_by?: string | null;
  createdDate!: string;

  consumerBusiness?: any | null;
  consumerBusiness_id?: number | null;

  identityUserData?: any | null;
  identityUserDataId?: string | null;
  comments?: Comment[] | null;

  assignerTypeId?: number | null;
  assignerType?: { assign_typeId: number; type: string } | null;
  assignerId?: number | null;
  assignerName?: string | null;

  assigneeTypeId?: number | null;
  assigneeType?: { assign_typeId: number; type: string } | null;
  assigneeId?: number | null;
  assigneeName?: string | null;

  constructor(data?: Partial<GlobalOrder>) {
    if (data) {
      Object.assign(this, data);

      this.globalOrderDetail =
        data.globalOrderDetail?.map(
          item => new GlobalOrderDetail(item)
        ) ?? [];
    }
  }
}


export class GlobalOrderDetail {
  globalOrderDetailId!: number;

  service?: any | null;
  service_id?: number | null;

  orderStatus?: UniversalOrderStatus | null;
  serviceStatusId?: number | null;

  item?: any | null;
  itemId?: number | null;

  globalOrderId?: number | null;

  notes?: string | null;

  cost?: number | null;
  discount?: number | null;
  paid?: number | null;

  priceDollar?: number | null;
  priceIQ?: number | null;

  identityUserData?: any | null;
  identityUserDataId?: string | null;

  case_Service_Notes?: any[] | null;

  complaint?: any | null;
  complaintId?: number | null;

  cause?: any | null;
  causeId?: number | null;

  constructor(data?: Partial<GlobalOrderDetail>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}


export class UniversalOrderStatus {
  orderStatusId!: number;

  business?: any | null;
  business_id?: number | null;

  service?: any | null;
  service_id?: number | null;

  statusAr!: string;
  statusEn!: string;

  constructor(data?: Partial<UniversalOrderStatus>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}


export class Comment {
  commentId!: number;

  commentContent!: string;

  addedBy?: string | null;

  addedOn?: string | null;

  featureId?: number | null;

  isRead!: boolean;

  globalOrderId?: number | null;

  constructor(data?: Partial<Comment>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}