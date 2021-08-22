// @flow

import type {visualInspectionReqType, visualInspectionResType} from './_types';

class Visual_Mapping {
  constructor() {}

  visualInspectionReqMapping(req: visualInspectionReqType): Object {
    return req;
  }

  visualInspectionResMapping(res: visualInspectionResType): Object {
    return res.data;
  }
}

export default Visual_Mapping;
