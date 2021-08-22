// @flow

import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../Text';
import Theme from '../../App.style';
import styles from './style';
import Icon from '../Icons';

type Props = {
  questionData: Object,
};

const RenderQuestion = (props: Props): any => {
  return (
    <>
      <View style={{}}>
        <View style={styles.questionMatter}>
          <View style={{flexDirection: 'row'}}>
            <Text
              size={2}
              color={Theme.primary_color_2}
              style={{fontWeight: 'bold'}}>
              Step
            </Text>
            <Text
              size={2}
              color={Theme.primary_color_3}
              style={{fontWeight: 'bold', paddingLeft: 5}}>
              {props.questionData.stepNo}
            </Text>
            <Text
              size={2}
              color={Theme.primary_color_2}
              style={{fontWeight: 'bold'}}>
              /{props.questionData.totalSteps}
            </Text>
          </View>

          <Text
            style={{marginTop: 6, fontWeight: 'bold'}}
            size={3}
            color={Theme.primary_color_3}>
            {props.questionData.question.inspection_name}
          </Text>
        </View>

        <View style={styles.questionBox}>
          {/* Instructions */}
          <View style={[localStyle.questionRow, {paddingTop: 5}]}>
            <View style={localStyle.iconHolder}>
              <Icon
                name={'note'}
                fill={Theme.base_color_10}
                width={18}
                height={20}
                style={{alignSelf: 'center', marginTop: 3}}
              />
            </View>
            <View style={{paddingLeft: 15, paddingRight: 15}}>
              <Text color={Theme.base_color_10} size={2}>
                {props.questionData.question.instructions}
              </Text>
            </View>
          </View>

          {/* Remarks */}
          <View style={localStyle.questionRow}>
            <View style={localStyle.iconHolder}>
              <Icon
                name={'comment'}
                fill={Theme.base_color_10}
                width={20}
                height={20}
                style={{alignSelf: 'center', marginTop: 2}}
              />
            </View>
            <View style={{paddingLeft: 15, paddingRight: 15}}>
              <Text color={Theme.base_color_10} size={2}>
                {props.questionData.question.remarks}
              </Text>
            </View>
          </View>

          {/* Tools */}
          <View style={localStyle.questionRow}>
            <View style={localStyle.iconHolder}>
              <Icon
                name={'tools'}
                fill={Theme.base_color_10}
                width={20}
                height={20}
                style={{alignSelf: 'center', marginTop: 2}}
              />
            </View>
            <View style={{paddingLeft: 15, paddingRight: 15}}>
              <Text color={Theme.base_color_10} size={2}>
                {props.questionData.question.tools}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default RenderQuestion;

const localStyle = StyleSheet.create({
  questionRow: {
    flexDirection: 'row',
    paddingBottom: 15,
    paddingLeft: 30,
  },
  iconHolder: {
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: Theme.primary_color_3,
  },
});
