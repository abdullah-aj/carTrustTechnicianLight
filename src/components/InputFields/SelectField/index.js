// @flow
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import style from './style';
import Text from '../../Text';
import Theme from '../../../App.style';
import {SharedStyles} from '../_sharedStyle';

type Props = {
  label: string,
  labelColor: String,
  name: string,
  form?: any,
  field?: any,
  fieldFormatter?: (value: string) => string,
  onFocusOut: (name: string) => void,
  onFocus: () => void,
  onChange?: (value: any) => void,
  value?: string,
  disabled?: boolean,
  validationMessage: string,
  key: string | number,
  optionsList: Array<Object>,
  showUnselectable: boolean,
  style: Object,
  defaultText: string,
};

const SelectField = (props: Props): any => {
  // const [selectValue, setSelectValue] = useState();
  const [isFocused, handleFocus] = useState(false);
  const UNSELECTABLE = 'Select';

  // React.useEffect(() => {
  //   setSelectValue(fieldValue());
  // }, [props.field]);

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

  // const isFieldDisabled = React.useCallback(() => {
  //   if (props.form) {
  //     return props.form.isSubmitting === true;
  //   } else {
  //     return props.disabled;
  //   }
  // }, [props.form, props.disabled]);

  const fieldValue = () => {
    let value = false;
    if (typeof props.fieldFormatter === 'function') {
      value = props.field
        ? props.fieldFormatter(props.field.value)
        : props.fieldFormatter(props.value);
    } else {
      value = props.field ? props.field.value : props.value;
    }
    return value;
  };

  // const handleSelectChange = (itemValue) => {
  //   setSelectValue(itemValue);
  // };

  return (
    <View style={[props.style]}>
      <View style={{justifyContent: 'center'}}>
        {props.label && (
          <>
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
          </>
        )}
        <View style={{backgroundColor: Theme.base_color_10}}>
          <Picker
            selectedValue={fieldValue()}
            style={{}}
            onFocus={onFocus}
            onBlur={onBlur}
            enabled={props.disabled ? false : true}
            // prompt="Select"
            onValueChange={(itemValue, itemIndex) => {
              //handleSelectChange(itemValue);
              props.onChange && props.onChange(itemValue);
            }}>
            <Picker.Item
              label={props.defaultText ? props.defaultText : UNSELECTABLE}
              value={''}
            />
            {props.optionsList.map((item, i) => (
              <Picker.Item
                key={props.key + 'select' + i}
                label={item.name}
                value={item.id}
              />
            ))}
          </Picker>
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

SelectField.defaultProps = {
  showUnselectable: true,
  disabled: false,
};

export default SelectField;
