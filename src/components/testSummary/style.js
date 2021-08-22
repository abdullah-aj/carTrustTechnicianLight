import {StyleSheet} from 'react-native';
import Theme from '../../App.style';

const style = StyleSheet.create({
  mainContainer: {
    flexWrap: 'wrap',
    width: '100%',
    alignSelf: 'center',
    marginTop: Theme.page_margin_for_transparent_header,
  },
  accordionPanelSuccess: {
    backgroundColor: Theme.secondary_color_3,
    borderRadius: Theme.card_border_radius,
    padding: 0,
    marginBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    width: '100%',
  },
  accordionPanelFailure: {
    backgroundColor: Theme.secondary_color_2,
    borderRadius: Theme.card_border_radius,
    padding: 0,
    marginBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    width: '100%',
  },

  accordionInnerPanel: {
    backgroundColor: Theme.base_color_10,
    width: '100%',
    alignSelf: 'flex-start',
    padding: 20,
    borderBottomLeftRadius: Theme.card_border_radius,
    borderBottomRightRadius: Theme.card_border_radius,
    borderWidth: 1,
    borderColor: Theme.base_color_8,
  },
  innerPanelRow: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    marginTop: 15,
    borderColor: Theme.base_color_8,
    borderBottomWidth: 1,
  },
  iconsRow: {
    flexDirection: 'row',
    // borderColor: Theme.base_color_8,
    // borderBottomWidth: 1,
    height: 40,
    marginTop: 5
  },
});

export default style;
