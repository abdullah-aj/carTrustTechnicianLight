// @flow

import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Text from '../Text';
import Theme from '../../App.style';
import styles from './style';
import Icon from '../Icons';

type Props = {
  questionData: Object,
  selectedValueArr: Array<any>,
  onSelection: (param: Array<any>) => void,
  paused: boolean,
};

type State = {
  selectedValueArr: Array<any>,
  disabled: boolean,
};

const UNSELECTABLE = 'unselectable';

class RenderQuestion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageReady: false,
      selectedValueArr: [],
      disabled: false,
    };
  }

  componentDidMount: function = () => {
    this.setState({
      selectedValueArr: this.props.selectedValueArr,
      disabled: this.props.paused,
    });
  };

  componentDidUpdate: function = async (prevProp, prevState) => {
    if (
      JSON.stringify(prevProp.selectedValueArr) !==
      JSON.stringify(this.props.selectedValueArr)
    ) {
      this.setState({
        selectedValueArr: this.props.selectedValueArr,
      });
    }
    if (this.props.paused !== prevProp.paused) {
      this.setState({
        disabled: this.props.paused,
      });
    }
  };

  handleOptionSelection: function = (itemValue, itemIndex, i) => {
    const arr = [...this.state.selectedValueArr];
    if (itemIndex > 0) {
      arr[i] = {
        id: itemValue,
        value: this.props.questionData.question.step_data[itemIndex - 1].value,
      };
    } else {
      arr[i] = 0;
    }
    this.props.onSelection(arr);
    this.setState({
      selectedValueArr: arr,
    });
  };

  render(): React.Node {
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
                {this.props.questionData.stepNo}
              </Text>
              <Text
                size={2}
                color={Theme.primary_color_2}
                style={{fontWeight: 'bold'}}>
                /{this.props.questionData.totalSteps}
              </Text>
            </View>

            <Text
              style={{marginTop: 6, fontWeight: 'bold'}}
              size={3}
              color={Theme.primary_color_3}>
              {this.props.questionData.question.inspection_name}
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
                  {this.props.questionData.question.instructions}
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
                  {this.props.questionData.question.remarks}
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
                  {this.props.questionData.question.tools}
                </Text>
              </View>
            </View>

            {/* DropDowns */}
            <View style={localStyle.actionHolder}>
              {this.state.selectedValueArr.length > 0 &&
                this.state.selectedValueArr.map((v, i) => (
                  <>
                    <View style={localStyle.selectBlock}>
                      <View style={{paddingBottom: 5}}>
                        <Text size={1} style={{color: Theme.base_color_10}}>
                          {this.props.questionData.question.label +
                            ' ' +
                            (i + 1)}
                        </Text>
                      </View>
                      <View style={localStyle.selectContainer}>
                        <TextInput
                          editable={!this.state.disabled}
                          value={this.state.selectedValueArr[i]}
                          //onChangeText={handleText}
                          //placeholder={props.placeholder}
                          style={[localStyle.input, {fontSize: 16, height: 50}]}
                          placeholderTextColor={Theme.base_color_4}
                          // onFocus={onFocus}
                          // onBlur={onBlur}
                          // multiline={props.multiline}
                          // numberOfLines={props.numberOfLines}
                          // secureTextEntry={props.type === 'password'}
                          // defaultValue={props.initialValue}
                          // editable={!isFieldDisabled()}
                          // keyboardType={props.keyboardType}
                          // maxLength={props.maxLength}
                          // returnKeyType={props.returnKeyType}
                        />
                      </View>
                    </View>
                  </>
                ))}
            </View>
          </View>
        </View>
      </>
    );
  }
}

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

  actionHolder: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },

  selectBlock: {
    padding: 10,
    alignSelf: 'center',
  },
  selectContainer: {
    backgroundColor: Theme.base_color_10,
    height: 40,
  },
  input: {
    marginBottom: 15,
    height: 40,
    width: 250,
  },
});
