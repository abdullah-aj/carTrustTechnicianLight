// @flow

export interface TestsCategoriesInterface {
  getTestCategories(): Promise<TestCategoriesResType>;
  submitAnswer(req: TestAnswerReqType): Promise<TestAnswerResType>;
  finishTest(req: TestFinishReqType): Promise<TestFinishResType>;
  getSummary(req: GetSummaryReqType): Promise<GetSummaryResType>;
}

export type TestCategoriesReqType = {};

export type TestCategoriesResType = {
  data: {
    stages: Array<Object>,
  },
};

export type OngoingCPOSReqType = {};

export type OngoingCPOSResType = {
  data?: string,
};

export type TestAnswerReqType = {
  stage_id: number,
  step_id: number,
  booking_id: number,
  type: any,
  score: number,
  not_applicable: number,
  answer: string
};

export type TestAnswerResType = {
  data: Object,
};

export type TestFinishReqType = {
  bookingId: number,
};

export type TestFinishResType = {
  data: Object,
};

export type GetSummaryReqType = {
  booking_id: number,
};

export type GetSummaryResType = {
  data: {
    summary: Array<any>,
  },
};
