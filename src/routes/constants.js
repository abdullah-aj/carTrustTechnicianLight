// @flow

class Constants {
    PUBLIC_ROUTES = {
        LOGIN: 'LOGIN',
        FORGOT_PASS: 'FORGOT_PASS',
        REGISTRATION: 'REGISTRATION',
    };
    PRIVATE_ROUTES = {
        DASHBOARD: 'DASHBOARD',
        TEST: 'TEST'
    };
}


const RouteConstants = new Constants();
export default RouteConstants;
