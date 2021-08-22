// @flow

import TestsCategories_Mapping from './_mapping';
import type {
  TestCategoriesReqType,
  TestAnswerReqType,
  TestAnswerResType,
  TestFinishResType,
  TestFinishReqType,
  GetSummaryReqType,
  GetSummaryResType,
} from './_types';

const msgRqHdr = {};
class TestsCategories extends TestsCategories_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async getTestCategories(): any {
    const FUNCTION_URL = 'cpos';
    // const requestData = this.testsReqMapping(req);

    try {
      const response = await this.callAPI(
        'get',
        FUNCTION_URL,
      );
      return Promise.resolve(this.testsResMapping(response));
    } catch (e) {
      console.log('promise rejection', e);
      return Promise.reject(e);
    }
  }

  async getOngoingCPOS(req: TestCategoriesReqType): * {
    const FUNCTION_URL = 'cpos/stages';
    const requestData = this.testsReqMapping(req);

    try {
      const response = await this.callAPI(
        'get',
        FUNCTION_URL,
        requestData,
        msgRqHdr,
      );
      return Promise.resolve(this.testsResMapping(response));
    } catch (e) {
      console.log('promise rejection', e);
      return Promise.reject(e);
    }
  }

  async submitAnswer(req: TestAnswerReqType): any {
    const FUNCTION_URL = 'cpos/submitstageanswer';
    const requestData = this.testAnswerReqMapping(req);

    try {
      const response = await this.callAPI(
        'post',
        FUNCTION_URL,
        requestData,
        msgRqHdr,
      );
      return Promise.resolve(this.testAnswerResMapping(response));
    } catch (e) {
      console.log('promise rejection', e);
      return Promise.reject(e);
    }
  }

  async finishTest(req: TestFinishReqType): any {
    const FUNCTION_URL = 'cpos/finish';
    const requestData = this.testFinishReqMapping(req);

    try {
      const response = await this.callAPI(
        'post',
        FUNCTION_URL,
        requestData,
        msgRqHdr,
      );
      return Promise.resolve(this.testFinishResMapping(response));
    } catch (e) {
      console.log('promise rejection', e);
      return Promise.reject(e);
    }
  }

  async getSummary(req: GetSummaryReqType): any {
    const FUNCTION_URL = 'cpos/summary';
    const requestData = this.getSummaryReqMapping(req);
    try {
      const response = await this.callAPI(
        'post',
        FUNCTION_URL,
        requestData,
        msgRqHdr,
      );
      return Promise.resolve(this.getSummaryResMapping(response));
    } catch (e) {
      console.log('promise rejection', e);
      return Promise.reject(e);
    }
  }
}

export default TestsCategories;
