// @flow

export interface LanguageInterface {
  getTranslation(req: getTranslationReqType): Promise<getTranslationResType>;
}

export type getTranslationReqType = {
  language: string,
};

export type getTranslationResType = {
  data: Object,
};
