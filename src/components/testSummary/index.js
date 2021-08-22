import React from 'react';
import style from './style';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import Accordion from './accordion';
import {object} from 'yup';
import Text from '../Text';
import AP from '../../api';
import {Loader} from '../Loader';
import {AppHeader} from '../AppHeader';
import Theme from '../../App.style';
import PageBGArtwork from '../PageBGArtwork';
import Button from '../Button';

type Props = {
  navigation: {
    goBack: function,
    push: any,
    openDrawer: any,
  },
  data: Array<any>,
  bookingId: number,
};

type State = {
  isLoading: boolean,
  testData: array,
  bookingId: number,
  roadTested: boolean,
};

class TestSummary extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      bookingId: 0,
      roadTested: false,
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    if (this.props.route.params) {
      const {bookingId} = this.props.route.params;
      this.setState({bookingId: bookingId});
      this.callApi(bookingId);
    } else {
      console.log('No Booking Id');
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show(
      'Back Action is Disabled at this Stage',
      ToastAndroid.SHORT,
    );
    return true;
  }

  callApi = async (bookingId) => {
    this.setState({isLoading: true});
    const response = await AP.Calls.TestsCategories.getSummary({
      booking_id: bookingId,
    });
    if (response) {
      this.setState({roadTested: response.road_tested});
      const filteredStages = response.summary.filter(
        (obj) => obj.stage.name !== 'Road Test',
      );
      this.setState({isLoading: false, testData: filteredStages});
    }
  };

  Profile = () => {};

  handleMenu = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
        <Loader
          visible={this.state.isLoading}
          message={'Fetching Summary...'}
        />

        <AppHeader
          headerLogo={false}
          type={2}
          headerText={
            this.props.route.params.inspectionType + ' Inspection Summary'
          }
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
            action: this.handleMenu,
            fill: Theme.primary_color_2,
            bg: Theme.primary_color_2,
          }}
        />
        <View style={{flex: 1}}>
          <PageBGArtwork />
        </View>
        <ScrollView style={{width: '90%', alignSelf: 'center'}}>
          <Accordion
            testData={this.state.testData}
            bookingId={this.state.bookingId}
            inspectionType={this.props.route.params.inspectionType}
            roadTested={this.state.roadTested}
            {...this.props}
          />
        </ScrollView>
      </View>
    );
  }
}

export default TestSummary;
