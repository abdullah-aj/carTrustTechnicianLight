import * as React from 'react';
import {Linking} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from '../components/Navigation.DrawerNav/drawerContent';
import TabNavigationContent from '../components/Navigation.TabNav';
import Auth_Login from '../containers/auth.login';
import Dashboard from '../containers/dashboard';
import Test from '../containers/test';
import OngoingCPOS from '../containers/ongoingCPOs';
import SketchDraw from '../containers/sketchCanvasTest';
import existingCustomer from '../containers/test/existingCustomer';
import VisualInspection from '../containers/test/visualInspection';
import onboarding from '../containers/onboarding/onboarding';
import addNewCustomer from '../containers/addNewCustomer';
import OTP from '../containers/otp';
import OBD from '../containers/obd';
import Logout from '../containers/auth.logout';
import Onboarding from '../containers/onboarding/onboarding';
import Onboarding2Customer from '../containers/onboarding/onboarding2_customer';
import Onboarding3Vehicle from '../containers/onboarding/onboarding3_vehicle';
import Onboarding4_vehicleInfoRetrieved from '../containers/onboarding/onboarding4_vehicleInfoRetrieved';
import Onboarding5_vehicleInfoEnter from '../containers/onboarding/onboarding5_vehicleInfoEnter';
import Profile from '../containers/profile';
import ScheduleBooking from '../containers/booking/scheduleBooking';
import MyBooking from '../containers/booking/myBooking';
import Payment from '../containers/payment/index';
import Quotation from '../containers/payment/quotation';
import TestResult from '../components/testResult';
import TestSummary from '../components/testSummary';
import QrScanner from '../containers/booking/qrScanner';
import PriceCalculator from '../containers/payment/priceCalculator';
import PriceList from '../containers/payment/priceCalculator/price';
import BookingConfirmation from '../containers/booking/myBooking/confirmation';
import Signature from '../containers/booking/signature';
import CompletedCPO from '../containers/completedCPO';
import TermsConditions from '../containers/termsConditions';

const Tabs = createBottomTabNavigator();
const StackNavigation = createStackNavigator();
const Drawer = createDrawerNavigator();

const stackNav = () => {
  return (
    <StackNavigation.Navigator headerMode={'none'}>
      <StackNavigation.Screen name={'Dashboard'} component={Dashboard} />
      <StackNavigation.Screen name={'Test'} component={Test} />
      <StackNavigation.Screen name={'OngoingCPOS'} component={OngoingCPOS} />
      <StackNavigation.Screen name={'newCPO'} component={existingCustomer} />
      <StackNavigation.Screen name={'onboarding'} component={Onboarding} />
      <StackNavigation.Screen
        name={'visualInspection'}
        component={VisualInspection}
      />
      <StackNavigation.Screen
        name={'addNewCustomer'}
        component={addNewCustomer}
      />
      <StackNavigation.Screen name={'OTP'} component={OTP} />
      <StackNavigation.Screen
        name={'onboardingCustomer'}
        component={Onboarding2Customer}
      />
      <StackNavigation.Screen
        name={'onboardingVehicle'}
        component={Onboarding3Vehicle}
      />
      <StackNavigation.Screen
        name={'onboardingVehicleInfo'}
        component={Onboarding4_vehicleInfoRetrieved}
      />
      <StackNavigation.Screen
        name={'onboardingVehicleInfoEnter'}
        component={Onboarding5_vehicleInfoEnter}
      />
      <StackNavigation.Screen name={'profile'} component={Profile} />
      <StackNavigation.Screen name={'OBD'} component={OBD} />
      <StackNavigation.Screen name={'Logout'} component={Logout} />
      <StackNavigation.Screen
        name={'scheduleBooking'}
        component={ScheduleBooking}
      />
      <StackNavigation.Screen name={'myBooking'} component={MyBooking} />
      <StackNavigation.Screen name={'payment'} component={Payment} />
      <StackNavigation.Screen name={'quotation'} component={Quotation} />
      <StackNavigation.Screen name={'result'} component={TestResult} />
      <StackNavigation.Screen name={'testSummary'} component={TestSummary} />
      <StackNavigation.Screen name={'qrScanner'} component={QrScanner} />
      <StackNavigation.Screen
        name={'priceCalculator'}
        component={PriceCalculator}
      />
      <StackNavigation.Screen name={'priceList'} component={PriceList} />
      <StackNavigation.Screen
        name={'confirmation'}
        component={BookingConfirmation}
      />
      <StackNavigation.Screen name={'signature'} component={Signature} />
      <StackNavigation.Screen name={'completedCpo'} component={CompletedCPO} />
      <StackNavigation.Screen
        name={'TermsConditions'}
        component={TermsConditions}
      />
    </StackNavigation.Navigator>
  );
};

const PrivateRoutes = [
  {
    name: 'Dashboard',
    iconName: 'Profile',
    label: 'Dashboard',
    visible: true,
  },
  //   {
  //     name: 'Language',
  //     iconName: 'language',
  //     label: 'Language',
  //     visible: true,
  //   },
  //   {
  //     name: 'Settings',
  //     iconName: 'settings',
  //     label: 'Settings',
  //     visible: true,
  //   },
  {
    name: 'Support',
    iconName: 'settings',
    label: 'Support',
    action: () => {
      Linking.openURL(`tel:0599529572`);
    },
    visible: true,
  },
  {
    name: 'Logout',
    iconName: 'logout',
    label: 'Logout',
    visible: true,
  },
  {
    name: 'Update',
    iconName: 'update',
    label: 'Update',
    action: () => {
      Linking.openURL('https://release.cartrust.sa');
    },
    visible: true,
  },
];
const PrivateNavigation = (props: {type: 'tab' | 'drawer' | 'stack'}) => {
  const {type} = props;
  if (type === 'tab') {
    return (
      <Tabs.Navigator tabBar={(props) => <TabNavigationContent {...props} />}>
        {PrivateRoutes.map((route, index) => {
          return (
            <Tabs.Screen
              key={route.name}
              name={route.name}
              options={{tabBarIcon: route.iconName, tabBarLabel: route.label}}
              component={route.component}
            />
          );
        })}
      </Tabs.Navigator>
    );
  } else {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={(props) => (
          <DrawerContent {...props} routesList={PrivateRoutes} />
        )}>
        <Drawer.Screen name="stack" component={stackNav} />
      </Drawer.Navigator>
    );
  }
};

export default PrivateNavigation;
