// @flow

import type {
  scheduleReqType,
  scheduleResType,
  bookingsListReqType,
  bookingsListResType,
  addBookingScheduleReqType,
  addBookingScheduleResType,
  getBookingDetailReqType,
  getBookingDetailResType,
  acceptTermsReqType,
  acceptTermsResType,
  setBookingStatusReqType,
  setBookingStatusResType,
  updateAgentReqType,
  updateAgentResType,
  CustomerBookingsListReqType,
  CustomerBookingsListResType,
  redoBookingReqType,
  redoBookingResType,
  getSettingsResType
} from './_types';

class Booking_Mapping {
  constructor() {}

  scheduleReqMapping(req: scheduleReqType): string {
    return req.technicianId + '/' + req.date;
  }

  scheduleResMapping(res: scheduleResType): Object {
    return res.data.schedule;
  }

  bookingsListReqMapping(req: bookingsListReqType): Object {
    return req;
  }

  bookingsListResMapping(res: bookingsListResType): Object {
    return res.data.bookings;
  }

  addBookingScheduleReqMapping(req: addBookingScheduleReqType): Object {
    return req;
  }

  addBookingScheduleResMapping(res: addBookingScheduleResType): Object {
    return {
      success: res.success,
      data: res.data.booking_schedule,
    };
  }

  getBookingDetailReqMapping(req: getBookingDetailReqType): Object {
    return 'booking_id=' + req.bookingId;
  }

  getBookingDetailResMapping(res: getBookingDetailResType): Object {
    return res.data;
  }

  acceptTermsReqMapping(req: acceptTermsReqType): Object {
    return req;
  }

  acceptTermsResMapping(res: acceptTermsResType): Object {
    return res.data;
  }

  setBookingStatusReqMapping(req: setBookingStatusReqType): Object {
    return req;
  }

  setBookingStatusResMapping(res: setBookingStatusResType): Object {
    return res.data;
  }

  updateAgentReqMapping(req: updateAgentReqType): Object {
    return req;
  }

  updateAgentResMapping(res: updateAgentResType): Object {
    return res;
  }

  CustomerBookingsListReqMapping(req: getBookingDetailReqType): Object {
    return 'customer_id=' + req.customer_id;
  }

  CustomerBookingsListResMapping(res: updateAgentResType): Object {
    return res;
  }

  redoBookingReqMapping(req: redoBookingReqType): Object {
    return req.booking_id;
  }

  redoBookingResMapping(res: redoBookingResType): Object {
    return res;
  }

  getSettingsResMapping(res: getSettingsResType): Object {
    return res;
  }
}

export default Booking_Mapping;
