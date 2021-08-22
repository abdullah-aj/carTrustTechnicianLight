// @flow


export interface AuthenticationInterface {
    login(req: LoginReqType): Promise<LoginResType>;

    register(req: LoginReqType): Promise<RegisterResType>;

    logout(req: LogoutReqType): Promise<LogoutResType>;
}

export type LoginReqType = {
    userId: string,
    password: string
}

export type LoginResType = {
    message?: string
}

export type RegisterReqType = {
    name: string,
    email: string,
    password: string,
    password_confirm: string
}

export type RegisterResType = {
    message?: string
}

export type LogoutReqType = {}

export type LogoutResType = {}

export type ChangePasswordReqType = {

}

export type ChangePasswordResType = {

}
