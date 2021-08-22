// @flow

import Visual_Mapping from './_mapping';
import type {visualInspectionReqType, visualInspectionResType} from './_types';
import axios from 'axios';

const msgRqHdr = {};

class VisualInspection extends Visual_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async addVisualInspection(req: visualInspectionReqType): any {
    const params = this.visualInspectionReqMapping(req);
    const URL = `booking/visualInspection`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL , params);
        return Promise.resolve(this.visualInspectionResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default VisualInspection;
