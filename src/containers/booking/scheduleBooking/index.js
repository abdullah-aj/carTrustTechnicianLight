// @flow
import * as React from 'react';
import {Text, View} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import TwoHalves from '../../../components/Layout/TwoHalves';
import {AppHeader} from '../../../components/AppHeader';
import Theme from '../../../App.style';
import moment from 'moment';
import style from './style';
import TimeSlot from './component/timeSlot';
import Button from '../../../components/Button';
import AP from '../../../api';
import {connect} from 'react-redux';
import SetUserDetails from '../../../redux/actions/setUserDetails';
import {Loader} from '../../../components/Loader';
import Message from '../../../components/Message';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  route: {
    params: any,
  },
  getUserDetails: Object,
};

type State = {
  userId: number,
  bookedSlots: Array<Object>,
  disabledDates: Array<Date>,
  selectedTime: string,
  selectedDate: string,
  loading: string,
  customerId: number,
  vehicleId: number,
  amount: number,
};

class Booking extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userId: this.props.getUserDetails.id,
      disabledDates: this.generateDisabledDates(),
      bookedSlots: [],
      selectedTime: '',
      selectedDate: moment().format('YYYY-MM-DD'),
      loading: 'Getting Available Schedules...',
      customerId: 0,
      vehicleId: 0,
      amount: 0,
    };
  }

  componentDidMount: function = () => {
    const {
      customerId,
      vehicleId,
      amount,
      serviceDetailType,
    } = this.props.route.params;
    this.setState({
      customerId: customerId,
      vehicleId: vehicleId,
      amount: amount,
      serviceDetailType: serviceDetailType,
    });
    this.getSchedule(this.state.selectedDate);
  };

  handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  handleGoBack: function = () => {
    this.props.navigation.goBack();
  };

  handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  handleDateSelection: function = async (date: Date) => {
    const newDate = moment(date).format('YYYY-MM-DD');
    this.setState({
      selectedDate: newDate,
      selectedTime: '',
      loading: 'Getting Available Schedules...',
    });
    await this.getSchedule(newDate);
  };

  handleTimeSelection: function = (time: string) => {
    this.setState({
      selectedTime: time,
    });
  };

  handleConfirmAction: function = async () => {
    this.setState({
      loading: 'Saving Schedule...',
    });
    const time = moment(this.state.selectedTime, 'HH:mm a');
    try {
      const parms = {
        agent_id: this.state.userId,
        customer_id: this.state.customerId,
        vehicle_id: this.state.vehicleId,
        appointment_date: this.state.selectedDate,
        appointment_from: time.format('HH:mm:ss'),
        appointment_to: moment(time).add(1, 'hours').format('HH:mm:ss'),
        type: 1,
      };
      if (this.state.serviceDetailType) {
        parms['months'] = this.state.serviceDetailType;
      }
      const response: any = await AP.Calls.Booking.addBookingSchedule(parms);

      if (response.success) {
        this.setState(
          {
            loading: '',
          },
          () => {
            this.props.navigation.push('TermsConditions', {
              technicianId: this.state.userId,
              bookingId: response.data.booking_id,
              customerId: this.state.customerId,
              vehicleId: this.state.vehicleId,
              amount: this.state.amount,
            });
          },
        );
      } else {
        console.log('Schedule Save Fail');
      }
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  generateDisabledDates: function = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      dates.push(moment().subtract(i, 'days'));
    }
    return dates;
  };

  getDefaultSlotValues: function = () => {
    return [
      // {'8:00am': true},
      // {'9:00am': true},
      // {'10:00am': true},
      // {'11:00am': true},
      // {'1:00pm': true},
      // {'2:00pm': true},
      // {'3:00pm': true},
      // {'4:00pm': true},
      // {'5:00pm': true},
      // {'6:00pm': true},
      // {'7:00pm': true},
      // {'8:00pm': true},
    ];
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

  getSchedule: function = async (date) => {
    try {
      const response: any = await AP.Calls.Booking.getBookingSchedule({
        technicianId: this.state.userId,
        date: date,
      });

      if (this.isEmpty(response)) {
        Message.alert(
          'Not Available',
          'Problem with Schedule, Please contact Admin',
        );
        this.setState({
          bookedSlots: [],
          loading: '',
        });
        return;
      } else if (Array.isArray(response) && response.length === 0) {
        Message.alert(
          'Not Available',
          `No Availability on Selected Date: ${date}`,
        );
      }
      this.setState({
        bookedSlots: response,
        loading: '',
      });
    } catch (e) {
      console.log('Error', e);
    }
  };

  render(): React.Node {
    return (
      <>
        <Loader
          visible={this.state.loading !== ''}
          message={this.state.loading}
        />
        <TwoHalves
          artType={'calendar'}
          title={'Calendar'}
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Booking Appointment'}
              rightIcon={[
                {
                  icon: 'Profile',
                  action: this.handleProfileClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
                {
                  icon: 'Search',
                  action: this.handleSearchClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
              ]}
              leftIcon={{
                icon: 'backBtn',
                action: this.handleGoBack,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              }}
            />
          }
          sectionBody={
            <View>
              <CalendarStrip
                minDate={moment().subtract(6, 'days')}
                selectedDate={moment()}
                datesBlacklist={this.state.disabledDates}
                onDateSelected={this.handleDateSelection.bind(this)}
                calendarHeaderFormat={'MMMM, YYYY'}
                style={{height: 150, marginTop: -10, marginBottom: -10}}
                calendarColor={Theme.base_color_10}
                calendarHeaderStyle={{color: Theme.base_color_2}}
                dateNumberStyle={{color: Theme.base_color_2}}
                dateNameStyle={{color: Theme.base_color_2}}
                iconContainer={{flex: 0.12}}
                calendarHeaderContainerStyle={
                  style.calendarHeaderContainerStyle
                }
                calendarHeaderStyle={style.calendarHeaderStyle}
                dateNumberStyle={style.dateNumberStyle}
                disabledDateNumberStyle={style.disabledDateNumberStyle}
                highlightDateContainerStyle={style.highlightDateContainerStyle}
                highlightDateNameStyle={style.highlightDateNameStyle}
                highlightDateNumberStyle={style.highlightDateNumberStyle}
                dayContainerStyle={style.dayContainerStyle}
                iconStyle={style.iconStyle}
                calendarAnimation={{type: 'parallel', duration: 800}} // sequence, parallel
              />
              <TimeSlot
                timeSlots={this.state.bookedSlots}
                selected={this.state.selectedTime}
                onSelection={this.handleTimeSelection.bind(this)}
              />
              <View style={style.actionBtnRow}>
                <Button
                  label={'CONFIRM'}
                  type={'primary'}
                  style={style.actionBtn}
                  action={this.handleConfirmAction}
                  disabled={this.state.selectedTime === ''}
                />
              </View>
            </View>
          }
        />
      </>
    );
  }
}

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
)(Booking): any);
