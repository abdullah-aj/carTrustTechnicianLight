import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Auth_Login from '../containers/auth.login';
import Auth_ForgotPassword from '../containers/auth.login.forgotPassword';
import Test from '../containers/test';
import Onboarding2Vehicle from '../containers/onboarding/onboarding2_customer';

const StackNavigation = createStackNavigator();

const PublicRoutes = [
  {
    name: 'Login',
    component: Auth_Login,
  },
  {
    name: 'Forgot',
    component: Auth_ForgotPassword,
  },
  {
    name: 'Test',
    component: Test,
  },
];

const PublicNavigation = (props) => {
  return (
    <StackNavigation.Navigator
      headerMode={'none'}
      initialRouteName={props.initialRouteName}>
      {PublicRoutes.map((route, index) => {
        return (
          <StackNavigation.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        );
      })}
    </StackNavigation.Navigator>
  );
};

export default PublicNavigation;
