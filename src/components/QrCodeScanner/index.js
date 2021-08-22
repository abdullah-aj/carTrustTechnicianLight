// @flow

import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  View,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Text from '../Text';
import style from './style';
import FooterLine from '../footerLine';
import PageBGArtwork from '../PageBGArtwork';
import Layout from '../Layout/FullPage';
import {AppHeader} from '../AppHeader';
import Theme from '../../App.style';
import Card from '../Card';
import Icon from '../Icons';
import AP from '../../api';

type Props = {
  navigation: {
    push: any,
    goBack: any,
  },
  torch: boolean,
  description: string,
  handleProfileClick: function,
  handleSearchClick: function,
  handleGoBack: function,
  landingTitle: string,
  resultTitle: string,
  handleScanSuccess: function,
};

type State = {
  scan: boolean,
  ScanResult: boolean,
  result: any,
  flash: any,
  booking: Object,
  customer: Object,
  vehicle: Object,
};

const {height, width} = Dimensions.get('window');

class Scan extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
      flash: RNCamera.Constants.FlashMode.off,
      booking: {},
      customer: {},
      vehicle: {},
    };
  }

  onSuccess: function = async (e) => {
    this.setState({
      result: e,
      scan: false,
      ScanResult: true,
    });
    const check = e.data.substring(0, 4);
    if (check === 'http') {
      Linking.openURL(e.data).catch((err) =>
        console.error('An error occurred', err),
      );
    }
    if (['PPI-', 'CPO-'].includes(check.toUpperCase())) {
      // PPI-0-91-27 (service_name, partner_id, customer_id, booking_id)
      const arr = e.data.split('-');
      try {
        const response: any = await AP.Calls.Booking.getBookingDetail({
          bookingId: arr[3],
        });
        const {booking, customer, vehicle} = response;
        this.setState({
          booking,
          customer,
          vehicle,
        });
      } catch (e) {
        console.log('Error :>> ', e);
      }
    } else {
      console.log('Something undesired has happened');
    }
  };

  activeQR: function = () => {
    this.setState({
      scan: true,
    });
  };

  scanAgain: function = () => {
    this.setState({
      scan: true,
      ScanResult: false,
    });
  };

  handleCameraStop: function = () => {
    this.setState({scan: false});
  };

  handleTorchToggle: function = () => {
    if (this.state.flash === RNCamera.Constants.FlashMode.off) {
      this.setState({flash: RNCamera.Constants.FlashMode.torch});
    } else {
      this.setState({flash: RNCamera.Constants.FlashMode.off});
    }
  };

  handleCardClick: function = () => {
    this.props.navigation.push('confirmation', {
      bookingId: this.state.booking.booking_id,
    });
  };

  render(): React.Node {
    const {scan, ScanResult, result} = this.state;
    return (!scan && !ScanResult) || ScanResult ? (
      <>
        <Layout
          backgroundColor={Theme.base_color_9}
          artType={'thin'}
          title={
            !scan && !ScanResult
              ? this.props.landingTitle
              : this.props.resultTitle
          }
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Qr Scanner'}
              rightIcon={[
                {
                  icon: 'Profile',
                  action: this.props.handleProfileClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
                {
                  icon: 'Search',
                  action: this.props.handleSearchClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
              ]}
              leftIcon={{
                icon: 'backBtn',
                action: this.props.handleGoBack,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              }}
            />
          }
          sectionBody={
            <>
              {/* Landing Section */}
              {!scan && !ScanResult && (
                <View style={style.landingContainer}>
                  <Text size={3} style={style.descText}>
                    {this.props.description}
                  </Text>

                  <TouchableOpacity
                    onPress={this.activeQR}
                    style={[style.buttonTouchable, {marginTop: 50}]}>
                    <Text size={3} style={style.buttonTextStyle}>
                      Scan QR
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Result Section */}
              {ScanResult && (
                <>
                  {Object.keys(this.state.customer).length > 0 && (
                    <>
                      <View>
                        <Card
                          onPress={this.handleCardClick.bind(this)}
                          style={{
                            width: (width - 100) / 2,
                            padding: 5,
                            marginLeft: 90,
                            marginTop: 30,
                          }}>
                          <View style={style.topContainer}>
                            <View>
                              <Text
                                weight={'regular'}
                                underline={true}
                                color={Theme.primary_color_2}
                                style={style.headingText}>
                                {this.state.customer.first_name +
                                  ' ' +
                                  this.state.customer.last_name}
                              </Text>
                              <Text style={style.subText}>
                                {this.state.vehicle.make +
                                  ' ' +
                                  this.state.vehicle.model +
                                  ' ' +
                                  this.state.vehicle.year}
                              </Text>
                              <Text style={style.subText}>
                                {this.state.vehicle.vin}
                              </Text>
                              <Text style={style.subText}>
                                {this.state.vehicle.plate}
                              </Text>
                            </View>

                            <Text style={style.subText}>
                              <Icon
                                name={'Profile'}
                                width={15}
                                height={15}
                                fill={'red'}
                                style={{}}></Icon>
                              &nbsp; {this.state.customer.phone}
                            </Text>
                          </View>

                          <View style={style.bottomContainer}>
                            <Text style={style.subTextSmall}>
                              {this.state.booking.appointment_date}
                            </Text>
                            <Text style={style.subTextSmall}>
                              {this.state.booking.appointment_from}
                            </Text>
                          </View>
                        </Card>
                      </View>
                    </>
                  )}
                  {/* ==================== */}
                  <View style={style.scanCardView}>
                    {/* <Text size={2}>Type : {result.type}</Text>
                    <Text size={2}>Result : {result.data}</Text>
                    <Text size={2}>RawData: {result.rawData}</Text> */}
                    <TouchableOpacity
                      onPress={this.scanAgain}
                      style={style.buttonTouchable}>
                      <Text style={style.buttonTextStyle}>Scan Again</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          }
        />
      </>
    ) : (
      <>
        {/* Scanner Section */}
        {scan && (
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            cameraStyle={style.cameraStyle}
            markerStyle={style.markerStyle}
            flashMode={this.state.flash}
            onRead={this.onSuccess}
            bottomContent={
              <View style={style.bottomAreaView}>
                <TouchableOpacity
                  style={[style.cameraButton, {marginRight: 10}]}
                  onPress={this.handleCameraStop.bind(this)}>
                  <Text style={style.cameraButtonText}>Stop Scan</Text>
                </TouchableOpacity>
                {this.props.torch && (
                  <>
                    <TouchableOpacity
                      style={[style.cameraButton, {marginLeft: 10}]}
                      onPress={this.handleTorchToggle.bind(this)}>
                      <Text style={style.cameraButtonText}>Torch</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            }
          />
        )}
      </>
    );
  }
}

Scan.defaultProps = {
  description: 'Scan Code to Start',
  torch: false,
  landingTitle: 'lading',
  resultTitle: 'result',
};

export default Scan;
