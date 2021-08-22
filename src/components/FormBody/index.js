// @flow
import * as React from 'react';
import {View, ScrollView, KeyboardAvoidingView} from 'react-native';
import PageContainer from '../PageContainer';
import Theme from '../../App.style';

const FormBody = (props: {
  children: *,
  handleKeyboard: boolean,
  backgroundColor: string,
}): * => {
  if (props.handleKeyboard === true) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView
          style={{backgroundColor: props.backgroundColor}}
          contentContainerStyle={{
            padding: Theme.page_padding,
            paddingBottom: 50,
          }}
          keyboardShouldPersistTaps="handled">
          {props.children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <ScrollView
        style={{backgroundColor: props.backgroundColor}}
        keyboardShouldPersistTaps="handled">
        {props.children}
      </ScrollView>
    );
  }
};

FormBody.defaultProps = {
  handleKeyboard: true,
  backgroundColor: Theme.body_bg_color_4,
};

export default FormBody;
