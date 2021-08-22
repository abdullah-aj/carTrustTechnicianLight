// @flow

import Booking_Mapping from './_mapping';
import type {
  scheduleReqType,
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
} from './_types';
import axios from 'axios';

const msgRqHdr = {};

class Booking extends Booking_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async getBookingSchedule(req: scheduleReqType): any {
    const params = this.scheduleReqMapping(req);
    const URL = `booking/scheduleslots`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '/' + params);
        return Promise.resolve(this.scheduleResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async getBookingsList(req: bookingsListReqType): any {
    const params = this.bookingsListReqMapping(req);
    const URL = `booking/getagainstagent`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.bookingsListResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async addBookingSchedule(req: addBookingScheduleReqType): any {
    const params = this.addBookingScheduleReqMapping(req);
    const URL = `booking/schedule`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.addBookingScheduleResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async getBookingDetail(req: getBookingDetailReqType): any {
    const params = this.getBookingDetailReqMapping(req);
    const URL = `booking/fetchbookingdetails`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '?' + params);
        return Promise.resolve(this.getBookingDetailResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async acceptTerms(req: acceptTermsReqType): any {
    const params = this.acceptTermsReqMapping(req);
    const URL = `booking/schedule`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.acceptTermsResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async setBookingStatus(req: setBookingStatusReqType): any {
    const params = this.setBookingStatusReqMapping(req);
    const URL = `booking/schedule/status`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.setBookingStatusResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async updateAgent(req: updateAgentReqType): any {
    const params = this.updateAgentReqMapping(req);
    const URL = `booking/accept_request`;
    if (params) {
      try {
        const response = await this.callAPI('post', URL, params);
        return Promise.resolve(this.updateAgentResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async getCustomerBookingsList(req: CustomerBookingsListReqType): any {
    const params = this.CustomerBookingsListReqMapping(req);
    const URL = `booking/customerbooking`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '?' + params);
        return Promise.resolve(this.CustomerBookingsListResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async redoBooking(req: redoBookingReqType): any {
    const params = this.redoBookingReqMapping(req);
    const URL = `booking/redoBoooking`;
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '/' + params);
        return Promise.resolve(this.redoBookingResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async getSettings(): any {
    const URL = `general/setting`;
    try {
      const response = await this.callAPI('get', URL);
      return Promise.resolve(this.getSettingsResMapping(response));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default Booking;
