import React, {Component} from 'react';
import {
  // Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Alert,
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
import SelectField from '../../components/InputFields/SelectField';
import Icon from '../../components/Icons';
import Button from '../../components/Button';
import FooterLine from '../../components/footerLine';
import RNMlKit from 'react-native-firebase-mlkit';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator} from '../../components/ActivityIndicator';
import {Loader} from '../../components/Loader';
import AP from '../../api';
import SetUserDetails from '../../redux/actions/setUserDetails';
import {connect} from 'react-redux';
import Message from '../../components/Message';

type Props = {
  phone: string,
};

const PLATE_CHARACTERS = {
  A: 'ا',
  B: 'ب',
  J: 'ح',
  D: 'د',
  R: 'ر',
  S: 'س',
  X: 'ص',
  T: 'ط',
  E: 'ع',
  G: 'ق',
  K: 'ك',
  L: 'ل',
  Z: 'م',
  N: 'ن',
  H: 'هـ',
  U: 'و',
  V: 'ى',
};

const VEHICLE_COLOR = [
  'White',
  'Black',
  'Grey',
  'Silver',
  'Red',
  'Blue',
  'Brown',
  'Green',
  'Beige',
  'Orange',
  'Gold',
  'Yellow',
  'Purple',
  'Bronze',
];

const AR_NUMBERS = ['٠', '١', '	٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export class Onboarding5_vehicleInfoEnter extends Component {
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
    isLoading: false,
    showAddNewCustomerModal: false,
    showAddNewVehicleModal: false,
    setModalVisible: false,
    formValues: {},
    otpVisible: false,
    selectedColor: this.vehicleDetails.color
      ? VEHICLE_COLOR.find(
          (obj) =>
            obj.toLowerCase() === this.vehicleDetails.color.toLowerCase(),
        )
      : VEHICLE_COLOR[0],
    selectedEn1: Object.keys(PLATE_CHARACTERS)[0],
    selectedEn2: Object.keys(PLATE_CHARACTERS)[0],
    selectedEn3: Object.keys(PLATE_CHARACTERS)[0],
    showRegTip: false,
    mileage: this.vehicleDetails.mileage ? this.vehicleDetails.mileage : '',
    regNo: this.vehicleDetails.registration
      ? this.vehicleDetails.registration
      : '',
    plateNo: '',
  };

  componentDidMount() {
    console.log(
      'customer details:',
      this.customerDetails,
      'vehicle details:',
      this.vehicleDetails,
    );
    if (this.vehicleDetails.plate) {
      const numbers = /[0-9]/g;
      const alphabets = /[a-zA-Z]/g;
      const letters = this.vehicleDetails.plate.match(alphabets);
      const plateChar = Object.keys(PLATE_CHARACTERS);
      console.log(letters);
      if (letters) {
        this.setState({
          plateNo: this.vehicleDetails.plate.match(numbers).join(''),
          selectedEn1: plateChar.find((i) => i === letters[0]),
          selectedEn2: plateChar.find((i) => i === letters[1]),
          selectedEn3: plateChar.find((i) => i === letters[2]),
        });
      } else {
        this.setState({
          plateNo: this.vehicleDetails.plate.match(numbers).join(''),
        });
      }
    }
  }

  generatePlateENCharList = () => {
    const arr = [];
    let i = 0;
    for (let char in PLATE_CHARACTERS) {
      if (PLATE_CHARACTERS.hasOwnProperty(char)) {
        arr.push({
          id: char,
          name: char,
        });
        i++;
      }
    }
    return arr;
  };

  generateColorList = () => {
    const arr = VEHICLE_COLOR.map((color) => {
      return {
        id: color,
        name: color,
      };
    });
    return arr;
  };

  onSubmit = async (values) => {
    console.log(values);
    console.log('customer id is :>> ', this.customerDetails.id);
    console.log('vehicle details step 5 :>> ', this.props.route.params);
    console.log('Details :>>', this.vehicleDetails);

    const numAR = values.plateNo.split('').map((num) => AR_NUMBERS[num]);
    const plateEN = values.plateEN1 + values.plateEN2 + values.plateEN3;
    const plateAr =
      PLATE_CHARACTERS[values.plateEN3] +
      ' ' +
      PLATE_CHARACTERS[values.plateEN2] +
      ' ' +
      PLATE_CHARACTERS[values.plateEN1];

    const saveData = {
      vinNumber: this.vehicleDetails.vin,
      carMake: this.vehicleDetails.vehicleMake,
      carYear: this.vehicleDetails.vehicleYear,
      carType: this.vehicleDetails.vehicleType,
      carModel: this.vehicleDetails.vehicle,
      carPlateNo: plateAr + ' ' + numAR.join(''),
      carPlateNoEn: plateEN + '' + values.plateNo,
      carRegistration: values.regNo,
      technicianId: this.props.getUserDetails.id,
      customerId: this.customerDetails.id,
      carColor: values.color,
      carMileage: values.mileage,
    };
    const mode = this.props.route.params.mode;

    if (mode.action === 'updatePreCheck') {
      // VIN already Checked, Just save Data
      this.handleUpdateVehicle({
        ...saveData,
        id: this.vehicleDetails.id,
      });
    } else if (mode.action === 'update') {
      // Update After VIN Check
      try {
        const res = await AP.Calls.Vehicle.checkVinExist({
          vin: this.vehicleDetails.vin,
        });
        if (res.data.Error !== 'vin not found') {
          // VIN Found in DB
          if (res.data.vehicle.id !== this.vehicleDetails.id) {
            // vin matched vehicle has a different id
            Message.alert(
              'Error',
              'VIN Associated with another vehicle. Please contact Admin to Update.',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    this.props.navigation.push(mode.navigateTo, {
                      ...mode.params,
                    }),
                  type: 'yes',
                },
              ],
            );
          } else {
            // VIN belongs to same vehicle
            if (res.data.customer.id !== this.customerDetails.id) {
              // Offer to update Owner
              Message.alert(
                'Belongs to Different Customer',
                `VIN already associated with Vehicle of ${res.data.customer.first_name} ${res.data.customer.last_name}
  Do You want to Change Ownership of Vehicle?`,
                [
                  {
                    text: 'Cancel',
                    onPress: () =>
                      this.props.navigation.push(mode.navigateTo, {
                        ...mode.params,
                      }),
                    type: 'No',
                  },
                  {
                    text: 'Change Owner?',
                    onPress: async () => {
                      this.handleUpdateVehicle({
                        ...saveData,
                        id: this.vehicleDetails.id,
                      });
                    },
                    type: 'yes',
                  },
                ],
              );
            } else {
              // silent update
              if (this.isEmpty(this.vehicleDetails.id)) {
                Alert.alert('ERROR', 'Invalid action detected');
                return;
              }
              this.handleUpdateVehicle({
                ...saveData,
                id: this.vehicleDetails.id,
              });
            }
          }
        } else {
          // VIN number is available. can be associated
          this.handleUpdateVehicle({
            ...saveData,
            id: this.vehicleDetails.id,
          });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (mode.action === 'add') {
      console.log('Should be Addd');
      if (!this.isEmpty(this.vehicleDetails.id)) {
        Alert.alert('ERROR', 'Invalid Action Detected');
        return;
      }
      this.handleAddVehicle(saveData);
    } else {
      Alert.alert('ERROR', 'No Action Detected');
      return;
    }
  };

  handleUpdateVehicle = async (data) => {
    try {
      this.setState({isLoading: true});
      const response = await AP.Calls.Vehicle.UpdateVehicle(data);
      if (response) {
        this.setState({isLoading: false});
        Message.alert('Yay!', 'Vehicle has been Updated successfully.', [
          {
            text: 'Continue',
            onPress: () => {
              const mode = this.props.route.params.mode;
              this.props.navigation.push(mode.navigateTo, {
                ...mode.params,
              });
            },
            type: 'yes',
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleAddVehicle = async (data) => {
    try {
      this.setState({isLoading: true});
      const response = await AP.Calls.Vehicle.AddVehicle(data);
      if (response) {
        this.setState({isLoading: false});
        Message.alert('Yay!', 'Vehicle has been added successfully.', [
          {
            text: 'Continue',
            onPress: () => {
              const mode = this.props.route.params.mode;
              this.props.navigation.push(mode.navigateTo, {
                ...mode.params,
              });
            },
            type: 'yes',
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  isEmpty = (value) => {
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

  handleMileageChange = (value) => {
    console.log('+++++', value, '-----------');
    this.setState({
      mileage: value,
    });
  };

  handleColorChange = (value) => {
    this.setState({
      selectedColor: value,
    });
  };

  handleRegNoChange = (value) => {
    this.setState({
      regNo: value,
    });
  };

  handlePlateNoChange = (value) => {
    this.setState({
      plateNo: value,
    });
  };

  handleEn1Change = (value) => {
    this.setState({
      selectedEn1: value,
    });
  };

  handleEn2Change = (value) => {
    this.setState({
      selectedEn2: value,
    });
  };

  handleEn3Change = (value) => {
    this.setState({
      selectedEn3: value,
    });
  };

  render() {
    return (
      <>
        <Message />
        {this.state.CameraOn && (
          <View style={style.cameraContainer}>{this.renderCamera()}</View>
        )}
        <Loader visible={this.state.isLoading} message={'Working...'} />
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
                initialValues={{}}
                onSubmit={this.onSubmit}
                validateSchema={Utility.FormsValidations.vinIdentification}
                initialValues={{
                  mileage: this.state.mileage,
                  regNo: this.state.regNo,
                  plateNo: this.state.plateNo,
                  color: this.state.selectedColor,
                  plateEN1: this.state.selectedEn1,
                  plateEN2: this.state.selectedEn2,
                  plateEN3: this.state.selectedEn3,
                }}
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
                      <View
                        style={{
                          flex: 1,
                          width: '100%',
                          maxWidth: 500,
                          marginTop: 60,
                        }}>
                        <Field
                          name={'mileage'}
                          component={InputField}
                          placeholder={'Enter Current Mileage'}
                          style={{marginBottom: 10, width: '100%'}}
                          keyboardType={'number-pad'}
                          maxLength={8}
                          onEndEditing={this.handleMileageChange}
                        />

                        <Field
                          name={'color'}
                          component={SelectField}
                          key={'color'}
                          optionsList={this.generateColorList()}
                          style={{marginBottom: 10, width: '100%'}}
                          onChange={this.handleColorChange}
                        />
                        <View style={{flexDirection: 'row'}}>
                          <Field
                            name={'regNo'}
                            component={InputField}
                            placeholder={'Enter Vehicle Serial No.'}
                            keyboardType={'number-pad'}
                            style={{marginBottom: 10, width: '100%'}}
                            maxLength={9}
                            onEndEditing={this.handleRegNoChange}
                          />

                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                showRegTip: true,
                              });
                            }}
                            style={{
                              paddingLeft: 10,
                              height: 50,
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}>
                            <Icon
                              name={'info'}
                              width={20}
                              height={20}
                              fill={Theme.base_color_10}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Field
                            name={'plateNo'}
                            component={InputField}
                            placeholder={'Plate No.'}
                            style={{marginBottom: 10, width: '34%'}}
                            keyboardType={'number-pad'}
                            maxLength={4}
                            onEndEditing={this.handlePlateNoChange}
                          />
                          <Field
                            name={'plateEN1'}
                            component={SelectField}
                            key={'en1'}
                            optionsList={this.generatePlateENCharList()}
                            style={{marginBottom: 10, width: '21%'}}
                            onChange={this.handleEn1Change}
                          />
                          <Field
                            name={'plateEN2'}
                            component={SelectField}
                            key={'en2'}
                            optionsList={this.generatePlateENCharList()}
                            style={{marginBottom: 10, width: '21%'}}
                            onChange={this.handleEn2Change}
                          />
                          <Field
                            name={'plateEN3'}
                            component={SelectField}
                            key={'en3'}
                            optionsList={this.generatePlateENCharList()}
                            style={{marginBottom: 10, width: '21%'}}
                            onChange={this.handleEn3Change}
                          />
                        </View>

                        <Button
                          type={'secondary'}
                          label={'FINISH'}
                          disabled={isSubmitting}
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
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.showRegTip}>
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <View style={style.closeButton}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showRegTip: !this.state.showRegTip,
                    });
                  }}>
                  <Icon
                    name={'close'}
                    width={15}
                    height={15}
                    fill={Theme.base_color_5}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>
              <View style={[style.modalBodyRow, style.modalBodyPrompt]}>
                <Image
                  source={require('../../assets/artwork/reg_example.png')}
                  style={{height: 300, width: 500}}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </Modal>
        {/*{*/}

        {/*    this.state.setModalVisible && this.showOTP()*/}
        {/*    // this.state.setModalVisible && this.renderModal()*/}

        {/*}*/}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getUserDetails: state.UserDetails.userDetails,
  };
};

export default connect(mapStateToProps)(Onboarding5_vehicleInfoEnter);
