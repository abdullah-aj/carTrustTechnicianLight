// @flow

import type {
    TestCategoriesReqType,
    OngoingCPOSReqType,
    TestAnswerResType,
    TestAnswerReqType,
    TestFinishResType,
    TestFinishReqType,
    GetSummaryReqType,
    GetSummaryResType
} from './_types';

const tempDataForOngoingCPOS = [
  {
    carName: 'Camry',
    completion: '20',
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
  {
    carName: 'Accord',
    completion: '20',
    vin: '54215DF7845GGT',
    year: '2012',
    date: '12-06-2021',
  },
  {
    carName: 'Altima',
    completion: '20',
    vin: '54215DF7845GGT',
    year: '2013',
    date: '12-06-2021',
  },
  {
    carName: 'Polo',
    completion: '20',
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
];

class TestsCategories_Mapping {
  constructor() {}

  testsReqMapping(req: TestCategoriesReqType) {}

  testsResMapping(res) {
    return {data: res.data};
  }

  OngoingCPOSReqMapping(req: OngoingCPOSReqType) {}

  OngoingCOPSResMapping(res) {
    //return {data: res.data}

    return tempDataForOngoingCPOS;
  }

  testAnswerReqMapping(req: TestAnswerReqType) {
    return req;
  }

  testAnswerResMapping(res: TestAnswerResType) {
    return res;
  }

  testFinishReqMapping(req: TestFinishReqType) {
    return req;
  }

  testFinishResMapping(req: TestFinishResType) {
    return req;
  }

  getSummaryReqMapping(req: GetSummaryReqType) {
     return req;
  }

  getSummaryResMapping(req: GetSummaryResType) {
    return req.data;
  }
}

export default TestsCategories_Mapping;
