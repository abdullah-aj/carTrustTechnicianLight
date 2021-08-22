import {StyleSheet} from 'react-native';
import Theme from '../../App.style';

const style = StyleSheet.create({
  zoomButtons: {
    position: 'absolute',
    marginTop: '5%',
    right: 10,
    //width: '100%',
    //height: '100%',
    // alignSelf: 'center',
    // justifyContent: 'flex-start',
    // flexDirection: 'row',
  },
  captureIcon: {
    marginRight: '5%',
    zIndex: 4,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  cameraIconSubContainer: {
    flexDirection: 'row',
    //alignSelf: 'flex-end',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default style;
