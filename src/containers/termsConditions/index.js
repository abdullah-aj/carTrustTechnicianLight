// @flow

import React, {useEffect, useState} from 'react';
import Card from '../../components/Card';
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
import Text from '../../components/Text';
import Button from '../../components/Button';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import FooterLine from '../../components/footerLine';
import PageBGArtwork from '../../components/PageBGArtwork';
import Icon from '../../components/Icons';
import Util from '../../util';
import {Loader} from '../../components/Loader';
import AP from '../../api';
import Layout from '../../components/Layout/FullPage';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';

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

const TermsConditions = (props: Props): any => {
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState('');
  const {height, width} = Dimensions.get('screen');

  useEffect(() => {
    loadTermsConditions();
  }, []);

  const loadTermsConditions: function = async () => {
    try {
      const response: any = await AP.Calls.Language.getTranslation({
        language: 'ar',
      });
      setIsLoading(false);
      if (response) {
        setTerms(response.data.language_label.terms_and_conditions);
      }
    } catch (e) {
      console.log('ERROR :>>', e);
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

  const handleAcceptTerms: function = () => {
    const {
      bookingId,
      customerId,
      vehicleId,
      amount,
      technicianId,
    } = props.route.params;

    props.navigation.push('signature', {
      bookingId,
      customerId,
      vehicleId,
      type: 1,
      amount,
      technicianId,
    });
  };

  const handleTermsSms: function = async () => {
    const {customerId} = props.route.params;
    
    setIsLoading(true);
    try {
      const response: any = await AP.Calls.Customer.sendTermsBySms({
        customer_id: customerId,
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
    } catch (e) {
      setIsLoading(false);
      ToastAndroid.showWithGravity(
        `ERROR Sending SMS, Please Check If your Mobile Number is in correct format`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      console.log('ERROR :>> ', e);
    }
  };

  return (
    <>
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
            headerText={'Terms & Conditions'}
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
            <View style={[style.container]}>
              <Text size={2} style={style.termsContent}>
                {terms}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 30,
                  marginTop: 10,
                  justifyContent: 'space-between',
                }}>
                <Button
                  label={'Decline'}
                  action={() => {}}
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
          </>
        }
      />
    </>
  );
};

const style: Object = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    margin: 0,
    justifyContent: 'flex-start',
    padding: 10,
    paddingLeft: 40,
    //flexWrap: 'wrap',
    // marginTop: Theme.page_margin_for_transparent_header,
    width: 850,
  },
  termsContent: {
    textAlign: 'justify',
    color: Theme.base_color_5,
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
)(TermsConditions): any);
