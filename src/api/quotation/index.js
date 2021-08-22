// @flow

import Quotation_Mapping from './_mapping';
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
import axios from 'axios';

const msgRqHdr = {};

class Quotation extends Quotation_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async getManufacturers(): any {
    const URL = `vehicle/getManufacturers`;
    try {
      const response = await this.callAPI('get', URL);
      return Promise.resolve(this.getManufacturersResMapping(response));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getVehicleTypes(): any {
    const URL = `vehicle/getCategories`;
    try {
      const response = await this.callAPI('get', URL);
      return Promise.resolve(this.getVehicleTypesResMapping(response));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getModels(req: getModelsReqType): any {
    const params = this.getModelsReqMapping(req);
    console.log(req);
    const URL = `vehicle/getModel`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '/' + params);
        return Promise.resolve(this.getModelsResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async getYears(req: getYearsReqType): any {
    const URL = `vehicle/getYears`;
    try {
      const response = await this.callAPI('get', URL);
      return Promise.resolve(this.getYearsResMapping(response));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getQuotation(req: getQuotationReqType): any {
    const params = this.getQuotationReqMapping(req);
    const URL = `vehicle/calculatePrice`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '?' + params);
        return Promise.resolve(this.getQuotationResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async sendSms(req: sendSmsReqType): any {
    const requestData = this.sendSmsReqMapping(req);
    const URL = `vehicle/calculatePrice`;
    if (requestData) {
      try {
        const response = await this.callAPI('get', URL + '?' + requestData);
        return Promise.resolve(this.sendSmsResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async sendEmail(req: sendEmailReqType): any {
    const requestData = this.sendEmailReqMapping(req);
    const URL = `vehicle/calculatePrice`;
    if (requestData) {
      try {
        const response = await this.callAPI('get', URL + '?' + requestData);
        return Promise.resolve(this.sendEmailResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Quotation;
