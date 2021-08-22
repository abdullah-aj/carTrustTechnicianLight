// @flow
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import style from './style';
import Text from '../../Text';
import Theme from '../../../App.style';
import {SharedStyles} from '../_sharedStyle';

type InputCheckBoxProps = {
  label: string,
  labelColor: String,
  name: string,
  form?: any,
  field?: any,
  fieldFormatter?: (value: string) => string,
  onFocusOut: (name: string) => void,
  onFocus: () => void,
  onChange?: (value: string) => void,
  value?: string,
  disabled?: boolean,
  validationMessage: string,
};

const CheckBoxInput = (props: InputCheckBoxProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isFocused, handleFocus] = useState(false);

  React.useEffect(() => {
    setToggleCheckBox(fieldValue());
  }, [props.field]);

  const onBlur = React.useCallback((e) => {
    if (props.form) {
      props.form.handleBlur(props.field.name)(e);
    }
    if (props.onFocusOut) {
      props.onFocusOut();
    }

    handleFocus(false);
  }, []);

  const onFocus = React.useCallback(() => {
    if (props.onFocus) {
      props.onFocus();
    }
    handleFocus(true);
  }, []);

  const isFieldDisabled = React.useCallback(() => {
    if (props.form) {
      return props.form.isSubmitting === true;
    } else {
      return props.disabled;
    }
  }, [props.form, props.disabled]);

  const fieldValue = () => {
    let value = false;
    if (typeof props.fieldFormatter === 'function') {
      value = props.field
        ? props.fieldFormatter(props.field.value)
        : props.fieldFormatter(props.value);
    } else {
      value = props.field ? props.field.value : props.value;
    }
    return value ? true : false;
  };

  return (
    <View style={[]}>
      <View style={{justifyContent: 'center'}}>
        <View style={{flex: 1, flexDirection: 'row', height: 50}}>
          <CheckBox
            value={toggleCheckBox}
            onFocus={onFocus}
            onBlur={onBlur}
            tintColors={{
              true: Theme.primary_color_3,
              false: Theme.base_color_10,
            }}
            onValueChange={(toggleCheckBox) => {
              setToggleCheckBox(toggleCheckBox);
              if (props.onChange) {
                props.onChange(toggleCheckBox);
              }
            }}
            editable={!isFieldDisabled()}
            disabled={props.disabled ? props.disabled : false}
          />
          <Text
            size={2}
            weight={'regular'}
            style={{
              textAlign: 'left',
              color: props.labelColor,
              marginTop: 4,
              fontSize: 16,
            }}>
            {props.label}
          </Text>
        </View>
      </View>
      {props.form &&
      props.form.errors &&
      props.form.errors[props.field.name] &&
      props.form.touched[props.field.name] === true ? (
        <Text weight={'light'} style={[SharedStyles.errorMessage]}>
          {props.form.errors[props.field.name]}
        </Text>
      ) : props.validationMessage ? (
        <Text weight={'light'} style={[SharedStyles.errorMessage]}>
          {props.validationMessage}
        </Text>
      ) : null}
    </View>
  );
};

CheckBoxInput.defaultProps = {
  editable: true,
};

export default CheckBoxInput;
