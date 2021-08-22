// @flow

import type {
  AddVehicleReqType,
  getVehicleDetailsReqType,
  getVehicleDetailsResType,
  UpdateVehicleReqType,
  checkVinExistReqType,
  checkVinExistResType,
} from './_types';
import VehicleAdd_Mapping from './_mapping';
import axios from 'axios';

const msgRqHdr = {};

class Vehicle extends VehicleAdd_Mapping {
  callAPI: any;

  constructor(callAPI: any) {
    super();
    this.callAPI = callAPI;
  }

  async AddVehicle(req: AddVehicleReqType): * {
    const FUNCTION_URL = `vehicle/addUpdate`;
    const requestData = this.AddVehicleReqMapping(req);

    console.log('..........>Reached Add Vehicle', requestData);
    if (requestData) {
      try {
        const response = await this.callAPI(
          'post',
          FUNCTION_URL,
          requestData,
          msgRqHdr,
        );
        return Promise.resolve(this.AddVehicleResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async getVehicleDetails(req: getVehicleDetailsReqType): any {
    const URL = `vehicle/fetchvehicledetails`;
    const params = this.getVehicleDetailsReqMapping(req);
    if (params) {
      try {
        const response = await this.callAPI('get', URL + '?' + params);
        return Promise.resolve(this.getVehicleDetailsResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async UpdateVehicle(req: UpdateVehicleReqType): * {
    const FUNCTION_URL = `vehicle/addUpdate`;
    const requestData = this.UpdateVehicleReqMapping(req);

    console.log('..........>Reached Update Vehicle', requestData);
    if (requestData) {
      try {
        const response = await this.callAPI(
          'post',
          FUNCTION_URL,
          requestData,
          msgRqHdr,
        );
        return Promise.resolve(this.UpdateVehicleResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  async checkVinExist(req: checkVinExistReqType): any {
    const URL = `vehicle`;
    const params = this.checkVinExistReqMapping(req);
    if (params) {
      try {
        const response = await this.callAPI(
          'get',
          URL + '/' + params + '/check',
        );
        return Promise.resolve(this.checkVinExistResMapping(response));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

export default Vehicle;
