// @flow
import * as React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import Theme from '../../App.style';
import Text from '../Text';
import Icon from '../Icons';

type Props = {
  id: number,
  label: string,
  handleSelect: any,
  alreadySelected: any,
};
export const RenderMultiSelectItems = (props: Props): any => {
  const [toggleSelected, setToggleSelected] = React.useState(false);

  React.useEffect(() => {
    props.alreadySelected.map((defect) => {
      if (defect.label === props.label) {
        setToggleSelected(true);
      }
    });
  }, [props.alreadySelected]);

  const handleOnPress = (id, label) => {
    setToggleSelected(!toggleSelected);
    props.handleSelect({id, label});
  };

  return (
    <View style={{paddingLeft: 20, paddingTop: '2%'}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Theme.base_color_8,
          padding: 10,
        }}
        onPress={handleOnPress.bind(this, props.id, props.label)}>
        <Icon
          name={'check'}
          width={20}
          height={20}
          fill={toggleSelected ? Theme.secondary_color_3 : Theme.base_color_6}
        />
        <Text
          weight={'bold'}
          size={3}
          color={toggleSelected ? Theme.primary_color_2 : Theme.base_color_6}
          style={{paddingLeft: 10}}>
          {props.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
