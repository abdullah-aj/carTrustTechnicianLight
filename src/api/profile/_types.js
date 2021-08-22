// @flow


export interface ProfileInterface {
    getProfileDetails(req: GetProfileReqType): Promise<GetProfileResType>
}


export type GetProfileReqType = {
    customerId:number
}

export type GetProfileResType = {
    message?: {any}
}
