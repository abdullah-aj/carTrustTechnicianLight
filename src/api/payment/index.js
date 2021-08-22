// @flow

import Payment_Mapping from './_mapping';
import type {addPaymentReqType, addPaymentResType} from './_types';
import axios from 'axios';

const msgRqHdr = {};

class Payment extends Payment_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async addPayment(req: addPaymentReqType): any {
    const params = this.addPaymentReqMapping(req);
    if (params) {
      const URL = `payment/addUpdate`;
      try {
        const response = await this.callAPI(
          'post',
          URL,
          params,
          {},
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return Promise.resolve(this.addPaymentResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Payment;
