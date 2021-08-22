// @flow

import type {VinSearchReqType, VinSearchResType} from './_types';

class VinNumber_Mapping {
    constructor() {

    }

    VinSearchReqMapping(req: VinSearchReqType) {
        return ({
            vinScanField: req.vinScanField,
        });
    }

    VinSearchResMapping(res) {
        console.log("//res is", res.data)
        return {data:res.data};
    }

}

export default VinNumber_Mapping;
