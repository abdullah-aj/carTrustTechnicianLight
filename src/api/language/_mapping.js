// @flow

import type {getTranslationReqType, getTranslationResType} from './_types';

class Language_Mapping {
  constructor() {}

  getTranslationReqMapping(req: getTranslationReqType): Object {
    return req;
  }

  getTranslationResMapping(res: getTranslationResType): Object {
    return res;
  }
}

export default Language_Mapping;
