// @flow

import type {LoginReqType, LogoutReqType, RegisterReqType} from './_types';

class Authentication_Mapping {
    constructor() {

    }

    loginReqMapping(req: LoginReqType) {
        return ({
            login: req.userId,
            password: req.password,
        });
    }

    loginResMapping(res) {
        return {
                    access_token: res.access_token,
                    token_expire: res.expires_in,
                    userDetails: res.user,
                    userBranch: res.user_branch
                };
    }

    registerReqMapping(req: RegisterReqType) {
        return ({
            name: req.name,
            email: req.email,
            password: req.password,
            password_confirmation: req.password_confirm,
        });

    }

    registerResMapping(res) {

    }

    logoutReqMapping(req: LogoutReqType) {

    }

    logoutResMapping(res) {
        return res;
    }

}

export default Authentication_Mapping;
