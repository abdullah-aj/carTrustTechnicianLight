// @flow
import * as React from 'react';
import {TouchableWithoutFeedback, View, Modal, TouchableOpacity} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FieldLabelStyle, SharedStyles, StyleFieldBasedOnProps} from '../_sharedStyle';
import style from './style';
import Text from '../../Text';
import Icon from '../../Icons';
import Theme from '../../../App.style';
import {useTranslation} from 'react-i18next';

type Props = {
    label: string,
    name: string,
    form?: any,
    field?: any,
    value?: string,
    styleType: any,
    validationMessage: string,
    onChange: (date: Date)=>void,
    initialDate: Date,
    maxAllowed: { value: number, type: 'days' | 'months' },
    minAllowed: { value: number, type: 'days' | 'months' },
    disabled: boolean,
};
export const DatePicker = (props: Props) => {
    const {t} = useTranslation();
    const [date, setDate] = React.useState(null);
    const [show, setShow] = React.useState(false);


    /**
     * Style input field
     * @returns {[*]}
     */
    const InputStyle = () => {
        const isInvalid: any = props.form && props.form.errors && props.form.errors[props.field.name] && props.form.touched[props.field.name] === true;
        return StyleFieldBasedOnProps(false, props.styleType, isInvalid, false, props.disabled === true);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };


    const showDatepicker = () => {
        setShow(true);
        if (props.form) {
            props.form.setFieldTouched(props.field.name, true);
        }
    };

    const closeDatePicker = React.useCallback(() => {
        //todo validate dates. implement max and min validation
        if (props.form) {
            props.form.setFieldValue(props.field.name, moment(date));
            props.form.setFieldTouched(props.field.name, true);
        } else {
            props.onChange(moment(date));
        }
        setShow(false);
    }, [date]);

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

    return (
        <>
            <View style={[props.style]}>
                <TouchableWithoutFeedback onPress={showDatepicker}>
                    <View>
                        {
                            props.label &&
                            <Text size={5} weight={'regular'} style={[SharedStyles.label, getLabelStyleFromType()]}>
                                {props.label}
                            </Text>
                        }
                        <View style={[...InputStyle(), {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }, props.inputFieldStyle]}>
                            {
                                date === null && !props.field?.value && !props.value?
                                    <Text
                                        style={[SharedStyles.selectInputField, {color: Theme.base_color_7}, props.inputFieldFontStyle]}>
                                        {props.placeholder}
                                    </Text>
                                    :
                                    <Text style={[SharedStyles.selectInputField, props.inputFieldFontStyle]}>
                                        {
                                            props.field ? moment(props.field.value).format(`DD/MM/YYYY`) : props.value
                                        }
                                    </Text>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {
                    validationMessage()
                }
            </View>
            {

                <Modal visible={show} transparent={true} animationType={'fade'}>
                    <View style={style.iosPickerModal}/>
                    <View style={style.iosPicker}>
                        <TouchableOpacity onPress={closeDatePicker} style={style.cancelContainer}>
                            <Text size={5} style={style.cancelLabel}>
                                {t('general.done')}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            value={date || props.initialDate}
                            mode={'date'}
                            is24Hour={true}
                            display="spinner"
                            onChange={onChange}
                            style={{flex: 1}}
                        />
                    </View>
                </Modal>
            }
        </>
    );
};

DatePicker.defaultProps = {
    placeholder: 'dd-mm-yyyy',
    initialDate: new Date(),
};
