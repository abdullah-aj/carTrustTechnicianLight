// @flow

import {combineReducers} from 'redux';
import {CLEAR_REDUCER} from '../actions/clearRedcuers';
import Toast from './toasts';
import UserDetails from "./userDetails";
import LoginStatus from "./loginStatus";
import type {LoginStatusType, UserDetailsType} from "../types";


export type ReducerTypes = {
    UserDetails: UserDetailsType,
    LoginStatus: LoginStatusType,
}

const appReducer: ReducerTypes = combineReducers({
    Toast: Toast,
    UserDetails: UserDetails,
    LoginStatus: LoginStatus
});

const RootReducer = (state, action) => {
    if (action.type === CLEAR_REDUCER) {
        state = undefined;
    }
    return appReducer(state, action);
};


export default RootReducer;
