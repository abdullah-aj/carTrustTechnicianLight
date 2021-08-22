// @flow

import CustomerSearch_Mapping from './_mapping';
import axios from 'axios';
import Otp_Mapping from './_mapping';
import type {
  AddCustomerReqType,
  sendTermsBySmsReqType,
  sendTermsBySmsResType,
} from './_types';
import CustomerAdd_Mapping from './_mapping';

const msgRqHdr = {};

class Customer extends CustomerAdd_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async AddCustomer(req: AddCustomerReqType): any {
    const requestData = this.CustomerAdd_Mapping(req);
    const FUNCTION_URL = `customers/addUpdate`;

    console.log('..........>Reached Add customer', requestData);
    if (requestData) {
      try {
        const response = await this.callAPI(
          'post',
          FUNCTION_URL,
          requestData,
          msgRqHdr,
        );
        return Promise.resolve(this.AddCustomerResType(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async sendTermsBySms(req: sendTermsBySmsReqType): any {
    const requestData = this.sendTermsBySmsReqMap(req);
    const FUNCTION_URL = `customer/sendSms`;

    if (requestData) {
      try {
        const response = await this.callAPI(
          'post',
          FUNCTION_URL,
          requestData,
          msgRqHdr,
        );
        return Promise.resolve(this.sendTermsBySmsResMap(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Customer;
