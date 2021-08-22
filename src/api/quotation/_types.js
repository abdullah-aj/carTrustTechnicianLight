// @flow

export interface QuotationInterface {
  getManufacturers(
    req: getManufacturersReqType,
  ): Promise<getManufacturersResType>;
  getVehicleTypes(req: getVehicleTypesReqType): Promise<getVehicleTypesResType>;
  getModels(req: getModelsReqType): Promise<getModelsResType>;
  getYears(req: getYearsReqType): Promise<getYearsResType>;
  getQuotation(req: getQuotationReqType): Promise<getQuotationResType>;
  sendSms(req: sendSmsReqType): Promise<sendSmsResType>;
  sendEmail(req: sendEmailReqType): Promise<sendEmailResType>;
}

export type getManufacturersReqType = {};

export type getManufacturersResType = {
  data: Object,
};

export type getVehicleTypesReqType = {};

export type getVehicleTypesResType = {
  data: Object,
};

export type getModelsReqType = {
  manufacturerId: number,
};

export type getModelsResType = {
  data: Object,
};

export type getYearsReqType = {};

export type getYearsResType = {
  data: Object,
};

export type getQuotationReqType = {
  manufacturerId: number,
  modelId: number,
  yearId: number,
};

export type getQuotationResType = {
  data: Object,
};

export type sendSmsReqType = {
  manufacturerId: number,
  modelId: number,
  yearId: number,
  //name: string,
  phone: string,
  //message: string,
};

export type sendSmsResType = {
  data: Object,
};

export type sendEmailReqType = {
  manufacturerId: number,
  modelId: number,
  yearId: number,
  //name: string,
  email: string,
  //message: string,
};

export type sendEmailResType = {
  data: Object,
};
