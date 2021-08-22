// @flow

import type {
  getManufacturersReqType,
  getManufacturersResType,
  getVehicleTypesReqType,
  getVehicleTypesResType,
  getModelsReqType,
  getModelsResType,
  getYearsReqType,
  getYearsResType,
  getQuotationReqType,
  getQuotationResType,
  sendSmsReqType,
  sendSmsResType,
  sendEmailReqType,
  sendEmailResType,
} from './_types';

class Quotation_Mapping {
  constructor() {}

  getManufacturersResMapping(res: getManufacturersResType): Object {
    return res.data.Manufacturer;
  }

  getVehicleTypesResMapping(res: getVehicleTypesResType): Object {
    return res.data.vehicleCategories;
  }

  getModelsReqMapping(req: getModelsReqType): Object {
    return req.manufacturerId;
  }

  getModelsResMapping(res: getModelsResType): Object {
    return res.data.Model;
  }

  getYearsReqMapping(req: getYearsReqType): Object {
    return req;
  }

  getYearsResMapping(res: getYearsResType): Object {
    return res.data.Year;
  }

  getQuotationReqMapping(req: getQuotationReqType): Object {
    return (
      'manufacturer=' +
      req.manufacturerId +
      '&model=' +
      req.modelId +
      '&year=' +
      req.yearId
    );
  }

  getQuotationResMapping(res: getQuotationResType): Object {
    return res.data;
  }

  sendSmsReqMapping(req: sendSmsReqType): Object {
    return (
      'manufacturer=' +
      req.manufacturerId +
      '&model=' +
      req.modelId +
      '&year=' +
      req.yearId +
      '&phone=' +
      req.phone
    );
  }

  sendSmsResMapping(res: sendSmsResType): Object {
    return res;
  }

  sendEmailReqMapping(req: sendEmailReqType): Object {
    return (
      'manufacturer=' +
      req.manufacturerId +
      '&model=' +
      req.modelId +
      '&year=' +
      req.yearId +
      '&email=' +
      req.email
    );
  }

  sendEmailResMapping(res: sendEmailResType): Object {
    return res;
  }
}

export default Quotation_Mapping;
