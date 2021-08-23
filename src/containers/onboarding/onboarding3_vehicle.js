import React, {Component} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  //Alert,
  Dimensions,
} from 'react-native';
import style from './style';
import Theme from '../../App.style';
import {AppHeader} from '../../components/AppHeader';
import PageBGArtwork from '../../components/PageBGArtwork';
import Card from '../../components/Card';
import {Form} from '../../components/Form';
import Utility from '../../util';
import FormBody from '../../components/FormBody';
import Text from '../../components/Text';
import {Field} from 'formik';
import InputField from '../../components/InputFields/TextInputField';
import Icon from '../../components/Icons';
import Button from '../../components/Button';
import FooterLine from '../../components/footerLine';
import RNMlKit from 'react-native-firebase-mlkit';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator} from '../../components/ActivityIndicator';
import {Loader} from '../../components/Loader';
import AP from '../../api';
import Message from '../../components/Message';

type Props = {
  phone: string,
};

const {height, width} = Dimensions.get('screen');
export default class Onboarding3Vehicle extends Component {
  customerInfo = this.props.route.params.customerInfo;
  state = {
    canDetectText: false,
    textBlocks: [],
    CameraOn: false,
    imageUri: null,
    zoom: 0,
    autoFocus: 'on',
    recognizedText: '',
    isDisabled: true,
    isLoading: false,
    showAddNewCustomerModal: false,
    showAddNewVehicleModal: false,
    setModalVisible: false,
    formValues: {},
    otpVisible: false,
    torch: RNCamera.Constants.FlashMode.off,
  };

  componentDidMount() {
    console.log('values from params in step 3 :::>>', this.customerInfo);
  }

  onSubmit = async (values) => {
    console.log('//valuess from vin', values.vinScanField);
    this.setState({isLoading: true});

    let isUpdate = false;
    try {
      const res = await AP.Calls.Vehicle.checkVinExist({
        vin: values.vinScanField,
      });
      this.setState({isLoading: false});
      if (typeof res.data.Error === 'undefined') {
        // VIN Found in DB
        const propsData = {
          customerInfo: this.customerInfo,
          vehicleInfo: {
            vin: res.data.vehicle.vin,
            vehicleMake: res.data.vehicle.make,
            vehicleType: res.data.vehicle.type,
            vehicle: res.data.vehicle.model,
            vehicleYear: res.data.vehicle.year.toString(),
            plate: res.data.vehicle.plate_en,
            registration: res.data.vehicle.registration.toString(),
            mileage: res.data.vehicle.current_mileage.toString(),
            color: res.data.vehicle.color,
            id: res.data.vehicle.id,
          },
        };
        if (res.data.customer.id !== this.customerInfo.id) {
          // Offer to Change Owner
          Message.alert(
            'Belongs to Different Customer',
            `VIN already associated with Vehicle of ${res.data.customer.first_name} ${res.data.customer.last_name}
Do You want to Change Ownership of Vehicle?`,
            [
              {
                text: 'Cancel',
                onPress: () =>
                  this.props.navigation.push('profile', {
                    id: this.customerInfo.id,
                  }),
                type: 'No',
              },
              {
                text: 'Change Owner?',
                onPress: () => {
                  const data = {
                    ...propsData,
                    mode: {
                      action: 'updatePreCheck',
                      navigateTo: 'profile',
                      params: {
                        id: this.customerInfo.id,
                      },
                    },
                  };
                  this.props.navigation.push('onboardingVehicleInfo', data);
                },
                type: 'yes',
              },
            ],
          );
        } else {
          // Offer to Update Existing Vehicle
          await Message.alert(
            'Vehicle Already Exist',
            `Vehicle with VIN ${values.vinScanField} already exist, 
and associated with Current Customer ${res.data.customer.first_name} ${res.data.customer.last_name}. 
Do you Want to Update this Vehicle?`,
            [
              {
                text: 'Cancel',
                onPress: () =>
                  this.props.navigation.push('profile', {
                    id: this.customerInfo.id,
                  }),
                type: 'No',
              },
              {
                text: 'Update?',
                onPress: () => {
                  const data = {
                    ...propsData,
                    mode: {
                      action: 'updatePreCheck',
                      navigateTo: 'profile',
                      params: {
                        id: this.customerInfo.id,
                      },
                    },
                  };
                  this.props.navigation.push('onboardingVehicleInfo', data);
                },
                type: 'yes',
              },
            ],
          );
        }
      } else {
        // VIN Not Found
        try {
          const response = await AP.Calls.VinNumber.SearchVinNumber({
            vinScanField: values.vinScanField,
          });
          if (
            response.data &&
            response.data.vehicle &&
            response.data.vehicle.vin
          ) {
            // VIN API Responded with VIN Details
            console.log('customer id in step 3 is:::>', this.customerInfo.id);
            console.log('response from VIN is:', response.data.vehicle.vin);

            this.setState({isLoading: false});
            this.props.navigation.push('onboardingVehicleInfo', {
              customerInfo: this.customerInfo,
              vehicleInfo: {
                vin: response.data.vehicle.vin,
                vehicleMake: response.data.vehicle.make,
                vehicleType: response.data.vehicle.type,
                vehicle: response.data.vehicle.model,
                vehicleYear: response.data.vehicle.year.toString(),
              },
              mode: {
                action: 'add',
                navigateTo: 'profile',
                params: {
                  id: this.customerInfo.id,
                },
              },
            });
          } else {
            // VIN API Responded without VIN Details
            this.setState({isLoading: false});
            this.props.navigation.push('onboardingVehicleInfo', {
              customerInfo: this.customerInfo,
              vehicleInfo: {
                vin: values.vinScanField,
                vehicleMake: '',
                vehicleType: '',
                vehicle: '',
                vehicleYear: '',
              },
              mode: {
                action: 'add',
                navigateTo: 'profile',
                params: {
                  id: this.customerInfo.id,
                },
              },
            });
          }
        } catch (e) {
          // VIN API Error, but still continue
          console.log('Error :>> ', e);
          this.setState({isLoading: false});
          this.props.navigation.push('onboardingVehicleInfo', {
            customerInfo: this.customerInfo,
            vehicleInfo: {
              vin: values.vinScanField,
              vehicleMake: '',
              vehicleType: '',
              vehicle: '',
              vehicleYear: '',
            },
            mode: {
              action: 'add',
              navigateTo: 'profile',
              params: {
                id: this.customerInfo.id,
              },
            },
          });
          //Message.alert('Error', 'Server Error, Please try again');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleOnChange = () => {};
  Profile = () => {};
  goBack = () => {
    this.props.navigation.goBack(null);
  };

  //Camera stuff below
  takePicture = async function () {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        skipProcessing: true,
        forceUpOrientation: true,
      };
      const data = await this.camera.takePictureAsync();
      this.setState({isLoading: true});
      const deviceTextRecognition = await RNMlKit.deviceTextRecognition(
        data.uri,
      );
      // console.warn('Text Recognition On-Device', deviceTextRecognition[0].resultText);
      // console.warn('Text Recognition On-Device fullllllll', deviceTextRecognition);

      // replace O, I, Q with 0, 1, 9 if text detects any (by OCR error)
      // Reason: VIN can never have O,I,Q
      let finalText = '';
      if (deviceTextRecognition !== null) {
        finalText = deviceTextRecognition[0].resultText;

        finalText = this.replaceAll(finalText, 'o', '0');
        finalText = this.replaceAll(finalText, 'O', '0');

        finalText = this.replaceAll(finalText, 'i', '1');
        finalText = this.replaceAll(finalText, 'I', '1');

        finalText = this.replaceAll(finalText, 'q', '9');
        finalText = this.replaceAll(finalText, 'Q', '9');
      } else {
        finalText = 'Not recognized';
      }

      this.setState({
        imageUri: data,
        CameraOn: !this.state.CameraOn,
        recognizedText: finalText,
        isDisabled: false,
        isLoading: false,
      });
      //console.warn('takePicture ', data, this.state.CameraOn);
    }
  };

  replaceAll = (string, item, replacement) => {
    let str = string;
    if (str.indexOf(item) > -1) {
      str = str.replace(item, replacement);
      str = this.replaceAll(str, item, replacement);
    }
    return str;
  };

  closeCamera = () => {
    this.setState({CameraOn: !this.state.CameraOn});
  };

  handleTakePicturePress = () => {
    this.setState({
      CameraOn: !this.state.CameraOn,
    });
  };

  toggle = (value) => () =>
    this.setState((prevState) => ({[value]: !prevState[value]}));

  renderTextBlocks = () => (
    <View style={style.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({bounds, value}) => (
    <React.Fragment key={value + bounds.origin.x}>
      <Text
        style={[
          style.textBlock,
          {left: bounds.origin.x, top: bounds.origin.y},
        ]}>
        {value}
      </Text>
      <View
        style={[
          style.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      />
    </React.Fragment>
  );

  textRecognized = (object) => {
    const {textBlocks} = object;
    this.setState({textBlocks});
    console.log('...text blocks', textBlocks);
  };

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  renderCamera() {
    const {canDetectFaces, canDetectText, canDetectBarcode} = this.state;
    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        focusDepth={this.state.depth}
        trackingEnabled
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onTextRecognized={canDetectText ? this.textRecognized : null}
        googleVisionBarcodeType={
          RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL
        }
        googleVisionBarcodeMode={
          RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE
        }>
        {this.state.isLoading && (
          <View style={style.loadingOverlay}>
            <Loader visible={this.state.isLoading} message={'Reading...'} />
          </View>
        )}

        <View
          style={{
            alignSelf: 'center',
            height: 150,
            width: '100%',
            borderColor: 'green',
            borderWidth: 2,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            marginTop: (height - 180) / 2,
          }}></View>

        <View style={style.zoomButtons}>
          <TouchableOpacity onPress={this.zoomIn.bind(this)}>
            <Icon
              name={'add'}
              width={40}
              height={40}
              fill={Theme.base_color_7}
              style={[style.captureIcon]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.zoomOut.bind(this)}>
            <Icon
              name={'minus'}
              width={40}
              height={40}
              fill={Theme.base_color_7}
              style={[style.captureIcon, {marginTop: 50}]}
            />
          </TouchableOpacity>
        </View>
        <View style={style.cameraIconContainer}>
          <View style={style.cameraIconSubContainer}>
            <TouchableOpacity onPress={this.closeCamera.bind(this)}>
              <Icon
                name={'close'}
                width={30}
                height={30}
                fill={Theme.base_color_10}
                style={style.captureIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.takePicture.bind(this)}>
              <Icon
                name={'camera'}
                width={80}
                height={80}
                fill={Theme.base_color_7}
                style={style.captureIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleTorch.bind(this)}>
              <Icon
                name={
                  this.state.torch === RNCamera.Constants.FlashMode.off
                    ? 'flashOn'
                    : 'flashOff'
                }
                width={30}
                height={30}
                fill={Theme.base_color_7}
                style={style.captureIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {!!canDetectText && this.renderTextBlocks()}
      </RNCamera>
    );
  }

  toggleTorch() {
    let torch = this.state.torch;
    if (torch == RNCamera.Constants.FlashMode.off) {
      torch = RNCamera.Constants.FlashMode.torch;
    } else {
      torch = RNCamera.Constants.FlashMode.off;
    }
    this.setState({torch: torch});
  }

  render() {
    return (
      <>
        <Message />
        {this.state.CameraOn && (
          <View style={style.cameraContainer}>{this.renderCamera()}</View>
        )}
        <Loader visible={this.state.isLoading} message={'Reading...'} />

        <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
          <AppHeader
            headerLogo={false}
            type={2}
            headerText={'Customer Onboarding'}
            rightIcon={[
              {
                icon: 'Profile',
                action: this.Profile,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              },
              {
                icon: 'Search',
                action: this.Profile,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              },
            ]}
            leftIcon={{
              icon: 'backBtn',
              action: this.goBack,
              fill: Theme.primary_color_2,
              bg: Theme.base_color_10,
            }}
          />
          <View style={{flex: 1}}>
            <PageBGArtwork />
          </View>
          <ScrollView>
            <Card style={style.cardContainer}>
              <Form
                initialValues={{
                  vinScanField:
                    !this.state.CameraOn && this.state.recognizedText,
                }}
                validateSchema={Utility.FormsValidations.vinNumber}
                onSubmit={this.onSubmit}
                enableReinitialize={true}>
                {({handleSubmit, isSubmitting, values}) => (
                  <FormBody
                    handleKeyboard={true}
                    backgroundColor={'transparent'}>
                    <View style={style.formContainer}>
                      <Text
                        weight={'bold'}
                        size={6}
                        color={Theme.base_color_10}
                        style={{
                          fontFamily: 'Proxima-Nova-Alt-Bold',
                          alignSelf: 'flex-start',
                        }}
                        underline={true}>
                        VIN Identification
                      </Text>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}
                        style={{marginTop: '4%'}}>
                        Associate a Vehicle with the Customer:{' '}
                        {this.customerInfo.firstName}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          width: '100%',
                          minWidth: 500,
                          marginTop: 60,
                        }}>
                        <TouchableOpacity
                          onPress={this.handleTakePicturePress.bind(this)}>
                          <Field
                            name={'vinScanField'}
                            component={InputField}
                            placeholder={'Scan VIN No.'}
                            style={{marginBottom: 10, width: '100%'}}
                            maxLength={17}
                          />
                          <View style={style.iconContainerView}>
                            <Icon
                              name={'vinScan'}
                              width={20}
                              height={20}
                              fill={Theme.base_color_7}
                              style={[
                                style.lottieIcon,
                                {backgroundColor: Theme.base_color_10},
                              ]}
                            />
                          </View>
                        </TouchableOpacity>
                        <Button
                          type={'secondary'}
                          label={'NEXT'}
                          disabled={
                            isSubmitting ||
                            (values.vinScanField &&
                              values.vinScanField.length < 17)
                          }
                          action={handleSubmit}
                          style={{marginTop: 20}}
                        />
                      </View>
                    </View>
                  </FormBody>
                )}
              </Form>
            </Card>
          </ScrollView>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <FooterLine />
          </View>
        </View>
        {/*{*/}

        {/*    this.state.setModalVisible && this.showOTP()*/}
        {/*    // this.state.setModalVisible && this.renderModal()*/}

        {/*}*/}
      </>
    );
  }
}
