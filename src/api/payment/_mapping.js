// @flow

import type {addPaymentReqType, addPaymentResType} from './_types';

class Payment_Mapping {
  constructor() {}

  addPaymentReqMapping(req: addPaymentReqType): Object {
    return req;
  }

  addPaymentResMapping(res: addPaymentResType): Object {
    return res;
  }
}

export default Payment_Mapping;
