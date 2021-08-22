// @flow
import Theme from '../../App.style';
import {StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

const style: Object = StyleSheet.create({
  mainContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    margin: 0,
    justifyContent: 'flex-start',
    padding: 10,
    flexWrap: 'wrap',
    marginTop: Theme.page_margin_for_transparent_header,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
    height: 8,
  },
  //
  cardsContainer: {
    width: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    textTransform: 'uppercase',
    fontWeight: '900',
    fontSize: 24,
    alignSelf: 'flex-start',
  },
  headingTextSM: {
    textTransform: 'uppercase',
    fontWeight: '900',
    fontSize: 18,
    alignSelf: 'flex-start',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  topContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 0,
    width: '100%',
    flexWrap: 'wrap',
  },
  midContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
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
  buttonsArea: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    paddingTop: 0,
    width: '100%',
  },
  buttonStyle: {
    marginTop: 20,
    width: 150,
    height: 45,
  },

  horizontalLine: {
    borderColor: Theme.primary_color_3,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
    margin: 5,
    opacity: 0.2,
  },
  statusBall: {
    height: 10,
    width: 10,
    backgroundColor: 'grey',
    borderRadius: 10,
    alignSelf: 'center',
    marginLeft: 10,
  },
  statusCompleted: {
    backgroundColor: '#57A900',
  },
  statusPending: {
    backgroundColor: '#fdb725',
  },
  statusProgress: {
    backgroundColor: '#00C389',
  },
  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    //  minHeight: 265,
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBodyRow: {
    flexDirection: 'row',
  },
  modalBodyPrompt: {
    // width: 650,
    justifyContent: 'space-between',
    paddingTop: 90,
    paddingLeft: 20,
    paddingRight: 20,
  },
  closeButton: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    width: 700,
    flexWrap: 'wrap',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 700,
  },
  qrViewer: {
    width: 400,
    height: 400,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: Theme.primary_color_2,
    marginBottom: 15,
    borderRadius: 4,
    width: 400,
  },
  // Modal Scanner Style *************************

  landingContainer: {
    // alignSelf: 'center',
    // justifyContent: 'center',
    // height: 300,
    // backgroundColor: Theme.base_color_10,
    // width: 500,
  },
  descText: {
    color: Theme.base_color_5,
    alignSelf: 'center'
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
