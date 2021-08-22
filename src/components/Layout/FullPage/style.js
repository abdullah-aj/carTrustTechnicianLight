import Theme from '../../../App.style';
import {StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');
const LEFT_MARGIN = 90;

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Theme.base_color_10,
  },
  sectionHead: {
    height: Theme.header_height,
    backgroundColor: Theme.base_color_10
  },
  pageArtCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 558,
    height: 370,
  },
  scroller: {
    // backgroundColor: 'pink',
  },
  contentTitle: {
    paddingLeft: LEFT_MARGIN,
    height: 62,
  },
  titleText: {
    fontFamily: 'Proxima-Nova-Alt-Bold',
    alignSelf: 'flex-start',
  },
  body: {
    //paddingBottom: Theme.header_height,
    // paddingRight: 5,
    height: '100%',
    width: '100%',
    // backgroundColor: 'dodgerblue',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
    height: 8,
  },
});

export default style;
