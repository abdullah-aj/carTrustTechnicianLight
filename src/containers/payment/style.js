import {StyleSheet} from 'react-native';
import Theme from '../../App.style';

const style = StyleSheet.create({
  cardContainer: {
    minHeight: 290, // 400,
    width: '70%',
    backgroundColor: Theme.primary_color_2,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    marginBottom: 50,
    marginLeft: 90,
  },
  cardContainerPayment: {
    height: 300,
    width: '70%',
    backgroundColor: Theme.primary_color_2,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    marginBottom: '2%',
    marginLeft: 90,
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 500,
  },
  formContainerPayment: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 500,
  },
  iconContainerView: {
    width: '18%',
    height: '82%',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: Theme.base_color_10,
    marginRight: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 60,
    width: 400,
    borderRadius: 1,
  },
  textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 30,
  },
  text: {
    fontSize: 24,
    color: '#666666',
  },
  icon: {
    position: 'absolute',
    right: 25,
  },
  // ----- camera ----
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
    alignSelf: 'center',
    justifyContent: 'center',
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
