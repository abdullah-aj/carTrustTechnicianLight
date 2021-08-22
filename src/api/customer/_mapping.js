// @flow

import type {
  AddCustomerReqType,
  sendTermsBySmsReqType,
  sendTermsBySmsResType,
} from './_types';

class CustomerAdd_Mapping {
  constructor() {}

  CustomerAdd_Mapping(req: AddCustomerReqType): any {
    return {
      phone: req.mobile,
      first_name: req.firstName,
      last_name: req.lastName,
      email: req.email,
    };
  }

  AddCustomerResType(res): any {
    return {data: res};
  }

  sendTermsBySmsReqMap(req: sendTermsBySmsReqType): any {
    return req;
  }

  sendTermsBySmsResMap(res: sendTermsBySmsResType): any {
    return res;
  }
}

export default CustomerAdd_Mapping;
