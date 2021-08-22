// @flow

import CustomerSearch_Mapping from './_mapping';
import axios from "axios";
import Otp_Mapping from "./_mapping";
import type {OtpReqType, VerifyOtpReqType} from "./_types";


const msgRqHdr = {}

class Otp extends Otp_Mapping {
    callAPI: any;

    constructor(callAPI: any) {
        super();
        this.callAPI = callAPI;
    }

    async GetOtpCode(req: OtpReqType): * {
        const requestData = this.OtpReqMapping(req);
        const FUNCTION_URL = `customers/sendOtp`;

        console.log('..........>Reached OTP', requestData.phone);
        if(requestData){
            try {
                const response = await this.callAPI('post', FUNCTION_URL, requestData, msgRqHdr);
                return Promise.resolve(this.OtpResMapping(response));
            } catch (e) {
                return Promise.reject(e);
            }
        }

    }

    async VerifyOtpCode(req: VerifyOtpReqType): * {
        const requestData = this.VerifyOtpReqMapping(req);
        const FUNCTION_URL = `customers/verifyOtp`;

        console.log('..........>Reached verify OTP', requestData);
        if(requestData){
            try {
                const response = await this.callAPI('post', FUNCTION_URL, requestData, msgRqHdr);
                return Promise.resolve(this.OtpResMapping(response));
            } catch (e) {
                return Promise.reject(e);
            }
        }

    }
}


export default Otp;
