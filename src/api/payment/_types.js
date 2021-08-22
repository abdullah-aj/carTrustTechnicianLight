// @flow

export interface PaymentInterface {
  addPayment(req: addPaymentReqType): Promise<addPaymentResType>;
}

export type addPaymentReqType = {
  booking_id: number,
  customer_id: number,
  technician_id: number,
  date: string,
  time: string,
  method_of_payment: string,
  amount: number,
  receipt: any,
};

export type addPaymentResType = {
  data: Object,
};
