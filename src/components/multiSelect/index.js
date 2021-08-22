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
import Text from '../Text';
import {RenderMultiSelectItems} from './RenderMultiSelectItems';
import Button from '../Button';
import Icon from '../Icons';
import Theme from '../../App.style';
import _ from 'lodash';
import AP from '../../api';

type Props = {
  types: string[],
  selectedTypes: string[],
  handleClose: any,
  handleSelected: () => void,
  alreadySelected: any,
};
export const MultiSelect = (props: Props): any => {
  const [defectsList, setDefectsList] = React.useState<Object>([]);
  const [listToSend, setListToSend] = React.useState<any>([]);

  React.useEffect(() => {
    getDefectsList();
  }, []);

  React.useEffect(() => {
    if (props.alreadySelected.length > 0) {
      setListToSend(props.alreadySelected);
    }
  }, [props.alreadySelected]);

  const getDefectsList = async () => {
    try {
      const response: any = await AP.Calls.Language.getTranslation({
        language: 'ar',
      });
      if (response) {
        setDefectsList([
          {
            id: 1,
            type: 'No Defect  -  ' + response.data.language_label['No Defect'],
          },
          {id: 2, type: 'Dent  -  ' + response.data.language_label['Dent']},
          {
            id: 3,
            type: 'Scratch  -  ' + response.data.language_label['Scratch'],
          },
          {
            id: 4,
            type:
              'Difference in Coating Thickness  -  ' +
              response.data.language_label['Color Mismatch'],
          },
          {id: 5, type: 'Crack  -  ' + response.data.language_label['Crack']},
        ]);
      }
    } catch (e) {
      console.log('ERROR :>>', e);
    }
  };

  const handleSubmit = () => {
    // console.log('final array to send list::>>>', listToSend);
    props.handleClose(listToSend);
  };

  const handleSelect = (selectedId) => {
    //contains the index of the received object in listToSend if exists
    const indexToRemove = listToSend.findIndex(function (item, index) {
      return item.id === selectedId.id;
    });

    // console.log('Index to remove isss:>>>', indexToRemove);

    //if there is a value in indexToRemove it means a value has been selected then deselected, it has to be removed from the array
    if (indexToRemove !== -1) {
      let b = listToSend.splice(indexToRemove, 1);
      setListToSend([...listToSend]);
    } else {
      setListToSend([...listToSend, selectedId]);
    }
  };
  return (
    <>
      <Modal visible={true} animationType="slide">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30,
          }}>
          <Text weight={'bold'} size={4} color={Theme.primary_color_2}>
            Select a defect type
          </Text>
          <TouchableOpacity onPress={props.handleSelected}>
            <Icon
              name={'close'}
              width={30}
              height={30}
              fill={Theme.secondary_color_2}
            />
          </TouchableOpacity>
        </View>
        {defectsList &&
          defectsList.map((val, index) => {
            return (
              <RenderMultiSelectItems
                alreadySelected={props.alreadySelected}
                handleSelect={handleSelect}
                id={val.id}
                label={val.type}
              />
            );
          })}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 20,
          }}>
          <Button
            style={{width: 300, margin: 10}}
            label={'Okay'}
            action={handleSubmit}
          />
        </View>
      </Modal>
    </>
  );
};
