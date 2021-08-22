// @flow

export interface CustomerInterface {
  AddCustomer(req: AddCustomerReqType): Promise<AddCustomerResType>;
  sendTermsBySms(req: sendTermsBySmsReqType): Promise<sendTermsBySmsResType>;
}

export type AddCustomerReqType = {
  mobile: string,
  firstName: string,
  lastName: string,
  email: string,
};

export type AddCustomerResType = {
  message?: string,
};

export type sendTermsBySmsReqType = {
  key: string,
  customer_id: number,
};

export type sendTermsBySmsResType = {
  data: Object,
};
