import {StyleSheet, Dimensions} from 'react-native';
import Theme from '../../App.style';

const {width, height} = Dimensions.get('screen');

const sideMargin = (width * 0.15) / 2;

const BTN_RADIUS = 2;
const style = StyleSheet.create({
  questionsContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    width: '100%',
    minHeight: height * 0.4,
    margin: 0,
    marginTop: 20,
    marginBottom: 25,
  },
  cardRowOne: {
    height: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRowTwo: {
    minHeight: height * 0.4 - 70,
    flexDirection: 'row',
  },
  lottie: {
    width: 120,
    height: 120,
    padding: 0,
    marginLeft: -10,
    backgroundColor: 'transparent',
  },
  stepHeadingText: {},
  questionMatter: {
    width: '100%',
  },
  questionImg: {},
  questionBox: {
    backgroundColor: Theme.primary_color_2,
    padding: 20,
    paddingBottom: 10,
    borderRadius: Theme.card_border_radius,
    marginTop: 10,
    minHeight: height * 0.2,
  },
  // buttons ******************
  testBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  testBtn: {
    padding: 10,
    paddingRight: 20,
    flexDirection: 'row',
    borderRadius: BTN_RADIUS,
    borderWidth: 1,
    justifyContent: 'center',
  },
  testBtnText: {
    alignSelf: 'center',
    padding: 0,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  saveBtn: {
    borderColor: Theme.primary_color_3,
  },
  saveBtnSelected: {
    backgroundColor: Theme.primary_color_3,
  },
  saveBtnText: {
    color: Theme.primary_color_3,
  },
  naBtn: {
    borderColor: Theme.primary_color_1,
  },
  naBtnSelected: {
    backgroundColor: Theme.primary_color_1,
  },
  naBtnText: {
    color: Theme.primary_color_1,
    paddingTop: 4.5,
    paddingBottom: 4.5,
  },

  actionTextSelected: {
    color: Theme.base_color_10,
  },
  roundBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  roundBtnPause: {
    backgroundColor: Theme.secondary_color_2,
  },
  roundBtnResume: {
    backgroundColor: Theme.secondary_color_3,
  },
  roundBtnSummary: {
    backgroundColor: Theme.primary_color_3,
  },
  roundBtnCamera: {
    backgroundColor: Theme.primary_color_1,
  },
  // modal for tip info
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    marginRight: 30,
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
    minHeight: 265,
  },
  modalBodyRow: {
    flexDirection: 'row',
  },
  modalBodyPrompt: {
    // width: 650,
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    minWidth: 600,
    minHeight: 450,
  },
  closeButton: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
});
export default style;
