// @flow

import React, {useEffect, useState} from 'react';
import Card from '../../components/Card';
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Linking,
  //Alert,
  Modal,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import style from './style';
import FooterLine from '../../components/footerLine';
import PageBGArtwork from '../../components/PageBGArtwork';
import Icon from '../../components/Icons';
import Util from '../../util';
import {Loader} from '../../components/Loader';
import AP from '../../api';
import {connect} from 'react-redux';
import moment from 'moment';
import Button from '../../components/Button';
import QRCode from 'react-native-qrcode-svg';
import {Picker} from '@react-native-picker/picker';
import RNFS from 'react-native-fs';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Message from '../../components/Message';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  style?: any,
  onPress: () => void,
  data: Array<any>,
  getUserDetails: {
    id: number,
  },
};

let svg = '';

const {width} = Dimensions.get('screen');
const PASS = 'PASS';
const FAIL = 'FAIL';
const NA = 'Not Available';

const OngoingCPOS = (props: Props): any => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerModalVisible, setScannerModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(false);
  const [currentReports, setCurrentReports] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState('');

  const [scan, setScan] = useState(false);
  const [ScanResult, setScanResult] = useState(false);
  const [scanCorrectly, setScanCorrectly] = useState(false);
  const [result, setResult] = useState(null);
  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);

  useEffect(() => {
    getBookingList();
  }, []);

  const FROM_DATE = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const TO_DATE = moment().format('YYYY-MM-DD');
  //const STATUS = ['Completed', 'Paused', 'Resumed', 'visually_inspected'];
  const STATUS = ['Completed'];
  const UNSELECTABLE = '';

  const getBookingList: function = async () => {
    try {
      const res: any = await AP.Calls.Booking.getBookingsList({
        technician_id: props.getUserDetails.id,
        //fromdate: FROM_DATE,
        //todate: TO_DATE,
        status: STATUS,
      });

      console.log(res);

      const bookingData = [];
      res.map((obj, i) => {
        bookingData.push({
          bookingId: obj.booking_id,
          customerName: obj.customer.first_name + ' ' + obj.customer.last_name,
          customerPhone: obj.customer.phone,
          customerId: obj.customer.id,
          carManufacturer: obj.vehicle.make,
          carMake: obj.vehicle.model,
          CarYear: obj.vehicle.year,
          carVin: obj.vehicle.vin,
          plate: obj.vehicle.plate,
          appointmentTime: obj.appointment_from,
          appointmentDate: obj.appointment_date,
          status: obj.status,
          type: 'Light',
          bookingRef: obj.booking_refrence,
          technicianId: obj.user.id,
          vehicleId: obj.vehicle.id,
          result: formatResult(obj.result),
          score: formatScore(obj.score),
          qrScanned: obj.qrScanned,
        });
      });
      setData(bookingData);
      setIsLoading(false);
      console.log('=======Booking List Response=======', bookingData);
    } catch (e) {
      console.log('=======Booking List get Error======', e);
    }
  };

  const formatResult = (result) => {
    switch (result) {
      case 'pass':
        return PASS;
      case 'fail':
        return FAIL;
      case 'false':
        return NA;
      default:
        return NA;
    }
  };

  const formatScore = (score) => {
    if (
      parseInt(score.total_score) === 0 ||
      typeof score.total_score === 'undefined'
    ) {
      return NA;
    } else {
      return (
        ((score.obtained_score / score.total_score) * 100).toFixed(1) + '%'
      );
    }
  };

  const formatRoadTestStatus: function = (status) => {
    switch (status) {
      case undefined:
        return 'Pending';
      case '':
        return 'Pending';
      case null:
        return 'Pending';
      case 'null':
        return 'Pending';
      case 'Road_testing':
        return 'In Progress';
      case 'Road_tested':
        return 'Completed';
      default:
        console.log(status);
        return 'uga buga';
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

  const handleCardClick: function = async (obj) => {
    setCurrentBooking(obj);
    if (obj.result === NA && obj.status === 'Completed') {
      Message.alert(
        'Message',
        'This Inspection is not finished properly, Please contact Support',
      );
      return;
    } else {
      try {
        setIsLoading(true);
        const res = await AP.Calls.Reports.getReports({
          bookingId: obj.bookingId,
        });
        if (res.success) {
          setCurrentReports(res.data.inspectionLinks);
          handleModalVisibility(true);
        } else {
          Message.alert(
            'Error',
            'System encountered an error while fetching reports from server',
          );
        }
        setIsLoading(false);
      } catch (e) {
        setCurrentReports(false);
        handleModalVisibility(true);
        setIsLoading(false);
        console.log('Error', e);
      }
    }

    //if (obj.result !== NA) {

    // } else {
    //   Message.alert('Message', 'This Inspection is still under process.');
    // }
  };

  const handleModalVisibility: function = (visible) => {
    setModalVisible(visible);
    if (visible === false) {
      setCurrentBooking(false);
      setCurrentReports(false);
      setUpgrading(false);
      setSelectedUpgrade('');
      setQrCode('');
      svg = '';
    }
  };

  const handleScannerModalVisibility: function = (
    visible,
    bookingObj = false,
  ) => {
    setModalVisible(false);
    setScannerModalVisible(visible);
    if (bookingObj) {
      setCurrentBooking(bookingObj);
    }
    if (visible === false) {
      // handleCardClick(bookingObj);
      setScan(false);
      setScanResult(false);
      setScanCorrectly(false);
      setResult(null);
    }
  };

  const handleLinkOpening = (type) => {
    switch (type) {
      case 'mojaz':
        Linking.openURL(currentReports.mojaz_link);
        break;
      case 'inspection':
        Linking.openURL(currentReports.report_web_link);
        break;
      case 'warranty':
        Linking.openURL(currentReports.warranty_policy_link);
        break;
      case 'certificate':
        Linking.openURL(currentReports.warranty_certificate_link);
        break;
      default:
        Message.alert('Message', 'Report Type Mismatch');
    }
  };

  const checkBtnDisable: function = (obj, type) => {
    let status = false;
    if (currentReports) {
      if (obj.type === 'Light') {
        status = true;
      }
      if (type) {
        switch (type) {
          case 'mojaz':
            status = currentReports.mojaz_link === '' ? true : false;
            break;
          case 'inspection':
            status = currentReports.report_web_link === '' ? true : false;
            break;
          case 'warranty':
            status = currentReports.warranty_policy_link === '' ? true : false;
            break;
          case 'certificate':
            status =
              currentReports.warranty_certificate_link === '' ? true : false;
            break;
        }
      }
    } else {
      return true; // disable
    }
    return status;
  };

  const trimText: function = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length - 3) + '...';
    } else {
      return text;
    }
  };

  const generateQrForPrint: function = async (bookingId) => {
    const imagePath = `${
      RNFS.TemporaryDirectoryPath
    }/QR_Print_${moment().format('YYYY-MM-DD_HH-mm-ss')}.jpg`;

    try {
      setIsLoading(true);
      const res = await AP.Calls.TestsCategories.finishTest({
        booking_id: bookingId,
      });
      setIsLoading(false);
      setQrCode(
        <>
          <QRCode
            size={300}
            // enableLinearGradient={true}
            // linearGradient={[Theme.primary_color_3, Theme.primary_color_1]}
            value={res.data.report_link}
            logo={require('../../assets/icons/qr_logo.png')}
            logoBackgroundColor={Theme.base_color_10}
            logoMargin={5}
            getRef={(c) => (svg = c)}
          />
          <View>
            <Button
              label={'PRINT'}
              action={handleQrPrint.bind(this, bookingId)}
              style={style.buttonStyle}
              disabled={false}
            />
          </View>
        </>,
      );
    } catch (e) {
      console.log('Error', e);
    }
  };

  const handleQrPrint: function = (bookingId) => {
    const {PrinterModule} = NativeModules;
    svg.toDataURL((data) => {
      PrinterModule.printPicture(data);
    });
  };

  const handleUpgradeClick: function = (bookingId) => {
    setUpgrading(true);
  };

  const handleUpgradePpiToCpo: function = async () => {
    try {
      setIsLoading(true);
      const res: any = await AP.Calls.Upgrade.checkEligibility({
        booking_id: currentBooking.bookingId,
        upgrade_from: 'ppi',
        upgrade_to: selectedUpgrade,
      });
      setIsLoading(false);
      if (res.payablePrice) {
        const amount = parseFloat(res.payablePrice).toFixed(1);
        const tax = parseFloat(amount * (parseFloat(res.vat) / 100)).toFixed(1);
        const total = parseFloat(parseFloat(amount) + parseFloat(tax)).toFixed(
          1,
        );

        Message.alert(
          res.success,
          `You Need to Pay: ${amount} SAR + ${res.vat}% Tax (${tax} SAR)\nTotal: ${total} SAR\n\nDo you want to Upgrade?`,
          [
            {
              text: 'No',
              onPress: () => {
                handleModalVisibility(false);
              },
              type: 'no',
            },
            {
              text: 'Upgrade',
              onPress: () => {
                handleModalVisibility(false);
                props.navigation.push('payment', {
                  bookingId: currentBooking.bookingId,
                  technicianId: currentBooking.technicianId,
                  customerId: currentBooking.customerId,
                  vehicleId: currentBooking.vehicleId,
                  amount: total,
                  type: 1,
                  serviceDetailType: mapUpgradeTextToNumber(selectedUpgrade),
                  upgrade: true,
                  upgradeFrom: 'ppi',
                  upgradeTo: selectedUpgrade,
                });
              },
              type: 'yes',
            },
          ],
        );
      } else {
        handleModalVisibility(false);
        Message.alert(
          'Not Eligible for upgrade',
          'Please Contact Customer Support or Book a new Inspection',
        );
      }
    } catch (e) {
      handleModalVisibility(false);
      setIsLoading(false);
      Message.alert(
        'Not Eligible for upgrade',
        'Please Contact Customer Support or Book a new Inspection',
      );
      console.log('ERROR :>>', e);
    }
  };

  const mapUpgradeTextToNumber: function = (text) => {
    switch (text) {
      case 'cpo_sixmonth':
        return '6';
      case 'cpo_twelvemonth':
        return '12';
      case 'cpo_eighteen':
        return '18';
      case 'cpo_twentyfourrmonth':
        return '24';
      case 'cpo_thirty':
        return '30';
      case 'cpo_thirtysixmonth':
        return '36';
      default:
        return '0';
    }
  };

  const bindQrWithInspection = (bookingObj) => {
    handleModalVisibility(false);
    handleScannerModalVisibility(true, bookingObj);
  };

  // Scanner related

  const onSuccess: function = async (e) => {
    setResult(e);
    setScan(false);
    setScanResult(true);

    const check = e.data.split('/sticker/');
    if (Array.isArray(check) && check.length > 1) {
      try {
        setIsLoading(true);
        const res = await AP.Calls.Reports.bindQr({
          booking_id: currentBooking.bookingId,
          sticker_id: check[1],
          is_light: true,
        });
        setIsLoading(false);
        if (res.success) {
          setScanCorrectly(true);
          currentBooking['qrScanned'] = true;
        } else {
          Message.alert('Error', res.data.Error);
          setScanCorrectly(false);
        }
      } catch (e) {
        setIsLoading(false);
        setScanCorrectly(false);
        console.log(e);
      }
    } else {
      setScanCorrectly(false);
    }
  };

  const activeQR: function = () => {
    setScan(true);
  };

  const scanAgain: function = () => {
    setScan(true);
    setScanResult(false);
  };

  const handleCameraStop: function = () => {
    setScan(false);
  };

  const handleTorchToggle: function = () => {
    if (flash === RNCamera.Constants.FlashMode.off) {
      setFlash(RNCamera.Constants.FlashMode.torch);
    } else {
      setFlash(RNCamera.Constants.FlashMode.off);
    }
  };

  return (
    <>
      <Message />
      <Loader visible={isLoading} message={'Loading ...'} />
      <AppHeader
        type={2}
        headerLogo={false}
        headerImg={false}
        headerImgPath={''}
        headerText={'Completed Bookings'}
        rightIcon={
          [
            // {
            //   icon: 'Profile',
            //   action: handleProfileClick,
            //   fill: Theme.primary_color_2,
            //   bg: Theme.base_color_10,
            // },
            // {
            //   icon: 'Search',
            //   action: handleSearchClick,
            //   fill: Theme.primary_color_2,
            //   bg: Theme.base_color_10,
            // },
          ]
        }
        leftIcon={{
          icon: 'backBtn',
          action: handleGoBack,
          fill: Theme.primary_color_2,
          bg: Theme.base_color_10,
        }}
      />
      <View style={{}}>
        {/* <PageBGArtwork type={'thin'} /> */}
        <PageBGArtwork type={'thick'} />
      </View>

      <ScrollView scrollEnabled={true}>
        <View style={[style.mainContainer, {width: width}]}>
          {data.length > 0 ? (
            data.map((obj, i) => {
              //(data ? data : tempData).map((obj) => {
              return (
                <>
                  <Card
                    onPress={handleCardClick.bind(this, obj)}
                    style={{
                      width: (width - 100) / 3,
                      padding: 5,
                      margin: 10,
                    }}>
                    <View style={style.topContainer}>
                      <View>
                        <Text
                          weight={'regular'}
                          underline={true}
                          color={Theme.primary_color_2}
                          style={style.headingText}>
                          {trimText(obj.customerName, 18)}
                        </Text>
                        <Text style={style.subText}>
                          {obj.carManufacturer} {obj.carMake} - {obj.CarYear}
                        </Text>
                        <Text style={style.subText}>
                          {obj.carVin ? obj.carVin : '- - - - - - - - - - -'}
                        </Text>
                        <Text style={style.subText}>
                          {obj.plate ? obj.plate : '- - -  - - -'}
                        </Text>
                      </View>

                      <Text style={style.subText}>
                        <Icon
                          name={'Profile'}
                          width={15}
                          height={15}
                          fill={'red'}
                          style={{}}></Icon>
                        &nbsp;
                        {obj.customerPhone}
                      </Text>
                    </View>

                    <View style={style.horizontalLine} />

                    <View style={style.midContainer}>
                      <Text style={style.subTextSmall}>Inspection Status:</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={style.subTextSmall}>{obj.status}</Text>
                        <View
                          style={[
                            style.statusBall,
                            obj.status === 'Completed'
                              ? style.statusCompleted
                              : style.statusPending,
                          ]}
                        />
                      </View>
                    </View>

                    <View style={style.horizontalLine} />

                    <View style={style.midContainer}>
                      <Text style={style.subTextSmall}>
                        <Text style={style.subText}>Result</Text>
                      </Text>

                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 1,
                            paddingBottom: 2,
                            borderRadius: 15,
                          },
                          obj.result !== NA
                            ? obj.result === PASS
                              ? {backgroundColor: Theme.supporting_color_1}
                              : {backgroundColor: Theme.secondary_color_2}
                            : {backgroundColor: Theme.primary_color_3},
                        ]}>
                        <Text
                          style={[
                            style.subTextSmall,
                            {color: Theme.base_color_10},
                          ]}>
                          {obj.result !== NA ? obj.result : NA}
                        </Text>
                      </View>
                    </View>

                    <View style={style.horizontalLine} />

                    <View style={style.midContainer}>
                      <Text style={style.subTextSmall}>
                        <Text style={style.subText}>Score</Text>
                      </Text>

                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 1,
                            paddingBottom: 2,
                            borderRadius: 15,
                          },
                        ]}>
                        <Text style={[style.subTextSmall]}>{obj.score}</Text>
                      </View>
                    </View>

                    <View style={style.horizontalLine} />

                    <View style={[style.bottomContainer, {paddingBottom: 15}]}>
                      <Text style={style.subTextSmall}>
                        {obj.appointmentDate}
                      </Text>
                      <Text style={style.subTextSmall}>
                        {obj.appointmentTime}
                      </Text>
                    </View>
                  </Card>
                </>
              );
            })
          ) : (
            <>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingTop: '25%',
                  // paddingLeft: 68,
                  // paddingTop: 20
                }}>
                <Text size={3} style={{color: Theme.base_color_5}}>
                  - No Completed Bookings Found -
                </Text>
              </View>
            </>
          )}
          {/*  */}
        </View>
      </ScrollView>
      {/* Model View */}
      <View style={style.centeredView}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            handleModalVisibility(!modalVisible);
          }}>
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <View style={style.modalTop}>
                <View>
                  <Text
                    weight={'regular'}
                    underline={true}
                    color={Theme.primary_color_2}
                    style={[style.headingTextSM, {marginBottom: -10}]}>
                    Type:{' '}
                    {currentBooking.bookingRef &&
                      currentBooking.bookingRef.substring(0, 3)}
                  </Text>
                </View>
                <View style={style.closeButton}>
                  <TouchableOpacity
                    onPress={handleModalVisibility.bind(this, !modalVisible)}>
                    <Icon
                      name={'close'}
                      width={15}
                      height={15}
                      fill={Theme.base_color_5}
                      style={{}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[style.modalBodyRow, {minWidth: 400, minHeight: 200}]}>
                {qrCode === '' ? (
                  <>
                    <View style={style.modalContent}>
                      <View style={style.contentRow}>
                        <Button
                          label={'Inspection Report'}
                          action={handleLinkOpening.bind(this, 'inspection')}
                          style={[style.buttonStyle, {width: 550}]}
                          disabled={checkBtnDisable(
                            currentBooking,
                            'inspection',
                          )}
                        />
                      </View>

                      <View style={style.contentRow}>
                        <Button
                          type={'tertiary'}
                          label={
                            currentBooking.qrScanned
                              ? 'QR Code Associated'
                              : 'Bind QR with Inspection'
                          }
                          action={bindQrWithInspection.bind(
                            this,
                            currentBooking,
                          )}
                          style={[style.buttonStyle, {width: 550}]}
                          disabled={currentBooking.qrScanned !== false}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={style.qrViewer}>{qrCode}</View>
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>
        {/* ------------- Scanner Modal --------------- */}
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={scannerModalVisible}
          onRequestClose={() => {
            handleScannerModalVisibility(!scannerModalVisible);
          }}>
          {(!scan && !ScanResult) || ScanResult ? (
            <>
              <View style={style.centeredView}>
                <View style={style.modalView}>
                  <View style={style.modalTop}>
                    <View>
                      <Text
                        weight={'regular'}
                        underline={true}
                        color={Theme.primary_color_2}
                        style={[style.headingTextSM, {marginBottom: -10}]}>
                        QR Scanner
                      </Text>
                    </View>
                    <View style={style.closeButton}>
                      <TouchableOpacity
                        onPress={handleScannerModalVisibility.bind(
                          this,
                          !scannerModalVisible,
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
                  </View>

                  <View
                    style={[
                      style.modalBodyRow,
                      {minWidth: 400, minHeight: 200},
                    ]}>
                    <View style={style.modalContent}>
                      {!scan && !ScanResult && (
                        <>
                          <View style={style.landingContainer}>
                            <Text size={3} style={style.descText}>
                              Scan QR Code to bind it with Inspection
                            </Text>

                            <TouchableOpacity
                              onPress={activeQR}
                              style={[style.buttonTouchable, {marginTop: 50}]}>
                              <Text size={3} style={style.buttonTextStyle}>
                                Scan QR
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                      {ScanResult && (
                        <>
                          <View style={style.scanCardView}>
                            {scanCorrectly ? (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Icon
                                    name={'check'}
                                    fill={Theme.secondary_color_3}
                                    width={44}
                                    height={44}
                                    style={{alignSelf: 'center'}}
                                  />
                                  <Text size={2}>
                                    {' '}
                                    QR Code Successfully Affiliated with Booking
                                    Reference:{' '}
                                  </Text>
                                  <Text size={2} style={{fontWeight: 'bold'}}>
                                    {currentBooking.bookingRef}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={handleScannerModalVisibility.bind(
                                    this,
                                    !scannerModalVisible,
                                  )}
                                  style={style.buttonTouchable}>
                                  <Text size={2} style={style.buttonTextStyle}>
                                    OK
                                  </Text>
                                </TouchableOpacity>
                              </>
                            ) : (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Icon
                                    name={'close'}
                                    fill={Theme.secondary_color_2}
                                    width={38}
                                    height={38}
                                    style={{}}
                                  />
                                  <Text size={2}>
                                    {' '}
                                    Unable to Bind QR code with Booking. Are you
                                    scanning correct QR code?
                                  </Text>
                                </View>

                                <TouchableOpacity
                                  onPress={scanAgain}
                                  style={style.buttonTouchable}>
                                  <Text size={2} style={style.buttonTextStyle}>
                                    Scan Again
                                  </Text>
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {scan && (
                <QRCodeScanner
                  reactivate={true}
                  showMarker={true}
                  cameraStyle={style.cameraStyle}
                  markerStyle={style.markerStyle}
                  flashMode={flash}
                  onRead={onSuccess}
                  bottomContent={
                    <View style={style.bottomAreaView}>
                      <TouchableOpacity
                        style={[style.cameraButton, {marginRight: 10}]}
                        onPress={handleCameraStop.bind(this)}>
                        <Text style={style.cameraButtonText}>Stop Scan</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[style.cameraButton, {marginLeft: 10}]}
                        onPress={handleTorchToggle.bind(this)}>
                        <Text style={style.cameraButtonText}>Torch</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              )}
            </>
          )}
        </Modal>
      </View>

      <View style={style.footer}>
        <FooterLine />
      </View>
    </>
  );
};

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
)(OngoingCPOS): any);
