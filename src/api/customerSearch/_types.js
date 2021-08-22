// @flow


export interface CustomerSearchInterface {
    GetCustomer(req: GetCustomerReqType): Promise<GetCustomerResType>;
}

export type GetCustomerReqType = {
    mobile: string,
    email:string,
    vin:string
}

export type GetCustomerResType = {
    message?: string
}

