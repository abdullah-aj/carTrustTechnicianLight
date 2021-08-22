import {StyleSheet} from 'react-native';
import Theme from '../../../App.style';

const style = StyleSheet.create({
  cardContainer: {
    minHeight: 290, // 400,
    width: '70%',
    backgroundColor: Theme.primary_color_2,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    marginBottom: '7%',
    marginLeft: 90,
  },
  vehicleCardsContainer: {
    width: '70%',
    backgroundColor: Theme.primary_color_2,
    alignSelf: 'flex-start',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    marginBottom: '7%',
    marginLeft: 90,
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 500,
  },
  itemContainer: {
    flex: 1,
    width: '100%',
  },
  button: {
    height: 60,
    width: 400,
    marginBottom: 15,
  },
  selectContainer: {
    backgroundColor: Theme.base_color_10,
    height: 60,
  },
  select: {
    marginBottom: 15,
    height: 60,
    width: 400,
  },
});

export default style;
