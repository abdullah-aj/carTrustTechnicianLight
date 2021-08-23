// @flow

import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  LogBox,
} from 'react-native';
import Text from '../Text';
import Theme from '../../App.style';
import styles from './style';
import Icon from '../Icons';
import {Picker} from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';

type Props = {
  questionData: Object,
  selectedValueArr: Array<any>,
  onSelection: (param: Array<any>) => void,
  paused: boolean,
};

type State = {
  selectedValueArr: Array<any>,
  enabled: boolean,
  disabled: boolean,
};

const UNSELECTABLE = 'unselectable';
const NO_FAULT = 'No Fault';

class RenderQuestion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageReady: false,
      selectedValueArr: [],
      enabled: false,
      disabled: false,
      dropdownItems: [],
      viewKey: 0,
    };
  }

  componentDidMount: function = () => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const items = this.props.questionData.question.odbMessages.map((item) => {
      return {
        id: item.id,
        name: item.title + ' - ' + item.description,
        value: item.title,
      };
    });
    this.setState({
      selectedValueArr: this.props.selectedValueArr,
      enabled: !this.props.paused,
      dropdownItems: items,
    });

    if (
      this.props.selectedValueArr.length === 1 &&
      (this.props.selectedValueArr[0].name === NO_FAULT ||
        this.props.selectedValueArr[0] === 0)
    ) {
      this.setState({
        disabled: true,
      });
    } else {
      this.setState({
        disabled: this.props.paused,
      });
    }
  };

  componentDidUpdate: function = (prevProp, prevState) => {
    if (
      JSON.stringify(prevProp.selectedValueArr) !==
      JSON.stringify(this.props.selectedValueArr)
    ) {
      this.setState({
        selectedValueArr: this.props.selectedValueArr,
      });
      if (
        this.props.selectedValueArr.length === 1 &&
        this.props.selectedValueArr[0].name === NO_FAULT
      ) {
        this.setState({
          disabled: true,
          enabled: !this.props.paused,
        });
      } else {
        this.setState({
          enabled: !this.props.paused,
          disabled: this.props.paused,
        });
      }
      this.setState({
        viewKey: this.state.viewKey + 1,
      });
    }
    if (this.props.paused !== prevProp.paused) {
      if (
        this.props.selectedValueArr.length === 1 &&
        this.props.selectedValueArr[0].name === NO_FAULT
      ) {
        this.setState({
          disabled: true,
          enabled: !this.props.paused,
        });
      } else {
        this.setState({
          enabled: !this.props.paused,
          disabled: this.props.paused,
        });
      }
    }
  };

  handleOptionSelection: function = async (itemObj, dropDownNumber) => {
    const arr = [...this.state.selectedValueArr];
    arr[dropDownNumber] = itemObj;

    if (itemObj.id !== NO_FAULT) {
      if (this.state.disabled === true) {
        await this.setState({
          disabled: false,
        });
      }
    } else {
      arr.length = 1;
      await this.setState({
        disabled: true,
      });
    }

    await this.props.onSelection(arr);
    await this.setState({
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

          <View style={[styles.questionBox, {}]}>
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
                    <View style={[localStyle.selectBlock, {marginRight: -50}]}>
                      <View
                        key={this.state.viewKey}
                        style={localStyle.selectContainer}>
                        <SearchableDropdown
                          items={
                            i === 0
                              ? [
                                  {
                                    id: NO_FAULT,
                                    name: NO_FAULT,
                                    value: NO_FAULT,
                                  },
                                  ...this.state.dropdownItems,
                                ]
                              : this.state.dropdownItems
                          }
                          onItemSelect={(item) => {
                            this.handleOptionSelection(item, i);
                          }}
                          selectedItems={
                            this.state.selectedValueArr[i] !== 0
                              ? this.state.selectedValueArr[i]
                              : []
                          }
                          containerStyle={{
                            width: 250,
                            backgroundColor: '#fff',
                          }}
                          itemStyle={{
                            backgroundColor: '#f5f5f5',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 5,
                            paddingTop: 5,
                          }}
                          itemTextStyle={{color: '#222'}}
                          itemsContainerStyle={{maxHeight: 340}}
                          textInputProps={{
                            placeholder:
                              this.state.selectedValueArr[i] !== 0
                                ? this.state.selectedValueArr[i].name
                                : 'Select ' +
                                  this.props.questionData.question.label,
                            underlineColorAndroid: 'transparent',
                            style: {
                              paddingTop: 5,
                              paddingBottom: 5,
                              paddingLeft: 10,
                              paddingRight: 10,
                            },
                          }}
                          placeholderTextColor={'#000'}
                          // listProps={{
                          //   nestedScrollEnabled: true,
                          // }}
                        />
                      </View>
                      <View style={localStyle.closeBlock}>
                        {i !== 0 && (
                          <>
                            <TouchableOpacity
                              disabled={!this.state.enabled}
                              style={[!this.state.enabled && {opacity: 0.5}]}
                              onPress={() => {
                                this.props.onRemove(i);
                              }}>
                              <Icon
                                name={'close'}
                                width={20}
                                height={20}
                                fill={Theme.secondary_color_2}
                              />
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    </View>
                  </>
                ))}
              <View style={localStyle.actionHolder}>
                <View style={localStyle.selectBlock}>
                  <TouchableOpacity
                    disabled={this.state.disabled}
                    style={[
                      localStyle.addButton,
                      this.state.disabled && {opacity: 0.5},
                    ]}
                    onPress={() => {
                      this.props.onAdd();
                    }}>
                    <Text size={2} style={[localStyle.addButtonText]}>
                      ADD MORE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
    // flexWrap: 'wrap',
  },

  selectBlock: {
    flexDirection: 'row',
    padding: 10,
    alignSelf: 'center',
  },
  selectContainer: {
    // backgroundColor: Theme.base_color_10,
    // height: 40,
    justifyContent: 'center',
  },
  select: {
    height: 40,
    width: 250,
  },
  addButton: {
    marginBottom: 15,
    height: 40,
    width: 250,
    backgroundColor: Theme.primary_color_3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  addButtonText: {
    color: Theme.base_color_10,
  },
  closeBlock: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
