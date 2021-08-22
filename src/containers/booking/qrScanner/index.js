// @flow

import React, {useEffect, useState} from 'react';
import Card from '../../../components/Card';
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Text from '../../../components/Text';
import {AppHeader} from '../../../components/AppHeader';
import Theme from '../../../App.style';
import style from './style';
import FooterLine from '../../../components/footerLine';
import PageBGArtwork from '../../../components/PageBGArtwork';
import Layout from '../../../components/Layout/FullPage';

import Icon from '../../../components/Icons';
import Util from '../../../util';
import {Loader} from '../../../components/Loader';
import AP from '../../../api';
import QrCodeScanner from '../../../components/QrCodeScanner';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  style?: any,
  onPress: () => void,
  data: Array<any>,
};

const QrScanner = (props: Props): any => {
  useEffect(() => {}, []);
  const handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  const handleGoBack: function = () => {
    props.navigation.goBack();
  };

  const handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  const {height, width} = Dimensions.get('window');

  return (
    <>
      <View style={{height, width}}>
        <QrCodeScanner
          description={
            'Scanning QR Code will immediately take you the test for specific Customer'
          }
          torch={true}
          handleProfileClick={handleProfileClick}
          handleSearchClick={handleSearchClick}
          handleGoBack={handleGoBack}
          landingTitle={'Scan QR Code to Start Test'}
          resultTitle={'Result'}
          {...props}
        />
      </View>
    </>
  );
};

export default QrScanner;
