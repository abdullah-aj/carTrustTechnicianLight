// @flow
import * as React from 'react';
import {View, TouchableOpacity, NativeModules, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import TwoHalves from '../../components/Layout/TwoHalves';
import {AppHeader} from '../../components/AppHeader';
import {Loader} from '../../components/Loader';
import Theme from '../../App.style';
import style from './style';
import {RNCamera} from 'react-native-camera';
import Text from '../../components/Text';
import Icon from '../../components/Icons';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AP from '../../api';
import moment from 'moment';
import Camera from '../../components/Camera';
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
  loader: string,
  paymentMethod: string,
  technicianId: number,
  customerId: number,
  vehicleId: number,
  bookingId: number,
  amount: number,
  type: string,
  formData: Object,
  confirmBtnDisable: boolean,
  uploadText: string,
  zoom: number,
  autoFocus: string,
  depth: number,
  CameraOn: boolean,
  torch: any,
  upgrade: boolean,
  upgradeFrom: string,
  upgradeTo: string,
};

class Payment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loader: '',
      paymentMethod: '',
      technicianId: 0,
      customerId: 0,
      vehicleId: 0,
      bookingId: 0,
      amount: 0,
      type: '',
      formData: {},
      confirmBtnDisable: true,
      uploadText: 'Click to take Picture',
      // ---- Camera
      zoom: 0,
      autoFocus: 'on',
      depth: 1,
      CameraOn: false,
      torch: RNCamera.Constants.FlashMode.off,
    };
  }

  componentDidMount: function = () => {
    const {
      technicianId,
      customerId,
      vehicleId,
      bookingId,
      amount,
      type,
      upgrade,
      upgradeFrom,
      upgradeTo,
    } = this.props.route.params;

    this.setState({
      technicianId,
      customerId,
      vehicleId,
      bookingId,
      amount,
      type,
      upgrade,
      upgradeFrom,
      upgradeTo,
    });
  };

  handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  handleGoBack: function = () => {
    if (this.state.paymentMethod === '') {
      this.props.navigation.goBack(null);
    } else {
      this.setState({
        paymentMethod: '',
      });
    }
  };

  handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  handlePaymentMethod: function = (type: string) => {
    this.setState({
      paymentMethod: type,
    });
  };

  handleConfirmPayment: function = async () => {
    this.setState({
      loader: 'Saving Payment Data',
    });
    let res;
    try {
      if (this.state.paymentMethod === 'offline') {
        res = await AP.Calls.Payment.addPayment(this.state.formData);
      } else {
        let obj = {
          booking_id: this.state.bookingId,
          customer_id: this.state.customerId,
          technician_id: this.state.technicianId,
          date: moment().format('YYYY-MM-DD'),
          time: moment().format('HH:mm:ss'),
          method_of_payment: this.state.paymentMethod,
          amount: this.state.amount,
          source: 'Partner App',
        };

        if (this.state.upgrade) {
          obj['is_upgrade_payment'] = 1;
        }

        try {
          const {CustomModule} = NativeModules;
          await CustomModule.doMPOSTransaction(
            this.state.amount,
            '0599529572',
            (message) => {
              console.log(message);
              Alert.alert('Message', message);
            },
          );
        } catch (e) {
          console.log(e);
        }

        //res = await AP.Calls.Payment.addPayment(obj);
      }

      if (res.data.payment_id) {
        if (this.state.upgrade) {
          const upgrade = await AP.Calls.Upgrade.upgradeInspection({
            booking_id: this.state.bookingId,
            payment_id: res.data.payment_id,
            upgraded_by: 'technician',
            upgraded_from: this.state.upgradeFrom,
            upgraded_to: this.state.upgradeTo,
          });
          if (upgrade.success) {
            this.setState({
              loader: '',
            });
            Message.alert(
              'Success',
              'Payment Saved and Inspection Updated Successfully.',
              [
                {
                  text: 'Go To Dashboard?',
                  onPress: () => this.props.navigation.push('Dashboard'),
                  type: 'yes',
                },
              ],
            );
          } else {
            Message.alert(
              'Alert',
              'An Error Occurred while upgrading inspection, but Payment Successful',
              [
                {
                  text: 'Contact Support',
                  onPress: () => Linking.openURL(`tel:0599529572`),
                  type: 'no',
                },
              ],
            );
          }
        } else {
          this.setState({
            loader: '',
          });
          Message.alert('Message', 'Payment Saved Successfully.', [
            {
              text: 'Start Inspection?',
              onPress: () =>
                this.props.navigation.push('confirmation', {
                  bookingId: this.state.bookingId,
                }),
              type: 'yes',
            },
          ]);
        }
      } else {
        this.setState({
          loader: 'Error Saving Data',
        });
      }
    } catch (e) {
      this.setState({
        loader: 'Error Saving Data',
      });
      console.log('Error :>>', e);
    }
  };

  closeCamera: function = () => {
    this.setState({CameraOn: false});
  };

  openCamera: function = () => {
    this.setState({
      CameraOn: true,
    });
  };

  takePicture: function = async (imageObj) => {
    const formData = new FormData();
    formData.append('receipt', imageObj);
    formData.append('booking_id', this.state.bookingId.toString());
    formData.append('customer_id', this.state.customerId.toString());
    formData.append('technician_id', this.state.technicianId.toString());
    formData.append('date', moment().format('YYYY-MM-DD'));
    formData.append('time', moment().format('HH:mm:ss'));
    formData.append('method_of_payment', this.state.paymentMethod);
    formData.append('amount', this.state.amount.toString());
    formData.append('source', 'Partner App');

    if (this.state.upgrade) {
      formData.append('is_upgrade_payment', 1);
    }

    this.setState({
      loader: '',
      uploadText: '1 File Selected',
      confirmBtnDisable: false,
      formData: formData,
      CameraOn: false,
    });
  };

  generateConfirmationMsg: function = () => {
    let msg = '';
    if (this.state.paymentMethod === 'mada') {
      msg = 'Mada card sending to Span machine';
    } else if (this.state.paymentMethod === 'visa') {
      msg = 'Visa / Master card sending to Span machine';
    } else if (this.state.paymentMethod === 'offline') {
      msg = `Please confirm receiving SR${this.state.amount} at cashier`;
    }
    return msg;
  };

  generateCardTitle: function = () => {
    let title = '';
    if (this.state.paymentMethod === '') {
      title = 'Payment Method';
    } else if (this.state.paymentMethod === 'mada') {
      title = 'Mada';
    } else if (this.state.paymentMethod === 'visa') {
      title = 'Visa / Master Card';
    } else if (this.state.paymentMethod === 'offline') {
      title = 'Offline';
    }
    return title;
  };

  render(): React.Node {
    return (
      <>
        <Message />
        <Loader
          visible={this.state.loader !== ''}
          message={this.state.loader}
        />
        {this.state.CameraOn && (
          <Camera
            CameraOn={this.state.CameraOn}
            closeCamera={this.closeCamera.bind(this)}
            takePicture={(imageObj) => {
              this.takePicture(imageObj);
            }}
          />
        )}
        <TwoHalves
          artType={'calculator'}
          title={this.generateCardTitle()}
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Payment'}
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
            this.state.paymentMethod === '' ? (
              <Card style={[style.cardContainer]}>
                <View style={style.formContainer}>
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      marginTop: 50,
                    }}>
                    <View>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}
                        style={{
                          marginBottom: 20,
                          marginTop: -20,
                          alignSelf: 'flex-start',
                        }}>
                        You Need to Pay {this.state.amount} SAR
                      </Text>
                    </View>
                    {/* <TouchableOpacity
                      style={style.button}
                      onPress={this.handlePaymentMethod.bind(this, 'mada')}>
                      <View style={style.textContainer}>
                        <Text style={style.text}>Mada</Text>
                      </View>
                      <View style={style.iconContainerView}>
                        <Icon
                          name={'mada'}
                          width={64}
                          height={40}
                          style={style.icon}
                        />
                      </View>
                    </TouchableOpacity> */}
                  </View>

                  {/* <View
                    style={{
                      flex: 1,
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      style={style.button}
                      onPress={this.handlePaymentMethod.bind(this, 'visa')}>
                      <View style={style.textContainer}>
                        <Text style={style.text}>Visa / Master</Text>
                      </View>
                      <View style={style.iconContainerView}>
                        <Icon
                          name={'master'}
                          width={64}
                          height={40}
                          style={style.icon}
                        />

                        <Icon
                          name={'visa'}
                          width={64}
                          height={40}
                          style={[style.icon, {right: 90}]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View> */}

                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      style={style.button}
                      onPress={this.handlePaymentMethod.bind(this, 'offline')}>
                      <View style={style.textContainer}>
                        <Text style={style.text}>Offline</Text>
                      </View>
                      <View style={style.iconContainerView}>
                        <Icon
                          name={'offline'}
                          width={64}
                          height={40}
                          style={style.icon}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ) : (
              <Card style={style.cardContainerPayment}>
                <View style={style.formContainerPayment}>
                  <Text
                    weight={'light'}
                    size={2}
                    color={Theme.base_color_10}
                    style={{marginBottom: 20, alignSelf: 'flex-start'}}>
                    {this.generateConfirmationMsg()}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {this.state.paymentMethod === 'offline' && (
                      <>
                        <TouchableOpacity
                          style={[style.button, {marginRight: 0}]}
                          onPress={this.openCamera.bind(this)}>
                          <View style={[style.textContainer, {marginLeft: 20}]}>
                            <Text style={[style.text, {fontSize: 18}]}>
                              {this.state.uploadText}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}

                    {/* <Icon
                      name={'open'}
                      width={25}
                      height={25}
                      fill={Theme.base_color_10}
                      style={[
                        {
                          alignSelf: 'center',
                          marginLeft: 15
                        },
                      ]}
                    /> */}
                  </View>
                  <Button
                    type={'secondary'}
                    label={'CONFIRM'}
                    disabled={
                      this.state.paymentMethod === 'offline'
                        ? this.state.confirmBtnDisable
                        : false
                    }
                    action={this.handleConfirmPayment.bind(this)}
                    style={{marginTop: 40, width: 400}}
                  />
                </View>
              </Card>
            )
          }
        />
      </>
    );
  }
}

export default Payment;
