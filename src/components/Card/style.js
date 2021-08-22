import {StyleSheet} from 'react-native';
import Theme from '../../App.style';

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    margin: -10,
    width: '100%',
    shadowColor: Theme.base_color_9,
    shadowOffset: {
      width: 20,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 6,
  },
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
    flexDirection: 'row-reverse',
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
