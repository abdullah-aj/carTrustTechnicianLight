// @flow

import type {GetCustomerReqType} from './_types';

class CustomerSearch_Mapping {
    constructor() {

    }

    customerSearchReqMapping(req: GetCustomerReqType) {
        return ({
            phone: req.mobile,
            email:req.email,
            vin:req.vin
        });
    }

    customerSearchResMapping(res) {
        return {data:res.data};
    }

}

export default CustomerSearch_Mapping;
