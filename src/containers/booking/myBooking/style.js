// @flow
import Theme from '../../../App.style';
import {StyleSheet, Dimensions} from 'react-native';

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
