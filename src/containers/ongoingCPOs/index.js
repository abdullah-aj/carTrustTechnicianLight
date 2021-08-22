// @flow

import React, {useEffect, useState} from 'react';
import Card from '../../components/Card';
import {Image, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import style from './style';
import FooterLine from '../../components/footerLine';
import PageBGArtwork from '../../components/PageBGArtwork';
import Icon from '../../components/Icons';
import Util from '../../util';
import {Loader} from '../../components/Loader';
import AP from '../../api';
import {connect} from 'react-redux';
import moment from 'moment';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  style?: any,
  onPress: () => void,
  data: Array<any>,
  getUserDetails: {
    id: number,
  },
};

const tempDataForOngoingCPOS = [
  {
    carName: 'ddasd',
    questionsCompleted: 50,
    totalQuestions: 144,
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
  {
    carName: 'Camry',
    questionsCompleted: 20,
    totalQuestions: 144,
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
  {
    carName: 'Camry',
    questionsCompleted: 100,
    totalQuestions: 144,
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
  {
    carName: 'Camry',
    questionsCompleted: 70,
    totalQuestions: 144,
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
  {
    carName: 'Camry',
    questionsCompleted: 10,
    totalQuestions: 144,
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
  {
    carName: 'Camry',
    questionsCompleted: 141,
    totalQuestions: 144,
    vin: '54215DF7845GGT',
    year: '2017',
    date: '12-06-2021',
  },
];

const {width} = Dimensions.get('screen');

const OngoingCPOS = (props: Props): any => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBookingList();
  }, []);

  const FROM_DATE = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const TO_DATE = moment().format('YYYY-MM-DD');
  const STATUS = ['Started', 'Paused', 'Resumed', 'visually_inspected'];

  const getBookingList: function = async () => {
    try {
      const res: any = await AP.Calls.Booking.getBookingsList({
        technician_id: props.getUserDetails.id,
        //fromdate: FROM_DATE,
        //todate: TO_DATE,
        status: STATUS,
      });

      const bookingData = [];
      res.map((obj, i) => {
        bookingData.push({
          bookingId: obj.booking_id,
          customerName: obj.customer.first_name + ' ' + obj.customer.last_name,
          customerPhone: obj.customer.phone,
          carManufacturer: obj.vehicle.make,
          carMake: obj.vehicle.model,
          CarYear: obj.vehicle.year,
          carVin: obj.vehicle.vin,
          plate: obj.vehicle.plate,
          appointmentTime: obj.appointment_from,
          appointmentDate: obj.appointment_date,
          bookingRef: obj.booking_refrence,
        });
      });
      setData(bookingData);
      setIsLoading(false);
      console.log('=======Booking List Response=======', bookingData);
    } catch (e) {
      console.log('=======Booking List get Error======', e);
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

  const handleCardClick: function = (bookingId) => {
    props.navigation.push('confirmation', {
      bookingId: bookingId,
    });
  };

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const deviceDimensions = Util.Functions.GetDeviceDimensions();

  const trimText: function = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length - 3) + '...';
    } else {
      return text;
    }
  };

  return (
    <>
      <Loader visible={isLoading} message={'Fetching Bookings...'} />
      <AppHeader
        type={2}
        headerLogo={false}
        headerImg={false}
        headerImgPath={''}
        headerText={'On-Going Bookings'}
        rightIcon={
          [
            // {
            //   icon: 'Profile',
            //   action: handleProfileClick,
            //   fill: Theme.primary_color_2,
            //   bg: Theme.base_color_10,
            // },
            // {
            //   icon: 'Search',
            //   action: handleSearchClick,
            //   fill: Theme.primary_color_2,
            //   bg: Theme.base_color_10,
            // },
          ]
        }
        leftIcon={{
          icon: 'backBtn',
          action: handleGoBack,
          fill: Theme.primary_color_2,
          bg: Theme.base_color_10,
        }}
      />
      <View style={{}}>
        {/* <PageBGArtwork type={'thin'} /> */}
        <PageBGArtwork type={'thick'} />
      </View>

      <ScrollView scrollEnabled={true}>
        <View style={[style.mainContainer, {width: width}]}>
          {data.length > 0 ? (
            data.map((obj) => {
              //(data ? data : tempData).map((obj) => {
              return (
                <>
                  <Card
                    onPress={handleCardClick.bind(this, obj.bookingId)}
                    style={{
                      width: (width - 100) / 3,
                      padding: 5,
                      margin: 10,
                    }}>
                    <View style={style.topContainer}>
                      <View>
                        <Text
                          weight={'regular'}
                          underline={true}
                          color={Theme.primary_color_2}
                          style={style.headingText}>
                          {trimText(obj.customerName, 18)}
                        </Text>
                        <Text style={style.subText}>
                          {obj.carManufacturer} {obj.carMake} - {obj.CarYear}
                        </Text>
                        <Text style={style.subText}>
                          {obj.carVin ? obj.carVin : '- - - - - - - - - - -'}
                        </Text>
                        <Text style={style.subText}>
                          {obj.plate ? obj.plate : '- - -  - - -'}
                        </Text>
                        <Text style={style.subText}>{obj.bookingRef}</Text>
                      </View>

                      <Text style={style.subText}>
                        <Icon
                          name={'Profile'}
                          width={15}
                          height={15}
                          fill={'red'}
                          style={{}}></Icon>
                        &nbsp;
                        {obj.customerPhone}
                      </Text>
                    </View>

                    <View style={style.bottomContainer}>
                      <Text style={style.subTextSmall}>
                        {obj.appointmentDate}
                      </Text>
                      <Text style={style.subTextSmall}>
                        {obj.appointmentTime}
                      </Text>
                    </View>
                  </Card>
                </>
              );
            })
          ) : (
            <>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingTop: '25%',
                  // paddingLeft: 68,
                  // paddingTop: 20
                }}>
                <Text size={3} style={{color: Theme.base_color_5}}>
                  - No On-Going Bookings Found -
                </Text>
              </View>
            </>
          )}
          {/*  */}
        </View>
      </ScrollView>

      <View style={style.footer}>
        <FooterLine />
      </View>

      {/* <View style={styles.mainContainer}>
        <CardsWithProgress data={tempDataForOngoingCPOS} />
      </View> */}
    </>
  );
};

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
)(OngoingCPOS): any);