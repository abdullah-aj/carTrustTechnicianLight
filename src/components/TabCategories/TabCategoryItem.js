// @flow
import React, {useEffect, useState} from 'react';
import {
  Switch,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Theme from '../../App.style';
import {setSelectedLog} from 'react-native/Libraries/LogBox/Data/LogBoxData';

type Props = {
  data: Array<any>,
  selectedCategory: (index: number) => void,
  selected: number,
};

const TabCategoryItem = (props: Props): any => {
  {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          width: '100%',
          justifyContent: 'space-between',
        }}>
        {props.data &&
          props.data.map((val, index) => {
            //index++;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.item,
                  props.selected === index ? styles.itemSelected : null,
                ]}
                onPress={props.selectedCategory.bind(this, index)}>
                <View
                  style={[
                    styles.numberCircle,
                    props.selected === index ? styles.numberCircleActive : null,
                  ]}>
                  <Text key={index} style={styles.text}>
                    {index + 1}
                  </Text>
                </View>
                <View>
                  <Text
                    style={
                      props.selected === index
                        ? styles.itemLabelTxtSelected
                        : styles.itemLabelTxt
                    }
                    key={index}>
                    {val.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 3,
    padding: 10,
    maxWidth: 140,
  },
  itemSelected: {
    borderBottomColor: Theme.primary_color_3,
    borderBottomWidth: 3,
  },
  numberCircle: {
    backgroundColor: Theme.base_color_6,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    marginBottom: 10,
  },
  numberCircleActive: {
    backgroundColor: Theme.body_bg_color_1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
  },
  numberCircleDone: {
    backgroundColor: Theme.supporting_color_1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
  },
  text: {
    color: 'white',
    flexShrink: 1,
  },
  itemLabelTxt: {
    color: Theme.base_color_6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemLabelTxtSelected: {
    color: Theme.primary_color_2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemLabelTxtCompleted: {
    color: Theme.secondary_color_3,
  },
});
export default TabCategoryItem;
