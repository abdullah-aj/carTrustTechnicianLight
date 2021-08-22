// @flow

import {Util} from "../../util";
import type {UserDetailsType} from "../types";

export const SET_USER_DETAILS = 'set-user-details'

/**
 * Set user details, can pass all the data or partial
 * @param userDetails
 * @returns {{payload: {mobile: string, id: string}, type: string}}
 * @constructor
 */
function SetUserDetails(userDetails: UserDetailsType): { type: string, payload: any } {
    const newUserDetails = {...userDetails};
    return ({type: SET_USER_DETAILS, payload: newUserDetails});
}

export default SetUserDetails
