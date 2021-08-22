import {StyleSheet} from 'react-native';
import Theme from '../../../App.style';

const style = StyleSheet.create({
  calendarHeaderContainerStyle: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 90,
    //marginBottom: -40
  },
  calendarHeaderStyle:{
    fontWeight: 'normal'
  },
  dateNumberStyle:{
    fontWeight: 'normal',
    color: Theme.base_color_2
  },
  disabledDateNumberStyle: {
    fontWeight: 'normal'
  },
  highlightDateContainerStyle: {
    backgroundColor: Theme.primary_color_3,
    borderRadius: Theme.card_border_radius
  },
  highlightDateNameStyle: {
    color: Theme.base_color_10,
    fontWeight: 'normal'
  },
  highlightDateNumberStyle: {
    color: Theme.base_color_10,
    fontWeight: 'normal'
  },
  dayContainerStyle: {
    borderRadius: Theme.card_border_radius,
    borderColor: '#eeeeee',
    borderWidth: 2
  },
  iconStyle: {
    height: 20
  },
  actionBtnRow: {
    paddingTop: 15,
    alignItems: 'center'
  },
  actionBtn: {
    width: 400
  }
});

export default style;
