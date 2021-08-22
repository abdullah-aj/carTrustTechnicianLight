// @flow


import {object} from "yup";

export interface VinNumberInterface {
    SearchVinNumber(req: VinSearchReqType): Promise<VinSearchResType>;
}

export type VinSearchReqType = {
    vinScanField: string
}

export type VinSearchResType = {
    message?: string
}
