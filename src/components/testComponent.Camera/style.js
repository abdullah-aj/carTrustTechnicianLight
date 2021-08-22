import {StyleSheet, Dimensions} from 'react-native';
import Theme from '../../App.style';

const {width, height} = Dimensions.get('screen');

const sideMargin = (width * 0.15) / 2;

const BTN_RADIUS = 2;
const style = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  insideContainer: {
    width: 830,
    minHeight: 350,
    borderRadius: 5,
    //justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  insideContainerImage: {
    width: '90%',
    height: '90%',
    borderRadius: 5,
    //justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    // paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {},
  titleText: {
    color: Theme.primary_color_2,
    textAlign: 'left',
    marginLeft: 0,
    textTransform: 'uppercase',
  },
  closeButton: {
    marginTop: 5,
  },
  descriptionRow: {
    padding: 10,
  },
  subText: {
    color: Theme.base_color_4,
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  cameraBox: {
    minHeight: 280,
    minWidth: 380,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(38,170,225,0.2)',
    borderRadius: 5,
    padding: 10,
  },
  cameraBoxTitle: {
    paddingBottom: 10,
  },
  cameraBoxTitleText: {
    color: Theme.primary_color_2,
    marginLeft: 0,
    textTransform: 'uppercase',
    marginBottom: -15,
  },
  cameraBoxBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    height: 40,
    width: 140,
    borderRadius: 5,
    backgroundColor: Theme.primary_color_1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtnText: {
    color: Theme.base_color_10,
    marginLeft: 5,
  },
  imageViewer: {
    backgroundColor: 'white',
    width: '100%',
    height: 200,
    //marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconCenter: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

export default style;
