import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
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
import SelectField from '../../components/InputFields/SelectField';

type Props = {
  phone: string,
};
export default class Onboarding4_vehicleInfoRetrieved extends Component {
  customerDetails = this.props.route.params.customerInfo;
  vehicleDetails = this.props.route.params.vehicleInfo;
  bookingInfo = this.props.route.params.bookingInfo
    ? this.props.route.params.bookingInfo
    : false;

  state = {
    canDetectText: false,
    textBlocks: [],
    CameraOn: false,
    imageUri: null,
    zoom: 0,
    autoFocus: 'on',
    recognizedText: '',
    isDisabled: true,
    isLoading: true,
    showAddNewCustomerModal: false,
    showAddNewVehicleModal: false,
    setModalVisible: false,
    formValues: {},
    otpVisible: false,
    manufacturerList: [],
    manufacturerSelected: '',
    vehicleTypeList: [],
    vehicleTypeSelected: '',
    modelList: [],
    modelSelected: '',
    yearList: [],
    yearSelected: '',
    vinScanField: this.vehicleDetails.vin,
  };
  componentDidMount = async () => {
    try {
      await this.generateManufacturerList();
      await this.generateVehicleTypeList();
      await this.generateYearList();

      const manufacturerId = await this.getManufacturerIdFromName(
        this.vehicleDetails.vehicleMake,
      );

      const vehicleTypeId = await this.getVehicleTypeIdFromName(
        this.vehicleDetails.vehicleType,
      );

      const yearId = await this.getYearIdFromName(
        this.vehicleDetails.vehicleYear,
      );

      if (!yearId) {
        console.log(`Year ${this.vehicleDetails.vehicleYear} Not Found in DB`);
      }

      if (manufacturerId) {
        await this.generateModelList(manufacturerId.id);
        const modelId = await this.getModelIdFromName(
          this.vehicleDetails.vehicle,
        );
        if (modelId) {
        } else {
          console.log(`Model ${this.vehicleDetails.vehicle} Not Found in DB`);
        }

        this.setState({
          manufacturerSelected: manufacturerId.id,
          vehicleTypeSelected: vehicleTypeId ? vehicleTypeId.id : '',
          modelSelected: modelId ? modelId.id : '',
          yearSelected: yearId ? yearId.id : '',
          isLoading: false,
        });
      } else {
        console.log(
          `Manufacturer ${this.vehicleDetails.vehicleMake} Not Found in DB`,
        );
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      console.log('ERROR :>>', e);
    }
  };

  onSubmit = async (values) => {
    console.log(values);
    try {
      const make = this.state.manufacturerList.find(
        (item) => item.id === values.make,
      );
      const type = this.state.vehicleTypeList.find(
        (item) => item.id === values.type,
      );
      const model = this.state.modelList.find(
        (item) => item.id === values.model,
      );
      const year = this.state.yearList.find(
        (item) => item.id === values.yearMake,
      );

      console.log('=>>>>>>>>>>>>>>>>>>>>>>>', this.vehicleDetails);

      this.props.navigation.push('onboardingVehicleInfoEnter', {
        vehicleInfo: {
          vin: values.vinScanField,
          vehicleMake: make.name,
          vehicleType: type.name,
          vehicle: model.name,
          vehicleYear: year.name.toString(),
          id: this.vehicleDetails.id ? this.vehicleDetails.id : '',
          color: this.vehicleDetails.color ? this.vehicleDetails.color : '',
          mileage: this.vehicleDetails.mileage
            ? this.vehicleDetails.mileage.toString()
            : '',
          plate: this.vehicleDetails.plate ? this.vehicleDetails.plate : '',
          registration: this.vehicleDetails.registration
            ? this.vehicleDetails.registration.toString()
            : '',
        },
        customerInfo: this.customerDetails,
        bookingInfo: this.bookingInfo ? this.bookingInfo : false,
      });
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
          <View style={style.loadingOverlay}>
            <Loader visible={this.state.isLoading} message={'Reading...'} />
          </View>
        )}

        <View
          style={{
            flex: 0.5,
          }}></View>
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
              fill={Theme.base_color_7}
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

  //-----
  generateManufacturerList = async () => {
    try {
      const res: any = await AP.Calls.Quotation.getManufacturers({});
      if (res.length) {
        this.setState({
          manufacturerList: res,
        });
      }
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  getManufacturerIdFromName = async (name) => {
    return this.state.manufacturerList.find((obj) => {
      if (name) {
        const value1 =
          typeof obj.name === 'string' ? obj.name.toUpperCase() : obj.name;
        const value2 = typeof name === 'string' ? name.toUpperCase() : name;
        return value1 === value2;
      }
    });
  };

  handleManufacturerChange = async (value) => {
    await this.setState({
      manufacturerSelected: value,
      isLoading: true,
    });
    await this.generateModelList(value);
    await this.setState({
      isLoading: false,
    });
  };
  //-------

  generateVehicleTypeList = async () => {
    try {
      const res: any = await AP.Calls.Quotation.getVehicleTypes({});
      if (res.length) {
        let formattedArr = res.filter(
          (obj) =>
            obj.vehicle_category !== null &&
            obj.vehicle_category !== '' &&
            obj.vehicle_category !== undefined &&
            typeof obj.vehicle_category !== undefined,
        );
        formattedArr = formattedArr.map((arr) => {
          if (arr.vehicle_category) {
            return {
              id: arr.id,
              name: arr.vehicle_category,
            };
          } else {
            return;
          }
        });
        console.log(formattedArr);
        this.setState({
          vehicleTypeList: formattedArr,
        });
      }
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  getVehicleTypeIdFromName = async (name) => {
    return this.state.vehicleTypeList.find((obj) => {
      if (name) {
        const value1 =
          typeof obj.name === 'string' ? obj.name.toUpperCase() : obj.name;
        const value2 = typeof name === 'string' ? name.toUpperCase() : name;
        return value1 === value2;
      }
    });
  };

  handleVehicleTypeChange = (value) => {
    this.setState({
      vehicleTypeSelected: value,
    });
  };

  //----------

  generateModelList = async (manufacturerId) => {
    try {
      if (manufacturerId > 0) {
        const res: any = await AP.Calls.Quotation.getModels({
          manufacturerId: manufacturerId,
        });
        if (res.length) {
          this.setState({
            modelList: res,
          });
        }
      } else {
        this.setState({
          modelList: [],
        });
      }
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  getModelIdFromName = async (name) => {
    return this.state.modelList.find((obj) => {
      if (name) {
        const value1 =
          typeof obj.name === 'string' ? obj.name.toUpperCase() : obj.name;
        const value2 = typeof name === 'string' ? name.toUpperCase() : name;
        return value1 === value2;
      }
    });
  };

  handleModelChange = async (value) => {
    await this.setState({
      modelSelected: value,
    });
  };

  //----------

  generateYearList = async () => {
    try {
      const res: any = await AP.Calls.Quotation.getYears();
      if (res.length) {
        this.setState({
          yearList: res,
        });
      }
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  getYearIdFromName = async (name) => {
    return this.state.yearList.find((obj) => {
      if (name) {
        const value1 =
          typeof obj.name === 'string' ? obj.name.toUpperCase() : obj.name;
        const value2 = typeof name === 'string' ? name.toUpperCase() : name;
        return value1 === value2;
      }
    });
  };

  handleYearChange = (value) => {
    this.setState({
      yearSelected: value,
    });
  };

  render() {
    return (
      <>
        {this.state.CameraOn && (
          <View style={style.cameraContainer}>{this.renderCamera()}</View>
        )}
        <Loader visible={this.state.isLoading} message={'Reading...'} />

        <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
          <AppHeader
            type={2}
            headerText={'Customer Onboarding'}
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
              <Form
                validateSchema={Utility.FormsValidations.vehicleInformation}
                initialValues={{
                  vinScanField: this.state.vinScanField,
                  make: this.state.manufacturerSelected,
                  type: this.state.vehicleTypeSelected,
                  model: this.state.modelSelected,
                  yearMake: this.state.yearSelected,
                }}
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
                        {this.customerDetails.firstName}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          width: '100%',
                          maxWidth: 500,
                          marginTop: 60,
                        }}>
                        <Field
                          name={'vinScanField'}
                          component={InputField}
                          placeholder={'Vin No.'}
                          style={{marginBottom: 10, width: '100%'}}
                          maxLength={17}
                          disabled={
                            this.vehicleDetails.vin !== '' &&
                            this.vehicleDetails.vin !== null &&
                            this.vehicleDetails.vin !== undefined
                          }
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Field
                            name={'make'}
                            component={SelectField}
                            key={'make'}
                            defaultText={'Select Make'}
                            optionsList={this.state.manufacturerList}
                            style={{marginBottom: 10, width: '49%'}}
                            onChange={this.handleManufacturerChange}
                            disabled={
                              this.state.manufacturerSelected !== '' &&
                              this.bookingInfo &&
                              this.bookingInfo.status !== 'Awaiting_Payment'
                            }
                          />
                          <Field
                            name={'type'}
                            component={SelectField}
                            key={'type'}
                            defaultText={'Select Type'}
                            optionsList={this.state.vehicleTypeList}
                            style={{marginBottom: 10, width: '49%'}}
                            onChange={this.handleVehicleTypeChange}
                            disabled={false}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Field
                            name={'model'}
                            component={SelectField}
                            key={'model'}
                            defaultText={'Select Model'}
                            optionsList={this.state.modelList}
                            style={{marginBottom: 10, width: '49%'}}
                            onChange={this.handleModelChange}
                            disabled={
                              this.state.modelSelected !== '' &&
                              this.bookingInfo &&
                              this.bookingInfo.status !== 'Awaiting_Payment'
                            }
                          />
                          <Field
                            name={'yearMake'}
                            component={SelectField}
                            key={'yearMake'}
                            defaultText={'Select Make Year'}
                            optionsList={this.state.yearList}
                            style={{marginBottom: 10, width: '49%'}}
                            onChange={this.handleYearChange}
                            disabled={
                              this.state.yearSelected !== '' &&
                              this.bookingInfo &&
                              this.bookingInfo.status !== 'Awaiting_Payment'
                            }
                          />
                        </View>

                        <Button
                          type={'secondary'}
                          label={'CONFIRM INFORMATION'}
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
