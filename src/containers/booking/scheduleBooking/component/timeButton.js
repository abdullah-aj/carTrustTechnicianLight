// @flow
import * as React from 'react';
import {TouchableWithoutFeedback, Text, TouchableOpacity} from 'react-native';
import Theme from '../../../../App.style';
import {StyleSheet} from 'react-native';

type Props = {
  label: string,
  value: string,
  disabled: boolean,
  selected: boolean,
  onSelect: function,
};

class TimeButton extends React.Component<Props> {
  render(): React.Node {
    return (
      <>
        <TouchableOpacity
          onPress={this.props.onSelect.bind(this)}
          style={[
            style.container,
            this.props.disabled === true ? style.disabled : null,
            this.props.selected === true ? style.selected : null,
          ]}
          disabled={this.props.disabled}>
          <Text
            style={[
              style.text,
              this.props.selected === true ? style.selectedText : style.defaultText,
            ]}>
            {this.props.label}
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 0.18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 4,
    borderColor: Theme.primary_color_1,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: Theme.disabled_opacity,
    borderColor: Theme.base_color_6,
  },
  selected: {
    backgroundColor: Theme.primary_color_1,
  },
  text: {
    fontSize: 16,
  },
  selectedText: {
    color: Theme.base_color_10,
  },
  defaultText: {
    color: Theme.base_color_1,
  }
});

export default TimeButton;
