import {StyleSheet} from 'react-native';
import Theme from '../../App.style';

const style = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menu: {
    height: '100%',
    backgroundColor: Theme.base_color_10,
    flex: 0.22,
    shadowColor: Theme.base_color_9,
    shadowOffset: {
      width: 20,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 10,
  },
  menuItemsContainer: {
    height: 70
  },
  menuItemsView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  iconStyle: {
    marginRight: 15,
    marginLeft: 35,
  },
  vIconContainer: {
    height: 230,
    width: '100%',
   // marginTop: -10,
    overflow: 'hidden',
  },
  vIconImg: {
    height: '100%',
    width: 370,
    left: -20,
    transform: [{scaleX: -1}],
  },
});

export default style;
