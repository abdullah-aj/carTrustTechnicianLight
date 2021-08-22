// @flow

import type {
  getReportsReqType,
  getReportsResType,
  bindQrReqType,
  bindQrResType,
} from './_types';

class Reports_Mapping {
  constructor() {}

  getReportsReqMapping(req: getReportsReqType): Object {
    return req.bookingId;
  }

  getReportsResMapping(res: getReportsResType): Object {
    return res;
  }

  bindQrReqMapping(req: bindQrReqType): Object {
    return req;
  }

  bindQrResMapping(res: bindQrResType): Object {
    return res;
  }
}

export default Reports_Mapping;
