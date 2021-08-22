// @flow
import Upgrade_Mapping from './_mapping';
import type {
  checkEligibilityReqType,
  checkEligibilityResType,
  upgradeInspectionReqType,
  upgradeInspectionResType,
} from './_types';

class Upgrade extends Upgrade_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async checkEligibility(req: checkEligibilityReqType): any {
    const params = this.checkEligibilityReqMapping(req);
    const URL = `checkInspectionUpgrade`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.checkEligibilityResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async upgradeInspection(req: upgradeInspectionReqType): any {
    const params = this.upgradeInspectionReqMapping(req);
    const URL = `upgradeInspection`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.upgradeInspectionResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Upgrade;
