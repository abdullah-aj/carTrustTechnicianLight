// @flow

import CustomerSearch_Mapping from './_mapping';
import type {GetCustomerReqType} from './_types';
import axios from "axios";


const msgRqHdr = {}
class CustomerSearch extends CustomerSearch_Mapping {
    callAPI: any;

    constructor(callAPI: any) {
        super();
        this.callAPI = callAPI;
    }

    async GetCustomer(req: GetCustomerReqType): * {
        const requestData = this.customerSearchReqMapping(req);
        const dataToSend = requestData.phone;
        console.log('..........>Reached Customer Search', requestData.phone);

        if(requestData){
            const FUNCTION_URL = `customers?phone=${dataToSend}`;
            try {
                const response = await this.callAPI('get', FUNCTION_URL, requestData, msgRqHdr);

                return Promise.resolve(this.customerSearchResMapping(response));
            } catch (e) {
                return Promise.reject(e);
            }
        }

    }
}


export default CustomerSearch;
