// @flow
import * as React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity, Alert} from 'react-native';
import TwoHalves from '../../components/Layout/TwoHalves';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Text from '../../components/Text';
import AP from '../../api';
import {Loader} from '../../components/Loader';
import {connect} from 'react-redux';
import moment from 'moment';
import Icon from '../../components/Icons';
import {Form} from '../../components/Form';
import FormBody from '../../components/FormBody';
import {Field} from 'formik';
import InputField from '../../components/InputFields/TextInputField';
import Utility from '../../util';
import Message from '../../components/Message';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  route: {
    params: any,
  },
};

type State = {
  customerId: number,
  vehicle: Object,
  amount: number,
  vat: number,
  loader: string,
  dummyValue: boolean,
  grandTotal: number,
  modalVisible: boolean,
};

class Quotation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      customerId: 0,
      vehicle: 0,
      amount: 0,
      vat: 0,
      loader: '',
      dummyValue: false,
      grandTotal: 0,
      modalVisible: false,
      manufacturerId: 0,
      modelId: 0,
      yearId: 0,
    };
  }

  componentDidMount: function = async () => {
    const {customerId, vehicle} = this.props.route.params;
    this.setState({
      loader: 'Loading...',
      customerId: customerId,
      vehicle: vehicle,
    });
    this.getVehicleDetails(vehicle.id);
  };

  getVehicleDetails: function = async (vehicleId) => {
    try {
      const res = await AP.Calls.Vehicle.getVehicleDetails({
        vehicleId: vehicleId,
      });
      const {make_id, model_id, year_id} = res;
      this.setState({
        manufacturerId: make_id,
        modelId: model_id,
        yearId: year_id,
      });
      this.getPriceForService(make_id, model_id, year_id);
    } catch (e) {
      console.log('Error ::>>', e);
    }
  };

  getPriceForService: function = async (manufacturerId, modelId, yearId) => {
    try {
      const res: any = await AP.Calls.Quotation.getQuotation({
        manufacturerId,
        modelId,
        yearId,
      });
      if (res.price_ppi) {
        const amount = res.price_ppi;
        const grandTotal = parseFloat(
          parseFloat(this.calculatePercentage(amount, res.vat)) +
            parseFloat(amount),
        ).toFixed(1);
        this.setState({
          loader: '',
          amount: amount,
          vat: res.vat,
          grandTotal: grandTotal,
        });
      } else {
        this.setState({
          loader: '',
          amount: 0,
          dummyValue: true,
          vat: 0,
          grandTotal: 0,
        });
      }
    } catch (e) {
      console.log('Error ::>>', e);
    }
  };

  handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  handleGoBack: function = () => {
    this.props.navigation.goBack();
  };

  handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  handlePrint: function = () => {
    Message.alert('Info', 'Printer Device not decided yet');
    console.log('Print Quote');
  };

  handleSms: function = () => {
    this.handleModalVisibility(true);
  };

  handleBookNow: function = () => {
    this.props.navigation.push('scheduleBooking', {
      customerId: this.state.customerId,
      vehicleId: this.state.vehicle.id,
      amount: this.state.grandTotal,
    });
  };

  handleStartNow: function = async () => {
    Message.alert('Confirmation', 'Are You sure you want to start Now?', [
      {text: 'No', onPress: () => {}, type: 'no'},
      {
        text: 'Start Now',
        onPress: async () => {
          try {
            this.setState({
              loader: 'Checking Availability ...',
            });

            const response: any = await AP.Calls.Booking.getBookingSchedule({
              technicianId: this.props.getUserDetails.id,
              date: moment().format('YYYY-MM-DD'),
            });
            let slotBooked = false;
            let withinWorkingHours = false;
            const currentHour = moment().format('HH');

            response.map((obj) => {
              const key = Object.keys(obj)[0];
              let slotTime = key.split(':00');

              slotTime = moment(
                moment().format('YYYY-MM-DD') +
                  ' ' +
                  slotTime[0] +
                  ':00 ' +
                  slotTime[1],
              ).format('HH:mm:ss');

              slotTime = slotTime.split(':');

              if (parseInt(slotTime[0]) === parseInt(currentHour)) {
                slotBooked = obj[key];
                withinWorkingHours = true;
              }
            });

            if (withinWorkingHours) {
              if (slotBooked) {
                this.bookSlot(currentHour);
              } else {
                this.setState(
                  {
                    loader: '',
                  },
                  () => {
                    Alert.alert(
                      'Error',
                      'Can not start new Booking. You Already have a Booking at this moment',
                    );
                  },
                );
              }
            } else {
              // Outside Working Hours
              await this.setState({
                loader: '',
              });
              Alert.alert(
                'Alert',
                'Current Time is out of Available Time Slot. Are you sure you want to Continue?',
                [
                  {text: 'No', onPress: () => {}, type: 'no'},
                  {
                    text: 'Continue',
                    onPress: () => {
                      this.bookSlot(currentHour);
                    },
                  },
                ],
              );
            }
          } catch (e) {
            console.log('Error', e);
          }
        },
        type: 'yes',
      },
    ]);
  };

  bookSlot: function = async (currentHour) => {
    this.setState({
      loader: 'Booking Slot ...',
    });
    const time = moment(currentHour + ':00:00', 'HH:mm a');

    const parms = {
      agent_id: this.props.getUserDetails.id,
      customer_id: this.state.customerId,
      vehicle_id: this.state.vehicle.id,
      appointment_date: moment().format('YYYY-MM-DD'),
      appointment_from: time.format('HH:mm:ss'),
      appointment_to: moment(time).add(1, 'hours').format('HH:mm:ss'),
      type: 1,
    };
    const response: any = await AP.Calls.Booking.addBookingSchedule(parms);
    if (response.success) {
      this.setState(
        {
          loader: '',
        },
        () => {
          this.props.navigation.push('TermsConditions', {
            technicianId: this.props.getUserDetails.id,
            customerId: this.state.customerId,
            vehicleId: this.state.vehicle.id,
            bookingId: response.data.booking_id,
            amount: this.state.grandTotal,
          });
        },
      );
    }
  };

  calculatePercentage: function = (number, percent) => {
    let num = percent / 100;
    num = num * number;
    return num;
  };

  handleModalVisibility: function = (visible) => {
    if (visible === false) {
      this.setState({
        modalVisible: visible,
      });
    } else {
      this.setState({modalVisible: visible});
    }
  };

  onSubmit: function = async (values) => {
    this.setState({formValues: values});
    let res: any;
    try {
      res = await AP.Calls.Quotation.sendSms({
        manufacturerId: this.state.manufacturerId,
        modelId: this.state.modelId,
        yearId: this.state.yearId,
        phone: values.mobile,
      });
      this.handleModalVisibility(!this.state.modalVisible);
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  render(): React.Node {
    return (
      <>
        <Message />
        <Loader
          visible={this.state.loader !== ''}
          message={this.state.loader}
        />
        <TwoHalves
          artType={'list'}
          title={'Services'}
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Quotation'}
              rightIcon={[
                {
                  icon: 'Profile',
                  action: this.handleProfileClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
                {
                  icon: 'Search',
                  action: this.handleSearchClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
              ]}
              leftIcon={{
                icon: 'backBtn',
                action: this.handleGoBack,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              }}
            />
          }
          sectionBody={
            <View style={style.container}>
              <View style={style.table}>
                <View style={[style.row, style.titleRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Name of Service
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Price
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.evenRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Car Trust Inspection Report
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      {'Included'}
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.oddRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Limited Warranty Coverage (6 Months Inclusive)
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      {'Not Included'}
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.evenRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Car Trust certificate
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      {'Not Included'}
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.oddRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      ELM Mojaz Report
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      {'Not Included'}
                    </Text>
                  </View>
                </View>

                {/* <View style={[style.row, style.evenRow, style.lastRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Inspection Report
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Included
                    </Text>
                  </View>
                </View> */}

                <View style={[style.row, style.totalRowMid]}>
                  <View style={[style.col, style.colTotalLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Total
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      {this.state.amount} SAR{' '}
                      {this.state.dummyValue && (
                        <Text size={1} style={{color: '#ffffff'}}>
                          {' '}
                          (Dummy Value)
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.totalRowMid]}>
                  <View style={[style.col, style.colTotalLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      VAT
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      {this.state.vat} %
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.totalRow]}>
                  <View style={[style.col, style.colTotalLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Grand Total
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      {this.state.grandTotal} SAR{' '}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <Button
                  type={'tertiary'}
                  label={'Print Quote'}
                  disabled={false}
                  action={this.handlePrint.bind(this)}
                  style={[
                    style.button,
                    {width: 120, marginRight: 20, elevation: 0},
                  ]}
                />
                <Button
                  type={'tertiary'}
                  label={'Send Quote by SMS'}
                  disabled={false}
                  action={this.handleSms.bind(this)}
                  style={[style.button, {width: 230, marginRight: 20}]}
                />
                <Button
                  type={'tertiary'}
                  label={'Book Later'}
                  disabled={false}
                  action={this.handleBookNow.bind(this)}
                  style={[style.button, {width: 120, marginRight: 20}]}
                />
                <Button
                  type={'tertiary'}
                  label={'Book Now'}
                  disabled={false}
                  action={this.handleStartNow.bind(this)}
                  style={[style.button, {width: 120}]}
                />
              </View>
              {/* ---------- Modal --------- */}
              <View style={style.centeredView}>
                <Modal
                  animationType={'fade'}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    this.handleModalVisibility(!this.state.modalVisible);
                  }}>
                  <View style={style.centeredView}>
                    <View style={style.modalView}>
                      <View style={style.closeButton}>
                        <TouchableOpacity
                          onPress={this.handleModalVisibility.bind(
                            this,
                            !this.state.modalVisible,
                          )}>
                          <Icon
                            name={'close'}
                            width={15}
                            height={15}
                            fill={Theme.base_color_5}
                            style={{}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={[style.modalBodyRow, {width: 460}]}>
                        <Form
                          initialValues={{
                            mobile: '',
                          }}
                          onSubmit={this.onSubmit}
                          enableReinitialize={false}>
                          {({handleSubmit, isSubmitting, values}) => (
                            <FormBody
                              handleKeyboard={true}
                              backgroundColor={'transparent'}>
                              <View style={{width: 400}}>
                                <View>
                                  <Field
                                    name={'mobile'}
                                    component={InputField}
                                    placeholder={'Mobile No. (0xxxxxxxxx)'}
                                    style={style.inputFieldText}
                                    keyboardType={'phone-pad'}
                                    maxLength={10}
                                    onFocusOut={() => {}}
                                  />
                                </View>
                                <View>
                                  <Button
                                    label={'SEND'}
                                    type={'secondary'}
                                    disabled={
                                      values.mobile.length < 9 ? true : false
                                    }
                                    action={handleSubmit}
                                  />
                                </View>
                              </View>
                            </FormBody>
                          )}
                        </Form>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          }
        />
      </>
    );
  }
}

const evenRow = '';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 90,
  },
  table: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    height: 45,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  titleRow: {
    height: 50,
    backgroundColor: Theme.primary_color_1,
    borderTopLeftRadius: Theme.card_border_radius,
    borderTopRightRadius: Theme.card_border_radius,
  },
  evenRow: {
    backgroundColor: Theme.primary_color_2,
  },
  oddRow: {
    backgroundColor: '#3537a0',
  },
  lastRow: {
    borderBottomLeftRadius: Theme.card_border_radius,
  },
  totalRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: Theme.primary_color_1,
    borderBottomLeftRadius: Theme.card_border_radius,
    borderBottomRightRadius: Theme.card_border_radius,
  },
  totalRowMid: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: Theme.primary_color_1,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
  col: {
    alignSelf: 'stretch',
    // alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 30,
  },
  colLeft: {
    flex: 0.65,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  colRight: {
    flex: 0.35,
  },
  colTotalLeft: {
    flex: 0.4,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  button: {
    elevation: 0,
    borderWidth: 2,
  },
  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 265,
  },
  modalBodyRow: {
    flexDirection: 'row',
  },
  modalBodyPrompt: {
    width: 650,
    justifyContent: 'space-between',
    paddingTop: 90,
    paddingLeft: 20,
    paddingRight: 20,
  },
  closeButton: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  inputFieldText: {
    borderColor: Theme.primary_color_2,
    borderWidth: 2,
    marginBottom: 30,
  },
});

type ConnectProps = {
  mapStateToProps: any,
  mapDispatchToProps: any,
};

const mapStateToProps = (state) => {
  return {
    getUserDetails: state.UserDetails.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default (connect<ConnectProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Quotation): any);
