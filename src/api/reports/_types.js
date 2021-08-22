// @flow

export interface ReportsInterface {
  getReports(req: getReportsReqType): Promise<getReportsResType>;
  bindQr(req: bindQrReqType): Promise<bindQrResType>;
}

export type getReportsReqType = {
  bookingId: number,
};

export type getReportsResType = {
  data: Object,
};

export type bindQrReqType = {
  booking_id: number,
  sticker_id: number,
};

export type bindQrResType = {
  data: Object,
};
