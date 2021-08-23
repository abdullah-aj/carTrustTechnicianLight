// @flow

import React, {useEffect, useState} from 'react';
import Card from '../../../components/Card';
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import {AppHeader} from '../../../components/AppHeader';
import Theme from '../../../App.style';
import FooterLine from '../../../components/footerLine';
import PageBGArtwork from '../../../components/PageBGArtwork';
import Icon from '../../../components/Icons';
import Util from '../../../util';
import {Loader} from '../../../components/Loader';
import AP from '../../../api';
import Layout from '../../../components/Layout/FullPage';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import Message from '../../../components/Message';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  route: {
    params: any,
  },
  getUserDetails: {
    id: number,
  },
};

const Confirmation = (props: Props): any => {
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState({});
  const [customer, setCustomer] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [driver, setDriver] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [terms, setTerms] = useState('');
  const {height, width} = Dimensions.get('screen');

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails: function = async () => {
    const bookingId = props.route.params.bookingId;
    try {
      const response: any = await AP.Calls.Booking.getBookingDetail({
        bookingId: bookingId,
      });
      const {
        booking,
        customer,
        vehicle,
        driver,
        servicepartner,
        vehicle_detail,
        branch,
      } = response;

      if (driver) {
        setDriver(driver);
      }

      setBooking(booking);
      setCustomer(customer);
      setVehicle(vehicle);
      setIsLoading(false);
      setVehicleDetails(vehicle_detail);
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  const isEmpty = (value) => {
    if (
      typeof value === undefined ||
      value === undefined ||
      value === 'undefined' ||
      value === null ||
      value === 'null' ||
      value === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleConfirmation: function = () => {
    if (
      isEmpty(vehicle.vin) ||
      isEmpty(vehicle.plate) ||
      isEmpty(vehicle.registration) ||
      isEmpty(vehicle.current_mileage) ||
      isEmpty(vehicle.color) ||
      isEmpty(vehicle.type)
    ) {
      Message.alert(
        'Info',
        'Vehicle Detail is incomplete, Do you want to fill vehicle details?',
        [
          {text: 'No', onPress: () => {}, type: 'no'},
          {
            text: 'Fill Details',
            onPress: () => {
              props.navigation.push('onboardingVehicleInfo', {
                customerInfo: {
                  firstName: customer.first_name,
                  id: customer.id,
                },
                vehicleInfo: {
                  vin: isEmpty(vehicle.vin) ? '' : vehicle.vin,
                  vehicleMake: vehicle.make,
                  vehicleType: isEmpty(vehicle.type) ? '' : vehicle.type,
                  vehicle: vehicle.model,
                  vehicleYear: vehicle.year.toString(),
                  id: vehicle.id,
                  mileage: isEmpty(vehicle.current_mileage)
                    ? ''
                    : vehicle.current_mileage,
                  registration: isEmpty(vehicle.registration)
                    ? ''
                    : vehicle.registration,
                  plate: isEmpty(vehicle.plate_en) ? '' : vehicle.plate_en,
                  color: isEmpty(vehicle.color) ? '' : vehicle.color,
                },
                bookingInfo: {
                  id: booking.booking_id,
                  status: booking.status,
                },
                bookingId: booking.booking_id,
                mode: {
                  action: 'update',
                  navigateTo: 'confirmation',
                  params: {
                    bookingId: booking.booking_id,
                  },
                },
              });
            },
            type: 'yes',
          },
        ],
      );
      return;
    }

    if (booking.status === 'Awaiting_Payment') {
      Message.alert(
        'Info',
        'Payment for this Booking is still pending. Do you want to Pay now?',
        [
          {
            text: 'No',
            onPress: () => {},
            type: 'no',
          },
          {
            text: 'Pay Now',
            onPress: async () => {
              let price = await getPrice(
                vehicleDetails.make_id,
                vehicleDetails.model_id,
                vehicleDetails.year_id,
                booking.months,
              );

              const type = booking.booking_refrence.split('-')[0].toUpperCase();

              if (price === false) {
                return;
              } else {
                price = type === 'CPO' ? price.cpo : price.ppi;
              }

              if (booking.agent_id === props.getUserDetails.id) {
                console.log('Booking belong to Logged in Technician');
                props.navigation.push('TermsConditions', {
                  technicianId: booking.agent_id,
                  customerId: booking.customer_id,
                  vehicleId: booking.vehicle_id,
                  bookingId: booking.booking_id,
                  amount: price,
                  type: type === 'CPO' ? 0 : 1,
                });
              } else {
                console.log(
                  'Booking belong to another Technician, Updating technician',
                );
                try {
                  setIsLoading(true);
                  const response: any = await AP.Calls.Booking.updateAgent({
                    booking_id: booking.booking_id,
                    agent_id: props.getUserDetails.id,
                  });
                  setIsLoading(false);
                  console.log(response);
                  if (response.success) {
                    props.navigation.push('TermsConditions', {
                      technicianId: props.getUserDetails.id,
                      customerId: booking.customer_id,
                      vehicleId: booking.vehicle_id,
                      bookingId: booking.booking_id,
                      amount: price,
                      type: type === 'CPO' ? 0 : 1,
                    });
                  } else {
                    Alert.alert(
                      'Error',
                      'Unable to update Technician in Current Booking',
                    );
                  }
                } catch (e) {
                  setIsLoading(false);
                  Alert.alert(
                    'Error',
                    'This app is under jurisdiction of another partner. you cannot start this inspection',
                  );
                  console.log('Error :>> ', e);
                }
              }
            },
            type: 'yes',
          },
        ],
      );
      return;
    }

    if (booking.customer_terms_accepted) {
      if (
        booking.status === 'visually_inspected' ||
        booking.status === 'Resumed' ||
        booking.status === 'Paused'
      ) {
        props.navigation.push('Test', {
          bookingId: booking.booking_id,
          status: booking.status,
          inspectionType: booking.booking_refrence.split('-')[0],
        });
      } else {
        props.navigation.push('visualInspection', {
          bookingId: booking.booking_id,
          status: booking.status,
          inspectionType: booking.booking_refrence.split('-')[0],
        });
      }
    } else {
      if (
        booking.status === 'Cancelled after payment' ||
        booking.status === 'Cancelled before payment'
      ) {
        Message.alert('Info', 'This Inspection has been ' + booking.status);
      } else if (booking.status === 'Completed') {
        Message.alert('Info', 'This Inspection has already been completed ');
      } else {
        openTermsAndConditions();
      }
    }
  };

  const openTermsAndConditions: function = async () => {
    try {
      const response: any = await AP.Calls.Language.getTranslation({
        language: 'ar',
      });
      if (response) {
        setTerms(response.data.language_label.terms_and_conditions);
        handleModalVisibility(true);
      }
    } catch (e) {
      console.log('ERROR :>>', e);
    }
  };

  const getPrice: function = async (
    manufacturerId,
    modelId,
    yearId,
    months,
  ) => {
    let price = {
      cpo: '0',
      ppi: '0',
    };
    try {
      const res: any = await AP.Calls.Quotation.getQuotation({
        manufacturerId,
        modelId,
        yearId,
      });

      if (res.cpo_sixmonth) {
        price = {
          cpo: getPriceForCpoType(res, months ? months : '6'),
          ppi: res.price_ppi,
        };
        return price;
      } else {
        Alert.alert(
          'Error',
          'Unable to Get Price From Server. Please Try Again',
        );
        return false;
      }
    } catch (e) {
      console.log('Error :>> ', e);
      return false;
    }
  };

  const getPriceForCpoType: function = (res, serviceType) => {
    switch (serviceType) {
      case '6':
        return res.cpo_sixmonth;
      case '12':
        return res.cpo_twelvemonth;
      case '18':
        return res.cpo_eighteen;
      case '24':
        return res.cpo_twentyfourrmonth;
      case '30':
        return res.cpo_thirty;
      case '36':
        return res.cpo_thirtysixmonth;
      default:
        return 0;
    }
  };

  const handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  const handleGoBack: function = () => {
    props.navigation.goBack(null);
  };

  const handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const handleModalVisibility: function = (visible) => {
    setModalVisible(visible);
  };

  const handleAcceptTerms: function = () => {
    handleModalVisibility(false);
    props.navigation.push('signature', {
      bookingId: booking.booking_id,
    });
  };

  const handleTermsSms: function = async () => {
    setIsLoading(true);
    try {
      const response: any = await AP.Calls.Customer.sendTermsBySms({
        customer_id: customer.id,
        key: 'terms_and_conditions',
      });
      setIsLoading(false);
      if (response) {
        if (response.data.sms_sent === 1) {
          ToastAndroid.showWithGravity(
            `Terms & Conditions have sent Successfully via SMS`,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        } else {
          ToastAndroid.showWithGravity(
            `ERROR Sending SMS, Please Check If your Mobile Number is in correct format`,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      } else {
        ToastAndroid.showWithGravity(
          `ERROR Sending SMS, Please Check If your Mobile Number is in correct format`,
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
      handleModalVisibility(false);
    } catch (e) {
      setIsLoading(false);
      ToastAndroid.showWithGravity(
        `ERROR Sending SMS, Please Check If your Mobile Number is in correct format`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      console.log('ERROR :>> ', e);
    }

    // props.navigation.push('signature', {
    //   bookingId: booking.booking_id,
    // });
  };

  const getBtnLabel: function = (booking) => {
    let label = 'CONFIRM';

    if (booking.status === 'visually_inspected') {
      label = 'START';
    } else if (booking.status === 'Resumed' || booking.status === 'Paused') {
      label = 'RESUME';
    }
    return label;
  };

  return (
    <>
      <Message />
      <Loader visible={isLoading} message={'Fetching Details...'} />
      <Layout
        artType={'thin'}
        backgroundColor={Theme.base_color_9}
        sectionHead={
          <AppHeader
            type={2}
            headerLogo={false}
            headerImg={false}
            headerImgPath={''}
            headerText={'Details Confirmation'}
            rightIcon={[
              {
                icon: 'Profile',
                action: handleProfileClick,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              },
              {
                icon: 'Search',
                action: handleSearchClick,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              },
            ]}
            leftIcon={{
              icon: 'backBtn',
              action: handleGoBack,
              fill: Theme.primary_color_2,
              bg: Theme.base_color_10,
            }}
          />
        }
        sectionBody={
          <>
            <View style={[style.mainContainer]}>
              <View>
                <Text
                  weight={'regular'}
                  underline={true}
                  color={Theme.primary_color_2}
                  style={style.headingText}>
                  Customer Details
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Name:</Text>
                  <Text style={style.subTextSmall}>
                    {customer.first_name} {customer.last_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Contact:</Text>
                  <Text style={style.subTextSmall}>{customer.phone}</Text>
                </View>
                {customer.email && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={style.subText}>Email:</Text>
                      <Text style={style.subTextSmall}>{customer.email}</Text>
                    </View>
                  </>
                )}
              </View>

              <View>
                <Text
                  weight={'regular'}
                  underline={true}
                  color={Theme.primary_color_2}
                  style={[style.headingText, {marginTop: 20}]}>
                  Vehicle Details
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Type:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.type ? vehicle.type : 'not available *'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Name:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Color:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.color ? vehicle.color : 'not available *'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>VIN No.:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.vin ? vehicle.vin : 'not available *'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Plate No.:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.plate ? vehicle.plate : 'not available *'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Registration:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.registration
                      ? vehicle.registration
                      : 'not available *'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Milage:</Text>
                  <Text style={style.subTextSmall}>
                    {vehicle.current_mileage
                      ? vehicle.current_mileage + ' KM'
                      : 'not available *'}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  weight={'regular'}
                  underline={true}
                  color={Theme.primary_color_2}
                  style={[style.headingText, {marginTop: 20}]}>
                  Booking Details
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Appointment Date:</Text>
                  <Text style={style.subTextSmall}>
                    {booking.appointment_date}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Appointment Time:</Text>
                  <Text style={style.subTextSmall}>
                    {booking.appointment_from} - {booking.appointment_to}
                  </Text>
                </View>
                {booking.booking_refrence && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={style.subText}>Service Type:</Text>
                      <Text style={style.subTextSmall}>{'Light'}</Text>
                    </View>
                  </>
                )}

                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Term & Conditions:</Text>
                  <Text style={style.subTextSmall}>
                    {booking.customer_terms_accepted ? 'Accepted' : 'Pending'}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Status:</Text>
                  <Text style={style.subTextSmall}>{booking.status}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Road Test Driver:</Text>
                  <Text style={style.subTextSmall}>
                    {driver
                      ? driver.first_name + ' ' + driver.last_name
                      : 'Not Assigned'}
                  </Text>
                </View>

                {driver && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={style.subText}>Driver Contact:</Text>
                      <Text style={style.subTextSmall}>{driver.phone}</Text>
                    </View>
                  </>
                )}

                <View style={{flexDirection: 'row'}}>
                  <Text style={style.subText}>Road Test Status:</Text>
                  <Text style={style.subTextSmall}>
                    {booking.road_tested ? 'Tested' : 'Not Tested'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        }
      />

      <View style={{position: 'absolute', right: 80, bottom: 50}}>
        <Button
          label={getBtnLabel(booking)}
          action={handleConfirmation.bind(this)}
          style={{width: 150}}
        />
      </View>
      {/* Model View */}
      <View style={style.centeredView}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            handleModalVisibility(false);
          }}>
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <View style={style.closeButton}>
                <TouchableOpacity
                  onPress={handleModalVisibility.bind(this, false)}>
                  <Icon
                    name={'close'}
                    width={15}
                    height={15}
                    fill={Theme.base_color_5}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>
              <View style={[style.modalBodyRow, {width: 650, height: 450}]}>
                <View>
                  <View style={style.termsTitle}>
                    <Text size={2}>Term & Conditions</Text>
                  </View>
                  <View style={style.termsContentContainer}>
                    <ScrollView scrollEnabled={true}>
                      <Text size={1} style={style.termsContent}>
                        {terms}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={style.modalBtnRow}>
                    <Button
                      label={'Decline'}
                      action={() => {
                        handleModalVisibility(false);
                      }}
                      style={{width: 150, elevation: 0}}
                      type={'tertiary'}
                    />
                    <Button
                      label={'Send SMS'}
                      action={handleTermsSms.bind(this)}
                      style={{width: 150, elevation: 0}}
                      type={'tertiary'}
                    />
                    <Button
                      label={'Accept'}
                      action={handleAcceptTerms.bind(this)}
                      style={{width: 150}}
                      type={'secondary'}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const style: Object = StyleSheet.create({
  mainContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    margin: 0,
    justifyContent: 'flex-start',
    padding: 10,
    paddingLeft: 40,
    flexWrap: 'wrap',
    // marginTop: Theme.page_margin_for_transparent_header,
    width: '100%',
  },
  headingText: {
    textTransform: 'uppercase',
    fontWeight: '900',
    fontSize: 24,
    alignSelf: 'flex-start',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
    height: 8,
  },
  subText: {
    color: Theme.base_color_5,
    fontSize: 22,
    alignSelf: 'flex-start',
    paddingLeft: 40,
    paddingTop: 5,
    paddingBottom: 5,
    // textDecorationLine: 'underline'
  },
  subTextSmall: {
    color: Theme.base_color_3,
    fontSize: 22,
    alignSelf: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
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
  termsTitle: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    color: Theme.base_color_4,
  },
  termsContentContainer: {
    height: 350,
    padding: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: Theme.base_color_8,
    borderRadius: 4,
    width: 610,
  },
  termsContent: {
    textAlign: 'justify',
    color: Theme.base_color_5,
  },
  modalBtnRow: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
)(Confirmation): any);
