// @flow

import type {
  AddVehicleReqType,
  getVehicleDetailsReqType,
  getVehicleDetailsResType,
  UpdateVehicleReqType,
  checkVinExistReqType,
  checkVinExistResType,
} from './_types';

class VehicleAdd_Mapping {
  constructor() {}

  AddVehicleReqMapping(req: AddVehicleReqType) {
    return {
      vin: req.vinNumber,
      make: req.carMake,
      model: req.carModel,
      year: req.carYear,
      plate: req.carPlateNo,
      plate_en: req.carPlateNoEn,
      registration: req.carRegistration,
      type: req.carType,
      technician_id: req.technicianId,
      customer_id: req.customerId,
      color: req.carColor,
      current_mileage: req.carMileage,
    };
  }

  AddVehicleResMapping(res) {
    return {data: res.success};
  }

  getVehicleDetailsReqMapping(req: getVehicleDetailsReqType): any {
    return 'vehicle_id=' + req.vehicleId;
  }

  getVehicleDetailsResMapping(res: getVehicleDetailsResType): any {
    return res.data.vehicle_detail;
  }

  UpdateVehicleReqMapping(req: UpdateVehicleReqType): any {
    return {
      id: req.id,
      vin: req.vinNumber,
      make: req.carMake,
      model: req.carModel,
      year: req.carYear,
      plate: req.carPlateNo,
      plate_en: req.carPlateNoEn,
      registration: req.carRegistration,
      type: req.carType,
      technician_id: req.technicianId,
      customer_id: req.customerId,
      color: req.carColor,
      current_mileage: req.carMileage,
    };
  }

  UpdateVehicleResMapping(res) {
    return {data: res.success};
  }

  checkVinExistReqMapping(req: checkVinExistReqType) {
    return req.vin;
  }

  checkVinExistResMapping(res: checkVinExistResType) {
    return res;
  }
}

export default VehicleAdd_Mapping;
