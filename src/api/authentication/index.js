// @flow

import Authentication_Mapping from './_mapping';
import type {LoginReqType, LogoutReqType, ChangePasswordReqType} from './_types';
import axios from "axios";


const msgRqHdr = {}
class Authentication extends Authentication_Mapping {
    callAPI: any;

    constructor(callAPI: any) {
        super();
        this.callAPI = callAPI;
    }

    async login(req: LoginReqType): * {
        const FUNCTION_URL = 'auth/login';

        const requestData = this.loginReqMapping(req);
        console.log('..........>Reached', requestData);

        try {
            const response = await this.callAPI('post', FUNCTION_URL, requestData, msgRqHdr);

            return Promise.resolve(this.loginResMapping(response));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async register(req: LoginReqType): * {
        const FUNCTION_URL = 'auth/register';
        const requestData = this.registerReqMapping(req);

        try {
            const response = await this.callAPI('post', FUNCTION_URL, requestData, msgRqHdr);
            console.log("inside authentication login", response);
            return Promise.resolve(this.registerResMapping(response));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async logout(req: LogoutReqType): * {
        const FUNCTION_URL = 'auth/logout';

        const requestData = this.logoutReqMapping(req);

        try {
            const response = await this.callAPI('get', FUNCTION_URL, requestData, msgRqHdr);
            return Promise.resolve(this.logoutResMapping(response));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async forgotPassword(req: ChangePasswordReqType): * {
        const FUNCTION_URL = 'auth/logout';

        const requestData = this.logoutReqMapping(req);

        try {
            const response = await this.callAPI('post', FUNCTION_URL, requestData, msgRqHdr);
            return Promise.resolve(this.logoutResMapping(response));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}


export default Authentication;
