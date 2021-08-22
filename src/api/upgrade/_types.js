// @flow

export interface UpgradeInterface {
  checkEligibility(
    req: checkEligibilityReqType,
  ): Promise<checkEligibilityResType>;
  upgradeInspection(
    req: upgradeInspectionReqType,
  ): Promise<upgradeInspectionResType>;
}

export type checkEligibilityReqType = {
  booking_id: number,
  upgrade_from:
    | 'ppi'
    | 'cpo_sixmonth'
    | 'cpo_twelvemonth'
    | 'cpo_eighteen'
    | 'cpo_twentyfourrmonth'
    | 'cpo_thirty'
    | 'cpo_thirtysixmonth',
  upgrade_to:
    | 'ppi'
    | 'cpo_sixmonth'
    | 'cpo_twelvemonth'
    | 'cpo_eighteen'
    | 'cpo_twentyfourrmonth'
    | 'cpo_thirty'
    | 'cpo_thirtysixmonth',
};

export type checkEligibilityResType = {
  data: Object,
};

export type upgradeInspectionReqType = {
  booking_id: number,
  payment_id: number,
  upgraded_from:
    | 'ppi'
    | 'cpo_sixmonth'
    | 'cpo_twelvemonth'
    | 'cpo_eighteen'
    | 'cpo_twentyfourrmonth'
    | 'cpo_thirty'
    | 'cpo_thirtysixmonth',
  upgraded_to:
    | 'ppi'
    | 'cpo_sixmonth'
    | 'cpo_twelvemonth'
    | 'cpo_eighteen'
    | 'cpo_twentyfourrmonth'
    | 'cpo_thirty'
    | 'cpo_thirtysixmonth',
  upgraded_by: 'technician',
};

export type upgradeInspectionResType = {
  data: Object,
};
