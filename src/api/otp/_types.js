// @flow


export interface OtpInterface {
    GetOtpCode(req: OtpReqType): Promise<OtpResType>;
    VerifyOtpCode(req: VerifyOtpReqType): Promise<VerifyOtpResType>;
}

export type OtpReqType = {
    phone: req.phone,
}

export type OtpResType = {
    message?: string
}

export type VerifyOtpReqType = {
    phone: req.otpCode,
}

export type VerifyOtpResType = {
    message?: string
}

