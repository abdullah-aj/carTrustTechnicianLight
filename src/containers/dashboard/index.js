// @flow
import * as React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  Linking,
  //Alert,
} from 'react-native';
import style from './style';
import CardSelection from './cardSelection';
import {AppHeader} from '../../components/AppHeader';
import Util from '../../util';
import PageContainer from '../../components/PageContainer';
import Utility from '../../util';
import Animated from 'react-native-reanimated';
import Text from '../../components/Text';
import RouteConstants from '../../routes/constants';
import Theme from '../../App.style';
import Icon from '../../components/Icons';
import {connect} from 'react-redux';
import {getVersion} from 'react-native-device-info';
import Message from '../../components/Message';

type Props = {
  navigation: {
    push: any,
    navigate: () => void,
    openDrawer: () => void,
  },
  getUserDetails: Object,
  getUserBranch: Object,
};
const APP_VERSION = getVersion() + 'b';
const Dashboard = (props: Props) => {
  const [logs, setLogs] = React.useState(null);
  const headerImg = require('../../assets/artwork/dashboard_header.png');
  React.useEffect(() => {
    readBlue();
  }, [props.getUserDetails]);

  const readBlue = async () => {
    setLogs('Loading');
  };

  const onCardPressed = React.useCallback(async (type: string) => {
    switch (type) {
      case 'OngoingCPOS':
        props.navigation.push('OngoingCPOS');
        break;
      case 'onboarding':
        props.navigation.push('onboarding');
        break;
      case 'myBooking':
        props.navigation.push('myBooking');
        break;
      case 'alert':
        Message.alert('Info', 'Disabled by Admin');
        break;
      case 'qrScanner':
        props.navigation.push('qrScanner');
        break;
      case 'priceCalculator':
        props.navigation.push('priceCalculator');
        break;
      case 'completedCpo':
        props.navigation.push('completedCpo', {id: 102});
        break;
      default:
        Message.alert('Info', 'Disabled by Admin');
    }
    setLogs('Start Reading');
    const list = await Utility.Functions.GetBluetoothDevicesList();
    setLogs('Finished');
    setLogs(list);
  }, []);

  const stopReading = async () => {};

  const menu = () => {
    props.navigation.openDrawer();
  };

  const plug = () => {
    console.log('///plugg');
    props.navigation.push('OBD');
  };
  const icon = {
    height: 25,
    width: 25,
  };
  return (
    <View style={{flexDirection: 'row', height: '100%', width: '100%'}}>
      <Message />
      <View style={style.menu}>
        <View style={{marginLeft: 30, marginTop: 30}}>
          <Image
            source={require('../../assets/icons/logo_color_2.png')}
            style={{alignSelf: 'flex-start'}}
            resizeMode="contain"
          />
        </View>
        <View style={{paddingTop: 20, paddingLeft: 30, paddingBottom: 30}}>
          <Text size={1} style={{color: Theme.primary_color_3}}>
            Welcome
          </Text>
          {props.getUserDetails && (
            <>
              <Text size={2} style={{color: Theme.primary_color_2}}>
                {props.getUserDetails.first_name}{' '}
                {props.getUserDetails.last_name}
              </Text>
              <Text size={0.7} style={{color: Theme.primary_color_1}}>
                {props.getUserBranch.branch_name}
              </Text>
            </>
          )}
        </View>
        <View style={{justifyContent: 'flex-start', minHeight: 300}}>
          {/* <TouchableOpacity style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '70%',
              }}>
              <Icon
                name={'Profile'}
                width={icon.width}
                height={icon.height}
                fill={Theme.primary_color_1}
                style={style.iconStyle}
              />
              <Text
                weight={'regular'}
                size={2}
                underline={false}
                color={Theme.base_color_4}>
                Profile
              </Text>
            </View>
          </TouchableOpacity> */}
          {/* 
          <TouchableOpacity style={style.menuItemsContainer}>
            <View style={style.menuItemsView}>
              <Icon
                name={'language'}
                width={icon.width}
                height={icon.height}
                fill={Theme.primary_color_1}
                style={style.iconStyle}
              />
              <Text
                weight={'regular'}
                size={2}
                underline={false}
                color={Theme.base_color_4}>
                Language
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={style.menuItemsContainer}>
            <View style={style.menuItemsView}>
              <Icon
                name={'settings'}
                width={icon.width}
                height={icon.height}
                fill={Theme.primary_color_1}
                style={style.iconStyle}
              />
              <Text
                weight={'regular'}
                size={2}
                underline={false}
                color={Theme.base_color_4}>
                Settings
              </Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={style.menuItemsContainer}
            onPress={() => {
              Linking.openURL(`tel:0599529572`);
            }}>
            <View style={style.menuItemsView}>
              <Icon
                name={'support'}
                width={icon.width}
                height={icon.height}
                fill={Theme.primary_color_1}
                style={style.iconStyle}
              />
              <Text
                weight={'regular'}
                size={2}
                underline={false}
                color={Theme.base_color_4}>
                Support
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.menuItemsContainer}
            onPress={() => props.navigation.push('Logout')}>
            <View style={style.menuItemsView}>
              <Icon
                name={'logout'}
                width={icon.width}
                height={icon.height}
                fill={Theme.primary_color_1}
                style={style.iconStyle}
              />
              <Text
                weight={'regular'}
                size={2}
                underline={false}
                color={Theme.base_color_4}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.menuItemsContainer}
            onPress={() => {
              Linking.openURL('https://release.cartrust.sa');
            }}>
            <View style={style.menuItemsView}>
              <Icon
                name={'update'}
                width={icon.width}
                height={icon.height}
                fill={Theme.primary_color_1}
                style={style.iconStyle}
              />
              <Text
                weight={'regular'}
                size={2}
                underline={false}
                color={Theme.base_color_4}>
                Update
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={style.vIconContainer}>
          <Image
            source={require('../../assets/artwork/page_bg_artwork.png')}
            style={style.vIconImg}
            resizeMode="stretch"
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 1,
            paddingLeft: 15,
            backgroundColor: Theme.primary_color_2,
            width: '100%',
            paddingTop: 3,
            paddingBottom: 3,
          }}>
          <Text style={{color: Theme.base_color_10}}>
            Light Version: {APP_VERSION}
          </Text>
        </View>
      </View>

      <View style={{flex: 0.78}}>
        <AppHeader
          headerLogo={false}
          type={1}
          rightIcon={[
            {
              icon: 'notification_none',
              action: menu,
              fill: Theme.base_color_10,
              bg: Theme.base_color_10,
            },
            {
              icon: 'Search',
              action: menu,
              fill: Theme.base_color_10,
              bg: Theme.base_color_10,
            },
            // {icon: 'plug', action: plug, fill: Theme.primary_color_2, bg: Theme.base_color_10}
          ]}
          headerImg={true}
          headerImgPath={headerImg}
        />

        <PageContainer
          style={{
            padding: 0,
            marginTop: '-38%',
          }}>
          <ScrollView
            style={styles.SV}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            <View style={{padding: 16}}>
              <CardSelection
                title={'Add Customer'}
                subTitle={
                  'For new customers that are not registered in the system before, please use this.'
                }
                buttonText={'ONBOARD'}
                action={onCardPressed.bind(this, 'onboarding')}
              />
            </View>

            {/* <View style={{padding: 16}}>
              <CardSelection
                title={'Quick Start Inspection'}
                subTitle={
                  'For customers that are already registered in the system and would like to have inspection.'
                }
                buttonText={'SCAN QR'}
                action={onCardPressed.bind(this, 'qrScanner')}
              />
            </View> 

            <View style={{padding: 16}}>
              <CardSelection
                title={'Price Calculator'}
                subTitle={
                  'For those potential customers that would like to get an estimation for their vehicles.'
                }
                buttonText={'GET QUOTE '}
                action={onCardPressed.bind(this, 'priceCalculator')}
              />
            </View> */}

            <View style={{padding: 16}}>
              <CardSelection
                title={'My Work'}
                subTitle={
                  'Have an overview of booked appointments or create new ones.'
                }
                buttonText={'VIEW LIST'}
                action={onCardPressed.bind(this, 'myBooking')}
              />
            </View>

            <View style={{padding: 16}}>
              <CardSelection
                title={'On-going Work'}
                subTitle={
                  'To Continue an already Started or resume a Paused Inspection'
                }
                buttonText={'VIEW LIST'}
                action={onCardPressed.bind(this, 'OngoingCPOS')}
              />
            </View>

            <View style={{padding: 16}}>
              <CardSelection
                title={'Finished Cars'}
                subTitle={
                  'View completed Inspection and generate reports & warranty etc'
                }
                buttonText={'VIEW CARS'}
                action={onCardPressed.bind(this, 'completedCpo')}
              />
            </View>

            {/*
                       <View style={{padding: 16}}>
                            <CardSelection title={'OBD2 Test'}
                                           subTitle={'A small river named Due flows by their place and supplies it with the necessary regelialia.'}
                                           buttonText={'START'} action={onCardPressed.bind(this, 'odb')}/>

                        </View>

            */}
          </ScrollView>
        </PageContainer>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  SV: {
    marginHorizontal: 0,
    height: '100%',
    width: '100%',
    padding: 0,
  },
});

type ConnectProps = {
  mapStateToProps: any,
  mapDispatchToProps: any,
};

const mapStateToProps = (state) => {
  return {
    getUserDetails: state.UserDetails.userDetails,
    getUserBranch: state.UserDetails.userBranch,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default (connect<ConnectProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard): any);
