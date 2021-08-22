// @flow
export const CLEAR_TOAST_ACTION = 'clear-toast-action';
export const SET_TOAST_ACTION = 'set-toast-action';

export const SetToast = (message: string, status: 'danger' | 'warning' | 'success'): { type: string, payload: any } => {
    return ({type: SET_TOAST_ACTION, payload: {message, status}});
};

export const ClearToast = () => {
    return ({type: CLEAR_TOAST_ACTION});
};
