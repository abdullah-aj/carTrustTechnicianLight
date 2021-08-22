import {SET_LOGIN_STATUS_ACTION} from "../actions/setLoginStatus";

function LoginStatus(state = false, action) {
    console.log("inside LoginStatus reducer", state)

    if (action.type === SET_LOGIN_STATUS_ACTION) {
        return (action.payload);
    }
    return state;

}

export default LoginStatus
