// @flow
import * as React from 'react';
import {View, Text} from 'react-native';
import Theme from '../../../../App.style';
import {StyleSheet} from 'react-native';
import TimeButton from './timeButton';

type Props = {
  timeSlots?: Array<Object>,
  onSelection: function,
  selected: string,
};

type State = {};

class TimeSlot extends React.Component<Props, State> {
  formatLabel: function = (label: string) => {
    return label;
  };

  render(): React.Node {
    return (
      <>
        <View style={style.main}>
          {this.props.timeSlots.length ? (
            <>
              <View style={style.container}>
                <View style={style.row}>
                  <View style={style.label}>
                    <Text style={style.labelText}>Time Slot</Text>
                  </View>
                  <View style={style.lineStyle} />
                </View>
                <View style={style.row}>
                  <View style={style.timeSlot}>
                    {this.props.timeSlots.map((obj, index) => {
                      if (index < 4) {
                        for (let key in obj) {
                          if (obj.hasOwnProperty(key)) {
                            return (
                              <TimeButton
                                key={index}
                                label={this.formatLabel(key)}
                                value={key}
                                disabled={!obj[key]}
                                selected={this.props.selected === key && true}
                                onSelect={this.props.onSelection.bind(
                                  this,
                                  key,
                                )}
                              />
                            );
                          }
                        }
                      }
                    })}
                  </View>
                </View>
              </View>

              {this.props.timeSlots.length > 4 && (
                <>
                  <View style={style.container}>
                    <View style={style.row}>
                      <View style={style.label}>
                        <Text style={style.labelText}>Time Slot</Text>
                      </View>
                      <View style={style.lineStyle} />
                    </View>
                    <View style={style.row}>
                      <View style={style.timeSlot}>
                        {this.props.timeSlots.map((obj, index) => {
                          if (index >= 4 && index < 10) {
                            for (let key in obj) {
                              if (obj.hasOwnProperty(key)) {
                                return (
                                  <TimeButton
                                    key={index}
                                    label={this.formatLabel(key)}
                                    value={key}
                                    disabled={!obj[key]}
                                    selected={
                                      this.props.selected === key && true
                                    }
                                    onSelect={this.props.onSelection.bind(
                                      this,
                                      key,
                                    )}
                                  />
                                );
                              }
                            }
                          }
                        })}
                      </View>
                    </View>
                  </View>
                </>
              )}

              {this.props.timeSlots.length > 10 && (
                <>
                  <View style={style.container}>
                    <View style={style.row}>
                      <View style={style.label}>
                        <Text style={style.labelText}>Time Slot</Text>
                      </View>
                      <View style={style.lineStyle} />
                    </View>
                    <View style={style.row}>
                      <View style={style.timeSlot}>
                        {this.props.timeSlots.map((obj, index) => {
                          if (index >= 10 && index <= 15) {
                            for (let key in obj) {
                              if (obj.hasOwnProperty(key)) {
                                return (
                                  <TimeButton
                                    key={index}
                                    label={this.formatLabel(key)}
                                    value={key}
                                    disabled={!obj[key]}
                                    selected={
                                      this.props.selected === key && true
                                    }
                                    onSelect={this.props.onSelection.bind(
                                      this,
                                      key,
                                    )}
                                  />
                                );
                              }
                            }
                          }
                        })}
                      </View>
                    </View>
                  </View>
                </>
              )}
            </>
          ) : (
            <>
              <View style={style.container}>
                <View style={style.row}>
                  <View
                    style={[
                      style.label,
                      {
                        flex: 0.87,
                        marginTop: 50,
                        marginBottom: 50,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text style={style.labelText}>No Slot Available</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </>
    );
  }
}

const style = StyleSheet.create({
  main: {
    //marginTop: -30,
    //height: 310,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    // marginBottom: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
  },
  label: {
    flex: 0.15,
    marginLeft: 90,
  },
  labelText: {
    fontSize: 20,
  },
  lineStyle: {
    backgroundColor: 'green',
    flex: 0.75,
    borderWidth: 0.5,
    borderColor: '#eeeeee',
    margin: 12,
    marginLeft: 0,
  },
  timeSlot: {
    flex: 0.9,
    flexDirection: 'row',
    marginLeft: 90,
  },
});

export default TimeSlot;
