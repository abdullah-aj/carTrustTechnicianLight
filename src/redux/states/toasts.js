import {CLEAR_TOAST_ACTION, SET_TOAST_ACTION} from "../actions/setToast";

export type ToastType = {
    message: string,
    status: 'success' | 'danger' | 'warning'
}
const Toast: ToastType = (state = null, action) => {
    if (action.type === SET_TOAST_ACTION) {
        return action.payload;
    } else if (action.type === CLEAR_TOAST_ACTION) {
        return null;
    }
    return state
}

export default Toast;
