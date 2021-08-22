// @flow
import Theme from '../../App.style';
import {StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

const style: Object = StyleSheet.create({
  scrollViewStyle: {},
  textTitle: {},
  cardView: {},
  textTitle1: {},
  scanCardView: {
    height: 200,
    width: (width - 100) / 2,
    marginLeft: 90,
   // backgroundColor: Theme.base_color_8,
    marginTop: 30,
    borderRadius: 5,
    padding: 20
  },
  centerText: {},
  textBold: {},

  landingContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },

  //===================
  descText: {
    color: Theme.base_color_5,
  },
  bottomAreaView: {
    marginTop: -300,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: width * 0.7,
  },
  cameraStyle: {
    height: height, // height * 0.67,
    width: width,
  },
  markerStyle: {
    marginTop: -100,
  },
  buttonTouchable: {
    backgroundColor: Theme.primary_color_3,
    height: 50,
    width: 150,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: Theme.base_color_10,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cameraButton: {
    backgroundColor: 'transparent',
    height: 40,
    width: 100,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Theme.base_color_10,
  },
  cameraButtonText: {
    color: Theme.base_color_10,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  //==================
  headingText: {
    textTransform: 'uppercase',
    fontWeight: '900',
    fontSize: 24,
    alignSelf: 'flex-start',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '10%',
    padding: 10,
  },
  topContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  subText: {
    color: Theme.base_color_4,
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  subTextSmall: {
    color: Theme.base_color_4,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
  chart: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Theme.supporting_color_2,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    fontSize: 16,
  },
});

export default style;
