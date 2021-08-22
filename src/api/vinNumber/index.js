// @flow

import CustomerSearch_Mapping from './_mapping';
import axios from "axios";
import Otp_Mapping from "./_mapping";
import type {OtpReqType, VerifyOtpReqType, VinSearchReqType} from "./_types";
import VinNumber_Mapping from "./_mapping";


const msgRqHdr = {}

class VinNumber extends VinNumber_Mapping {
    callAPI: any;

    constructor(callAPI: any) {
        super();
        this.callAPI = callAPI;
    }

    async SearchVinNumber(req: VinSearchReqType): * {

        const requestData = this.VinSearchReqMapping(req);
        const FUNCTION_URL = `vehicles/${requestData.vinScanField}`;
        console.log('..........>Reached VIN Number search', requestData.vinScanField);
        if(requestData){
            try {
                const response = await this.callAPI('get', FUNCTION_URL, requestData, msgRqHdr);
                return Promise.resolve(this.VinSearchResMapping(response));
            } catch (e) {
                return Promise.reject(e);
            }
        }

    }

}


export default VinNumber;
