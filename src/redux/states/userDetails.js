import {SET_USER_DETAILS} from "../actions/setUserDetails";


function UserDetails(state = {}, action) {
    if (action.type === SET_USER_DETAILS) {
        return {...state, ...action.payload}
    }
    return state;

}

export default UserDetails
