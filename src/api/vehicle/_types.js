// @flow

export interface VehicleInterface {
  AddVehicle(req: AddVehicleReqType): Promise<AddVehicleResType>;
  getVehicleDetails(
    req: getVehicleDetailsReqType,
  ): Promise<getVehicleDetailsResType>;
  UpdateVehicle(req: UpdateVehicleReqType): Promise<UpdateVehicleResType>;
  checkVinExist(req: checkVinExistReqType): Promise<checkVinExistResType>;
}

export type AddVehicleReqType = {
  vinNumber: string,
  carMake: string,
  carModel: string,
  carYear: string,
  carPlateNo: string,
  carRegistration: string,
  carType: string,
  technicianId: number,
  customerId: number,
  carColor: string,
  carMileage: number,
};

export type AddVehicleResType = {
  message?: any,
};

export type getVehicleDetailsReqType = {
  vehicleId: number,
};
export type getVehicleDetailsResType = {
  data: Object,
};

export type UpdateVehicleReqType = {
  id: number,
  vinNumber: string,
  carMake: string,
  carModel: string,
  carYear: string,
  carPlateNo: string,
  carRegistration: string,
  carType: string,
  technicianId: number,
  customerId: number,
  carColor: string,
  carMileage: number,
};

export type UpdateVehicleResType = {
  message?: any,
};

export type checkVinExistReqType = {
  vin: number,
};

export type checkVinExistResType = {
  data: Object,
};
