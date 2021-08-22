import React, {Component} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
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
import CardSelection from '../dashboard/cardSelection';
import TestSummary from '../../components/testSummary';
import TableAccordion from '../../components/TableAccordion';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';

type Props = {
  phone: string,
};

const UNSELECTABLE = 'unselectable';
export default class Profile extends Component {
  id = this.props.route.params.id;

  state = {
    isDisabled: true,
    isLoading: false,
    modalVisible: false,
    profileData: {},
    vehicleData: [],
    selectedVehicle: null,
    disableCpoBtn: false,
    disableCpoReason: '',
    optionSelected: '',
    cpoType: '',
    bookingList: [],
    settings: {},
  };

  async componentDidMount() {
    console.log('//id in profile', this.id);
    this.setState({
      isLoading: true,
    });
    try {
      const response = await AP.Calls.Profile.getProfileDetails({
        customerId: this.id,
      });
      let vehicleDataMap = {};
      if (response) {
        await this.getSettings();
        await this.getBookingData();
        this.setState({
          isLoading: false,
          profileData: {
            fullName: response.fullName,
            lastName: response.last_name,
            email: response.email,
            mobile: response.mobile,
          },
          vehicleData: response.vehicleDetails,
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
      console.log(e);
    }
  }
  onSubmit = async (values) => {
    console.log('//valuess from vin', values.vinScanField);
    try {
      this.setState({
        isLoading: true,
      });
      const response = AP.Calls.VinNumber.SearchVinNumber({
        vinScanField: values.vinScanField,
      });
      this.setState({
        isLoading: false,
      });
      console.log('response from VIN is:', response);
    } catch (e) {}
  };
  handleOnChange = () => {};
  Profile = () => {};
  goBack = () => {
    this.props.navigation.goBack(null);
  };

  handleCardClick = () => {
    this.props.navigation.push('quotation', {
      customerId: this.id,
      vehicle: {
        id: this.state.selectedVehicle.id,
        manufacturer: this.state.selectedVehicle.make,
        model: this.state.selectedVehicle.model,
        year: this.state.selectedVehicle.year,
      },
    });
  };

  handleAddVehicle = () => {
    this.props.navigation.push('onboardingVehicle', {
      customerInfo: {
        firstName: this.state.profileData.fullName,
        id: this.id,
      },
    });
  };

  getBookingData = async () => {
    if (this.state.isLoading === false) {
      this.setState({
        isLoading: true,
      });
    }
    try {
      const booking = await AP.Calls.Booking.getCustomerBookingsList({
        customer_id: this.id,
      });
      if (booking.data && booking.data.values) {
        this.setState({
          bookingList: booking.data.values,
          isLoading: false,
        });
      }
    } catch (e) {
      console.log('ERROR:>> ', e);
    }
  };

  getSettings = async () => {
    if (this.state.isLoading === false) {
      this.setState({
        isLoading: true,
      });
    }

    try {
      const settings = await AP.Calls.Booking.getSettings();
      if (settings.success) {
        await this.setState({
          settings: settings.data,
        });
      }
    } catch (e) {
      console.log('ERROR:>> ', e);
    }
  };

  menu = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <>
        <Loader visible={this.state.isLoading} message={'Loading ...'} />
        <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
          <AppHeader
            type={2}
            headerText={'Customer Profile'}
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
              icon: 'menu',
              action: this.menu,
              fill: Theme.primary_color_2,
              bg: Theme.primary_color_2,
            }}
          />
          <View style={{flex: 1}}>
            <PageBGArtwork />
          </View>
          <ScrollView scrollEnabled={true}>
            <View
              style={{
                marginTop: Theme.page_margin_for_transparent_header,
                height: '100%',
              }}>
              <Card style={style.cardContainer}>
                <View style={style.iconTxtContainer}>
                  <Icon
                    name={'user_outline'}
                    fill={Theme.primary_color_2}
                    width={50}
                    height={50}
                    style={{marginRight: 10}}
                  />
                  <Text weight={'regular'} color={Theme.base_color_5} size={3}>
                    {this.state.profileData.fullName}
                  </Text>
                </View>
                <View style={style.iconTxtContainer}>
                  <Icon
                    name={'telephone'}
                    fill={Theme.primary_color_2}
                    width={36}
                    height={36}
                    style={{marginRight: 10}}
                  />
                  <Text weight={'regular'} color={Theme.base_color_5} size={3}>
                    {this.state.profileData.mobile}
                  </Text>
                </View>
                {this.state.profileData.email && (
                  <>
                    <View style={style.iconTxtContainer}>
                      <Icon
                        name={'mail'}
                        fill={Theme.primary_color_2}
                        width={40}
                        height={40}
                        style={{marginRight: 10}}
                      />
                      <Text
                        weight={'regular'}
                        color={Theme.base_color_5}
                        size={3}>
                        {this.state.profileData.email}
                      </Text>
                    </View>
                  </>
                )}
              </Card>

              <View style={style.vehicleSectionHeading}>
                <Text
                  weight={'bold'}
                  size={6}
                  color={Theme.primary_color_2}
                  underline={true}
                  style={{alignSelf: 'flex-start', marginBottom: 0}}>
                  Vehicles
                </Text>
              </View>

              {this.state.vehicleData && this.state.vehicleData.length > 0 && (
                <ScrollView
                  horizontal={true}
                  style={{
                    marginLeft: '3%',
                    width: '100%',
                    padding: 10,
                    height: 230,
                  }}
                  showsHorizontalScrollIndicator={false}>
                  {this.state.vehicleData.map((val, index) => {
                    return (
                      <CardSelection
                        key={index}
                        title={`${val.make} ${val.model}`}
                        subTitle={val.vin}
                        text={val.year}
                        buttonText={'START INSPECTION'}
                        cardsCount={3.4}
                        style={style.cardsStyle}
                        marginRight={12}
                        marginLeft={12}
                        marginTop={2}
                        action={() => {
                          this.setState({selectedVehicle: val}, () => {
                            this.handleCardClick();
                          });
                        }}
                      />
                    );
                  })}
                </ScrollView>
              )}
              <TouchableOpacity
                style={style.addNewBtnContainer}
                onPress={this.handleAddVehicle}>
                <Icon
                  name={'add'}
                  width={80}
                  height={80}
                  fill={Theme.primary_color_3}
                />
              </TouchableOpacity>

              <View style={style.vehicleSectionHeading}>
                <Text
                  weight={'bold'}
                  size={6}
                  color={Theme.primary_color_2}
                  underline={true}
                  style={{alignSelf: 'flex-start', marginBottom: 0}}>
                  Jobs associated with {this.state.profileData.fullName}
                </Text>
              </View>
              <View style={{width: '90%', alignSelf: 'center'}}>
                <TableAccordion
                  bookingData={this.state.bookingList}
                  navigation={this.props.navigation}
                  refreshData={this.getBookingData}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 650,
    height: 300,
  },
  modalBodyRow: {
    flex: 1,
    width: 650,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-evenly',
  },
  closeButton: {
    flex: 1,
    width: 650,
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 30,
    marginTop: -20,
  },
  cpoDetail: {
    marginTop: -50,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: Theme.primary_color_2,
    marginBottom: 15,
    borderRadius: 4,
    width: 400,
  },
});
