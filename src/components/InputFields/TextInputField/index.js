// @flow
import React, {useState} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import style from './style';
import Text from '../../Text';
import Theme from '../../../App.style';
import Util from '../../../util';
import {
  FieldLabelStyle,
  GetMainFieldType,
  SharedStyles,
  StyleFieldBasedOnProps,
} from '../_sharedStyle';

type InputFieldProps = {
  label: string,
  name: string,
  form?: any,
  field?: any,
  value?: string,
  styleType: 1 | 2 | 3 | 4,
  multiline?: boolean,
  numberOfLines?: number,
  fieldFormatter?: (value: string) => string,
  placeholder: string,
  onChange?: (value: string) => void,
  onFocusOut: (name: string) => void,
  onFocus: () => void,
  type: 'text' | 'password' | 'number',
  validationMessage: string,
  disabled?: boolean,
  initialValue?: string,
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad',
  maxLength?: number,
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | string,
  style?: any,
  inputFieldStyle?: any,
  textArea: boolean,
};

const InputField = (props: InputFieldProps) => {
  const [isFocused, handleFocus] = useState(false);

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

  const handleText = React.useCallback(
    (newValue) => {
      const hasFormat = typeof props.fieldFormatter === 'function';
      if (props.form) {
        props.form.handleChange(props.field.name)(
          hasFormat ? props.fieldFormatter(newValue) : newValue,
        );
      } else {
        props.onChange(hasFormat ? props.fieldFormatter(newValue) : newValue);
      }
    },
    [props.fieldFormatter],
  );

  const isFieldDisabled = React.useCallback(() => {
    if (props.form) {
      return props.form.isSubmitting === true;
    } else {
      return props.disabled;
    }
  }, [props.form, props.disabled]);

  /**
   * Style input field
   * @returns {[*]}
   */
  const textInputStyle = () => {
    const isInvalid =
      props.form &&
      props.form.errors &&
      props.form.errors[props.field.name] &&
      props.form.touched[props.field.name] === true;
    const isPhoneField = props.keyboardType === 'phone-pad';
    return StyleFieldBasedOnProps(
      isFocused,
      props.styleType,
      isInvalid,
      isPhoneField,
      props.disabled === true,
    );
  };

  const getLabelStyleFromType = () => {
    return FieldLabelStyle(props.styleType);
  };

  const fieldValue = () => {
    if (typeof props.fieldFormatter === 'function') {
      return props.field
        ? props.fieldFormatter(props.field.value)
        : props.fieldFormatter(props.value);
    } else {
      return props.field ? props.field.value : props.value;
    }
  };

  return (
    <View style={[props.style]}>
      {props.label && (
        <Text
          size={2}
          weight={'regular'}
          style={[SharedStyles.label, getLabelStyleFromType()]}>
          {props.label}
        </Text>
      )}
      <View style={{justifyContent: 'center'}}>
        <TextInput
          value={fieldValue()}
          onChangeText={handleText}
          onEndEditing={(e) => {
            props.onEndEditing &&
              props.onEndEditing(e._targetInst.memoizedProps.value);
          }}
          placeholder={props.placeholder}
          style={[
            [
              textInputStyle(),
              props.textArea
                ? {height: 160, textAlignVertical: 'top'}
                : {fontSize: 16, height: 50},
            ],
            props.inputFieldStyle,
          ]}
          placeholderTextColor={Theme.base_color_4}
          onFocus={onFocus}
          onBlur={onBlur}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          secureTextEntry={props.type === 'password'}
          defaultValue={props.initialValue}
          editable={!isFieldDisabled()}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          showSoftInputOnFocus={props.disabled === true ? false : true}
          returnKeyType={props.returnKeyType}
        />
        {props.keyboardType === 'phone-pad' && (
          <Text
            size={4}
            style={[
              Platform.OS === 'ios'
                ? style.mobileStartCodeText
                : style.mobileStartCodeTextAndroid,
              getLabelStyleFromType(),
            ]}>
            {Util.Constants.MOBILE_START_CODE}
          </Text>
        )}
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

InputField.defaultProps = {
  type: 'text',
  editable: true,
  styleType: 1,
  keyboardType: 'default',
  initialValue: '',
  returnKeyType: 'done',
  multiline: false,
  numberOfLines: 1,
};

export default InputField;
