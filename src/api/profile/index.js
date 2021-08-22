// @flow

import Profile_Mapping from './_mapping';
import type {GetProfileReqType, LoginReqType} from './_types';

const msgRqHdr = {}

class Profile extends Profile_Mapping {
    callAPI: any;

    constructor(callAPI: any) {
        super();
        this.callAPI = callAPI;
    }


    async getProfileDetails(req: GetProfileReqType): * {
        const requestData = this.getProfileReqMapping(req);
        console.log("//inside getProfileDetails", requestData);

        const dataToSend = requestData.id;

        if(requestData){
            const FUNCTION_URL = `customers/fetchcustomerdetails?id=${dataToSend}`;

            try {
                const response = await this.callAPI('get', FUNCTION_URL, requestData, msgRqHdr);
                return Promise.resolve(this.getProfileResMapping(response));
            } catch (e) {
                return Promise.reject(e);
            }
        }

    }
}

export default Profile;
