import type {
  checkEligibilityReqType,
  checkEligibilityResType,
  upgradeInspectionReqType,
  upgradeInspectionResType,
} from './_types';

class Upgrade_Mapping {
  constructor() {}

  checkEligibilityReqMapping(req: checkEligibilityReqType): Object {
    return req;
  }

  checkEligibilityResMapping(res: checkEligibilityResType): Object {
    return res.data;
  }

  upgradeInspectionReqMapping(req: checkEligibilityReqType): Object {
    return req;
  }

  upgradeInspectionResMapping(res: checkEligibilityResType): Object {
    return res;
  }
}

export default Upgrade_Mapping;
