// @flow

import type {ConstantsInterface} from './constants.flow';
import type {AuthenticationInterface} from './authentication/_types';
import type {ProfileInterface} from './profile/_types';
import type {TestsCategoriesInterface} from './Tests/_types';
import type {CustomerSearchInterface} from './customerSearch/_types';
import type {OtpInterface} from './otp/_types';
import type {VinNumberInterface} from './vinNumber/_types';
import type {BookingInterface} from './booking/_types';
import type {CustomerInterface} from './customer/_types';
import type {VehicleInterface} from './vehicle/_types';
import type {QuotationInterface} from './quotation/_types';
import type {PaymentInterface} from './payment/_types';
import type {VisualInspectionInterface} from './visualInspection/_types';
import type {LanguageInterface} from './language/_types';
import type {UpgradeInterface} from './upgrade/_types';
import type {ReportsInterface} from './reports/_types';

export interface APIInterface {
  Constants: ConstantsInterface;
  Calls: {
    Authentication: AuthenticationInterface,
    Profile: ProfileInterface,
    TestsCategories: TestsCategoriesInterface,
    CustomerSearch: CustomerSearchInterface,
    Otp: OtpInterface,
    VinNumber: VinNumberInterface,
    Booking: BookingInterface,
    Customer: CustomerInterface,
    Vehicle: VehicleInterface,
    Quotation: QuotationInterface,
    Payment: PaymentInterface,
    VisualInspection: VisualInspectionInterface,
    Language: LanguageInterface,
    Upgrade: UpgradeInterface,
    Reports: ReportsInterface,
  };
}

export type CallAPIType = {
  (type: 'post' | 'get' | 'put', age: string): number,
  type: 'post' | 'get',
};

export type APIHeaderType = {
  jwt_token: string,
};

export type APIResponseHeaderType = {
  sessionId?: string,
  securityToken?: string,
  refreshSecurityToken?: string,
  deviceToken?: string,
  refreshDeviceToken?: string,
  forceUpdate?: boolean,
  otpToken?: string,
  principleId?: string,
  principleType?: string,
};

export type APIResponseType = {
  withError: boolean,
  errorCode?: string,
  body: null | any,
};

export type APIResponseStructureType = {
  body: Object,
  header: Object,
  http_header: APIResponseHeaderType,
};
