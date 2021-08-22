// @flow

import Reports_Mapping from './_mapping';
import type {
  getReportsReqType,
  getReportsResType,
  bindQrReqType,
  bindQrResType,
} from './_types';

class Report extends Reports_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async getReports(req: getTranslationReqType): any {
    const params = this.getReportsReqMapping(req);
    const URL = `inspection`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '/url/' + params);
        return Promise.resolve(this.getReportsResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async bindQr(req: bindQrReqType): any {
    const URL = `https://partner-api.cartrust.sa/api/sticker/link`;
    const HEADER = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const params = this.bindQrReqMapping(req);

    if (params) {
      try {
        const response = await fetch(URL, {
          headers: HEADER,
          method: 'POST',
          body: JSON.stringify(params),
        });
        const data = await response.json();
        return Promise.resolve(this.bindQrResMapping(data));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Report;
