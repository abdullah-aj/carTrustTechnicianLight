// @flow

import Language_Mapping from './_mapping';
import type {getTranslationReqType, getTranslationResType} from './_types';

class Language extends Language_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async getTranslation(req: getTranslationReqType): any {
    const params = this.getTranslationReqMapping(req);
    const URL = `language-label`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.getTranslationResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Language;
