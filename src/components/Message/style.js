import {StyleSheet} from 'react-native';
import Theme from '../../App.style';

const RADIUS = 5;
const WIDTH = 600;
const PADDING_LEFT = 63;
const PADDING_RIGHT = 63;

const style = StyleSheet.create({
  dimBackground: {
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
  },
  modalBody: {
    width: WIDTH,
    minHeight: 250,
    borderRadius: RADIUS,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Theme.base_color_10,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    width: WIDTH,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 0,
  },
  titleSec: {
    flexDirection: 'row',
  },
  titleTextBlock: {
    paddingLeft: 50,
  },
  titleText: {
    fontWeight: 'bold',
    color: Theme.primary_color_2,
  },
  closeSec: {
    width: 30,
  },
  contentRow: {
    width: WIDTH,
    minHeight: 100,
    paddingLeft: PADDING_LEFT,
    paddingRight: PADDING_RIGHT,
  },
  contentText: {
    color: Theme.base_color_5,
    textAlign: 'justify',
  },
  buttonRow: {
    height: 80,
    width: WIDTH,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: PADDING_LEFT,
    paddingRight: PADDING_RIGHT,
  },
  buttonYes: {
    backgroundColor: Theme.primary_color_1,
    borderColor: Theme.primary_color_1,
    color: Theme.base_color_10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonNo: {
    backgroundColor: Theme.base_color_10,
    borderColor: Theme.primary_color_1,
    color: Theme.primary_color_1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  oneButtonStyle: {
    width: WIDTH - PADDING_LEFT - PADDING_RIGHT,
  },
  twoButtonStyle: {
    width: 180,
  },
  threeButtonStyle: {
    width: 130,
  },
});

export default style;
