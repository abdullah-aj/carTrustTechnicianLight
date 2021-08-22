// @flow

import Constants from './constants';
import type {ConstantsInterface} from './constants.flow';
import API_Setup from './_setup';
import Authentication from './authentication';
import Profile from './profile';
import TestsCategories from './Tests';
import CustomerSearch from './customerSearch';
import Otp from './otp';
import type {APIInterface} from './_types';
import VinNumber from './vinNumber';
import Booking from './booking';
import Customer from './customer';
import Vehicle from './vehicle';
import Quotation from './quotation';
import Payment from './payment';
import VisualInspection from './visualInspection';
import Language from './language';
import Upgrade from './upgrade';
import Reports from './reports';

class API extends API_Setup {
  Constants: ConstantsInterface;

  constructor(i18n: any) {
    super();
    this.Constants = new Constants(i18n);
    this.Calls = {
      Authentication: new Authentication(this.callAPI),
      Profile: new Profile(this.callAPI),
      TestsCategories: new TestsCategories(this.callAPI),
      CustomerSearch: new CustomerSearch(this.callAPI),
      Otp: new Otp(this.callAPI),
      VinNumber: new VinNumber(this.callAPI),
      Booking: new Booking(this.callAPI),
      Customer: new Customer(this.callAPI),
      Vehicle: new Vehicle(this.callAPI),
      Quotation: new Quotation(this.callAPI),
      Payment: new Payment(this.callAPI),
      VisualInspection: new VisualInspection(this.callAPI),
      Language: new Language(this.callAPI),
      Upgrade: new Upgrade(this.callAPI),
      Reports: new Reports(this.callAPI),
    };
  }
}

const AP: APIInterface = new API();
export default AP;
