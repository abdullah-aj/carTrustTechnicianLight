// @flow


import type {GetProfileReqType} from './_types';

class Profile_Mapping {
    constructor() {

    }

    getProfileReqMapping(req:GetProfileReqType){
        return {id:req.customerId}
    }

    getProfileResMapping(res){
        return {
            fullName:`${res.data.customerDetails.first_name} ${res.data.customerDetails.last_name}`,
            lastName:res.data.customerDetails.last_name,
            email:res.data.customerDetails.email,
            mobile: res.data.customerDetails.phone,
            vehicleDetails:res.data.vehiclesDetails
        };

    }
}

export default Profile_Mapping;
