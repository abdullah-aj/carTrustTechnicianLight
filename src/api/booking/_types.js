// @flow

export interface BookingInterface {
  getBookingSchedule(req: scheduleReqType): Promise<scheduleResType>;
  getBookingsList(req: bookingsListReqType): Promise<bookingsListResType>;
  addBookingSchedule(
    req: addBookingScheduleReqType,
  ): Promise<addBookingScheduleResType>;
  getBookingDetail(
    req: getBookingDetailReqType,
  ): Promise<getBookingDetailResType>;
  acceptTerms(req: acceptTermsReqType): Promise<acceptTermsResType>;
  setBookingStatus(
    req: setBookingStatusReqType,
  ): Promise<setBookingStatusResType>;
  updateAgent(req: updateAgentReqType): Promise<updateAgentResType>;
  getCustomerBookingsList(
    req: CustomerBookingsListReqType,
  ): Promise<CustomerBookingsListResType>;
  redoBooking(req: redoBookingReqType): Promise<redoBookingResType>;
  getSettings(): Promise<getSettingsResType>;
}

export type scheduleReqType = {
  technicianId: number,
  date: string,
};

export type scheduleResType = {
  data: Object,
};

export type bookingsListReqType = {
  technician_id: number,
  fromdate: string,
  todate: string,
  status: Array<string>,
};

export type bookingsListResType = {
  data: Object,
};

export type addBookingScheduleReqType = {
  agent_id: number,
  vehicle_id: number,
  customer_id: number,
  appointment_date: string,
  appointment_from: string,
  appointment_to: string,
  type: number,
};

export type addBookingScheduleResType = {
  success: boolean,
  data: {
    booking_schedule: Object,
  },
};

export type getBookingDetailReqType = {
  bookingId: number,
};

export type getBookingDetailResType = {
  data: Object,
};

export type acceptTermsReqType = {
  id: number,
  customer_signature: any,
  memetype: string,
};

export type acceptTermsResType = {
  data: Object,
};

export type setBookingStatusReqType = {
  booking_id: number,
  status:
    | 'Awaiting_Payment'
    | 'Paid'
    | 'Started'
    | 'visually_inspected'
    | 'Paused'
    | 'Resumed'
    | 'Completed'
    | 'Cancelled after payment'
    | 'Cancelled before payment',
};

export type setBookingStatusResType = {
  data: Object,
};

export type updateAgentReqType = {
  booking_id: number,
  agent_id: number,
};

export type updateAgentResType = {
  data: Object,
};

export type CustomerBookingsListReqType = {
  customer_id: number,
};

export type CustomerBookingsListResType = {
  data: Object,
};

export type redoBookingReqType = {
  booking_id: number,
};

export type redoBookingResType = {
  data: Object,
};

export type getSettingsResType = {
  data: Object,
};
