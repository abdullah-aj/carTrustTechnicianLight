// @flow
import * as React from 'react';
import {Component, useState} from 'react';
import {
  View,
  Image,
  LogBox,
  TouchableOpacity,
  Slider,
  ScrollView,
  Modal,
  //Alert,
} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import {Form} from '../../components/Form';
import FormBody from '../../components/FormBody';
import {Field} from 'formik';
import InputField from '../../components/InputFields/TextInputField';
import Button from '../../components/Button';
import AP from '../../api';
import Card from '../../components/Card';
import Icon from '../../components/Icons';
import {RNCamera} from 'react-native-camera';
import RNMlKit from 'react-native-firebase-mlkit';
import {ActivityIndicator} from '../../components/ActivityIndicator';
import Utility from '../../util';
import FooterLine from '../../components/footerLine';
import PageBGArtwork from '../../components/PageBGArtwork';
import {Loader} from '../../components/Loader';
import VinNumber from '../../api/vinNumber';
import Message from '../../components/Message';

type Props = {};

export default class Onboarding extends Component {
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
  };

  Profile = () => {};
  goBack = () => {
    this.props.navigation.goBack(null);
  };

  onSubmit = async (values) => {
    this.setState({formValues: values});

    if (values.mobile && values.mobile.length !== '') {
      this.setState({isDisabled: false, isLoading: true});

      try {
        const response = await AP.Calls.CustomerSearch.GetCustomer({
          mobile: `${values.mobile}`,
        });
        response;
        console.log('message from customer search is', response.data);

        //redirect to customer profile if it exists
        if (response.data && response.data.status != 0) {
          this.setState({isLoading: false});
          console.log(
            '///response.data in check customer with mobile:::>',
            response.data,
          );
          Message.alert(
            'Customer already exists.',
            'Would you like to view the profile now?',
            [
              {
                text: 'No',
                onPress: () => this.setState({isLoading: false}),
                type: 'no',
              },
              {
                text: 'Yes',
                onPress: () => {
                  this.props.navigation.push('profile', {
                    id: response.data.customer_id,
                  });
                },
                type: 'yes',
              },
            ],
          );
        }

        //add new customer if it doesn't exist
        else {
          Message.alert(
            'No Records Found',
            'Would you like to add a New Customer?',
            [
              {
                text: 'No',
                onPress: () => this.setState({isLoading: false}),
                type: 'no',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  await this.setState({isLoading: false});
                  //if (!this.state.isLoading) {
                  // this.props.navigation.push("OTP", {phoneValue:`${values.mobile}`})
                  this.props.navigation.push('onboardingCustomer', {
                    phoneValue: values.mobile,
                  });
                  //}
                },
                type: 'yes',
              },
            ],
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  // handleMobileFieldChange=(value)=>{
  //     console.warn("//handle changeeee------------", value)
  //     if(value.length>8){
  //         this.setState({isDisabled: false})
  //     }
  // }

  handleOtpSubmit = () => {};

  showOTP = () => {
    this.props.navigation.push('OTP');

    // return(
    //     <View style={{position:'absolute', width:'100%', height:'100%', alignSelf:'center'}}>
    //         {/*<OTP title={"OTP"} message={"Please enter the code here"} submitting={this.isLoading} animationStart={'bottom'} close={this.handleCloseOTP} onSubmit={this.handleOTPSubmit}/>*/}
    //         <Card style={style.cardContainer}>
    //             <OtpComp title={"Verification"} message={"Enter the code sent to the provided Mobile No. below"} onChange={this.handleMobileFieldChange} onSubmit={this.handleOtpSubmit}/>
    //         </Card>
    //     </View>
    // )
  };
  renderModal = () => {
    console.log('////OTPPP');
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          this.setState({setModalVisible: false});
        }}></Modal>
    );
  };

  handleOnChange = () => {
    this.setState({isDisabled: false});
  };

  handleCloseOTP = () => {
    this.setState({otpVisible: false});
  };

  handleOTPSubmit = () => {
    this.setState({isLoading: true});
    console.log('//otp submit values');
  };

  takePicture = async function () {
    // [
    //     {
    //         "blockCoordinates": {"height": 86, "left": 1472, "top": 927, "width": 153},
    //         "blockText": "diet",
    //         "elementText": "diet",
    //         "lineText": "diet",
    //         "resultText": "diet pepsi"},
    //
    //     {
    //         "blockCoordinates": {"height": 201, "left": 1442, "top": 969, "width": 476},
    //         "blockText": "pepsi",
    //         "elementText": "pepsi",
    //         "lineText": "pepsi",
    //         "resultText": "diet pepsi"}
    // ]

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

      this.setState({
        imageUri: data,
        CameraOn: !this.state.CameraOn,
        recognizedText:
          deviceTextRecognition !== null
            ? deviceTextRecognition[0].resultText
            : 'Not recognized',
        isDisabled: false,
        isLoading: false,
      });
      //console.warn('takePicture ', data, this.state.CameraOn);
    }
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
          <Loader visible={this.state.isLoading} message={'Working...'} />
        )}

        <View
          style={{
            flex: 0.5,
          }}></View>
        {/*<View*/}
        {/*    style={{*/}
        {/*        backgroundColor: 'transparent',*/}
        {/*        flexDirection: 'row',*/}
        {/*        justifyContent: 'space-around',*/}
        {/*    }}*/}
        {/*>*/}
        {/*    <TouchableOpacity onPress={this.toggle('canDetectText')} style={style.flipButton}>*/}
        {/*        <Text style={style.flipText}>*/}
        {/*            {!canDetectText ? 'Detect Text' : 'Detecting Text'}*/}
        {/*        </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*</View>*/}

        <View style={style.zoomButtons}>
          <TouchableOpacity onPress={this.zoomIn.bind(this)}>
            <Icon
              name={'add'}
              width={40}
              height={40}
              fill={Theme.base_color_7}
              style={style.captureIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.zoomOut.bind(this)}>
            <Icon
              name={'minus'}
              width={40}
              height={40}
              fill={Theme.base_color_7}
              style={style.captureIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={style.cameraIconContainer}>
          <TouchableOpacity onPress={this.closeCamera.bind(this)}>
            <Icon
              name={'close'}
              width={70}
              height={70}
              fill={Theme.base_color_10}
              style={style.captureIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.takePicture.bind(this)}>
            <Icon
              name={'tick'}
              width={82}
              height={82}
              fill={Theme.base_color_7}
              style={style.captureIcon}
            />
          </TouchableOpacity>
        </View>
        {!!canDetectText && this.renderTextBlocks()}
      </RNCamera>
    );
  }

  render() {
    return (
      <>
        <Message />
        {this.state.CameraOn && (
          <View style={style.cameraContainer}>{this.renderCamera()}</View>
        )}
        <Loader visible={this.state.isLoading} message={'Searching...'} />

        <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
          <AppHeader
            type={2}
            headerText={'New Customer'}
            headerLogo={false}
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
              {/*{*/}
              {/*    this.state.imageUri &&*/}
              {/*        <View style={{width: 500, height: 500, position:'absolute', zIndex:5}}>*/}
              {/*            <Text> {this.state.recognizedText}</Text>*/}
              {/*        </View>*/}
              {/*}*/}
              <Form
                initialValues={{
                  mobile: '',
                  vinScanField:
                    !this.state.CameraOn && this.state.recognizedText,
                }}
                validateSchema={Utility.FormsValidations.walkInCustomer}
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
                        Customer Lookup
                      </Text>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}
                        style={{marginTop: '4%'}}>
                        please enter the mobile number of the customer
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          width: '100%',
                          maxWidth: 500,
                          marginTop: 30,
                        }}>
                        <View>
                          <Field
                            name={'mobile'}
                            component={InputField}
                            placeholder={'Mobile No. (0xxxxxxxxx)'}
                            style={{marginBottom: 10}}
                            keyboardType={'phone-pad'}
                            maxLength={10}
                            onFocusOut={this.handleOnChange.bind(this)}
                          />
                        </View>
                        {/*<View style={style.hrContainer}>*/}
                        {/*    <Text style={{fontSize: 18, color:Theme.primary_color_3}}>OR</Text>*/}
                        {/*</View>*/}
                        <Button
                          label={'NEXT'}
                          disabled={isSubmitting || values.mobile.length < 10}
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
