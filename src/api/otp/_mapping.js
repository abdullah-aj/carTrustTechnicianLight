// @flow

import type {OtpReqType, OtpResType, VerifyOtpReqType} from './_types';

class Otp_Mapping {
    constructor() {

    }

    OtpReqMapping(req: OtpReqType) {
        return ({
            phone: req.phone,
        });
    }

    OtpResMapping(res) {
        return {data:res.data};
    }

    VerifyOtpReqMapping(req: VerifyOtpReqType) {
        return ({
            phone:req.phone,
            otp: req.otpCode
        });
    }

    VerifyOtpResMapping(res) {
        return {data:res.data};
    }

}

export default Otp_Mapping;
