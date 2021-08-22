// @flow
import * as React from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import _ from 'lodash';
import style from './style';
import Text from '../../Text';
import {FieldLabelStyle, SharedStyles, StyleFieldBasedOnProps} from '../_sharedStyle';
import {useTranslation} from 'react-i18next';
import Theme from '../../../App.style';
import Icon from '../../Icons';


type Props = {
    name: string,
    label: string,
    form?: any,
    field?: any,
    placeholder?: string,
    options: Array<{ label: string, value: string }>,
    styleType: number,
    style?: any,
    inputFieldStyle?: any,
    inputFieldFontStyle?: any,
    disabled: boolean,
    selectedValue: string,
    onValueChange: (value: string)=>void,
    validationText?: string,
    onCancel: ()=>void,
};

export const SelectInput = (props: Props) => {
    const [showPicker, setShowPicker] = React.useState(false);
    const {t} = useTranslation();

    const close = () => {
        setShowPicker(false);
        if (props.onCancel) {
            props.onCancel();
        }
    };

    const openPicker = () => {
        if (isFieldEditable() === false) {
            return;
        }
        if (Platform.OS === 'ios' && props.form) {
            //set first option once we open the picker.
            props.form.setFieldValue(props.field.name, props.options[0].value);
        }
        setShowPicker(true);
    };

    const onSelect = (value) => {
        if (props.form) {
            const found = _.find(props.options, {value: value});
            if (found) {
                props.form.setFieldValue(props.field.name, value);
                props.form.setFieldTouched(props.field.name, true);
            }
        } else {
            props.onValueChange(value);
        }

        if (Platform.OS !== 'ios') {
            setShowPicker(false);
        }
    };

    /**
     * Get selected label
     * @param value
     * @returns {*}
     */
    const getOptionLabel = (value: string) => {
        const found = _.find(props.options, {value: value});
        if (found) {
            return found.label;
        }
    };

    /**
     * get input field value
     * @returns {*}
     */
    const getInputValue = () => {
        if (props.form) {
            return getOptionLabel(props.form.values[props.field.name]);
        } else {
            return getOptionLabel(props.selectedValue);
        }
    };

    const isAndroidOptionSelected = (value) => {
        if (Platform.OS !== 'ios') {
            if (props.form) {
                return props.form.values[props.field.name] === value;
            } else {
                return props.selectedValue === value;
            }
        }
    };

    const isFieldEditable = () => {
        if (props.form) {
            return props.form.isSubmitting === false;
        } else {
            return props.disabled === false;
        }
    };


    /**
     * Style input field
     * @returns {[*]}
     */
    const InputStyle = () => {
        const isInvalid: any = props.form && props.form.errors && props.form.errors[props.field.name] && props.form.touched[props.field.name] === true;
        return StyleFieldBasedOnProps(false, props.styleType, isInvalid, false, props.disabled === true);
    };

    /**
     * get select label.
     * @returns {*}
     */
    const getLabelStyleFromType = () => {
        return FieldLabelStyle(props.styleType);
    };

    const validationMessage = () => {
        if (props.form && props.form.errors && props.form.errors[props.field.name] && props.form.touched[props.field.name] === true) {
            return (
                <Text weight={'light'} style={SharedStyles.errorMessage}>
                    {props.form.errors[props.field.name]}
                </Text>
            );
        } else if (props.validationText) {
            return (
                <Text weight={'light'} style={SharedStyles.errorMessage}>
                    {props.validationText}
                </Text>
            );
        } else {
            return null;
        }
    };

    const getSelectedValue = (key) => {
        if (key) {
            const obj = _.find(props.options, {value: key});
            if (obj) {
                return obj.label;
            }
        } else {
            return <Text
                style={[SharedStyles.selectInputField, props.inputFieldFontStyle, {color: Theme.base_color_7}]}>
                {props.placeholder}
            </Text>;
        }
    };

    if (Platform.OS === 'ios') {
        return (
            <View style={[props.style]}>
                <TouchableWithoutFeedback onPress={openPicker}>
                    <View>
                        {
                            props.label &&
                            <Text size={5} weight={'regular'} style={[SharedStyles.label, getLabelStyleFromType()]}>
                                {props.label || 'Select'}
                            </Text>
                        }
                        <View style={[...InputStyle(), {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }, props.inputFieldStyle]}>
                            <Text
                                style={[SharedStyles.selectInputField, props.inputFieldFontStyle]}>
                                {props.field ? getSelectedValue(props.field.value) : getSelectedValue(props.selectedValue)}
                            </Text>
                            <Icon name={'DownArrow'} width={10} height={10} fill={Theme.base_color_1}
                                  style={{marginRight: 5}}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {
                    validationMessage()
                }
                <Modal visible={showPicker} transparent={true} animationType={'fade'}>
                    <View style={style.iosPickerModal}/>
                    <View style={style.iosPicker}>
                        <TouchableOpacity onPress={close} style={style.cancelContainer}>
                            <Text size={5} style={style.cancelLabel}>{t('general.done')}</Text>
                        </TouchableOpacity>
                        <Picker selectedValue={props.form ? props.form.values[props.field.name] : props.selectedValue}
                                onValueChange={onSelect}>
                            {
                                props.options.map((option, index) => {
                                    return (
                                        <Picker.Item key={option.value} label={option.label} value={option.value}/>
                                    );
                                })
                            }
                        </Picker>
                    </View>
                </Modal>
            </View>
        );
    } else {
        return (
            <View style={[props.style]}>
                <TouchableWithoutFeedback onPress={openPicker}>
                    <View style={style.inputContainer}>
                        {
                            //label
                            props.label &&
                            <Text size={5} weight={'regular'} style={[SharedStyles.label, getLabelStyleFromType()]}>
                                {props.label || 'Select'}
                            </Text>
                        }
                        <View style={[...InputStyle(), {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }, props.inputFieldStyle]}>
                            <Text style={[SharedStyles.selectInputField, props.inputFieldFontStyle]}>
                                {props.field ? props.field.value : props.value}
                            </Text>
                            <Icon name={'DownArrow'} width={10} height={10} fill={Theme.base_color_1}
                                  style={{marginRight: 5}}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {
                    validationMessage()
                }
                <Modal visible={showPicker} transparent={true} animationType={'fade'}>
                    <TouchableOpacity activeOpacity={1} style={style.iosPickerModal} onPress={() => {
                        setShowPicker(false);
                    }}/>
                    <View style={style.androidCardContainer}>
                        <View style={style.androidPicker}>
                            <ScrollView contentContainerStyle={style.androidScroll}>

                                {
                                    props.options.map((option, index) => {
                                        return (
                                            <TouchableHighlight key={option.value} activeOpacity={0.5}
                                                                underlayColor={'#DDD'}
                                                                style={{backgroundColor: isAndroidOptionSelected(option.value) ? '#ddd' : null}}
                                                                onPress={onSelect.bind(this, option.value)}>
                                                <View style={style.androidPickerText}>
                                                    <Text>{option.label}</Text>
                                                </View>
                                            </TouchableHighlight>
                                        );
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
};

SelectInput.defaultProps = {
    disabled: false,
    styleType: 1,
    initialValue: '',
    placeholder: 'Please enter',
};
