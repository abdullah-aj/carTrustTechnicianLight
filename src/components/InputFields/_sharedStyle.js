// @flow
import {StyleSheet, I18nManager} from 'react-native';
import Theme from "../../App.style";
import style from "./TextInputField/style";
import Util from "../../util";


export const inputFieldHeight = 50;
export const SharedStyles: any = StyleSheet.create({
    borderColorValid: {
        borderColor: Theme.primary_color_1
    },
    borderColorInValid: {
        borderColor: Theme.secondary_color_2
    },
    shadowInvalid: {
        shadowColor: Theme.secondary_color_3,
        shadowOpacity: 0.5,
    },
    focusedInput: {
        borderWidth: 1,
        borderColor: Theme.primary_color_2,
        // shadowOpacity: 0.5,
    },
    disabledInput: {
        opacity: 0.8
    },
    phoneInput: {
        paddingLeft: 30,
    },
    InputField: {
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        opacity: 1,
        // elevation: 1,
        paddingLeft: 15,
        paddingRight:5,
        height: inputFieldHeight,
        fontSize: Util.Functions.FontSize(1),
        borderRadius: 0,
        paddingHorizontal: 15,
        borderColor:Theme.base_color_8,
        textAlign:I18nManager.isRTL?'right':'left'
    },
    selectInputField: {
        fontSize: Util.Functions.FontSize(1),
        fontWeight: '300'
    },
    label: {
        textAlign: 'left',
        marginBottom: 8,
        marginLeft: 2
    },
    errorMessage: {
        marginTop: 5,
        marginLeft: 3,
        textAlign: 'left',
        color: Theme.secondary_color_2
    },
})

/**
 * get Input field main style based on the type.
 * @param styleType
 * @returns {{backgroundColor: string, color: string, borderWidth: number, shadowColor: string}}
 */
export const GetMainFieldType = (styleType: number): any => {
    switch (styleType) {
        case 1:
            return ({
                color: Theme.base_color_3,
                backgroundColor: Theme.base_color_10,
                shadowColor: Theme.supporting_color_1,
                borderWidth: 1,
                justifyContent: 'center',
            })
        default:
            return ({
                color: Theme.base_color_3,
                backgroundColor: Theme.base_color_10,
                shadowColor: Theme.supporting_color_1,
                borderWidth: 1,
                justifyContent: 'center',
            })
    }
}


/**
 * Style input field
 * @returns {[*]}
 */
export const StyleFieldBasedOnProps = (isFocused: boolean, styleType: number, isInvalid: boolean, isPhoneField: boolean, isDisabled: boolean): any => {
    const result = [SharedStyles.InputField, GetMainFieldType(styleType)];
    if (isFocused) {
        result.push(SharedStyles.focusedInput);
    }

    if (isDisabled === true) {
        result.push(SharedStyles.disabledInput);
    }

    if (isPhoneField) {
        result.push(SharedStyles.phoneInput);
    }

    if (isInvalid === true) {
        result.push(SharedStyles.borderColorInValid, SharedStyles.shadowInvalid);
    }

    return result;
}


/**
 * get field label style
 * @param styleType
 * @returns {{color: string}}
 * @constructor
 */
export const FieldLabelStyle = (styleType: any): any => {
    switch (styleType) {
        case 1:
            return ({
                color: Theme.base_color_3,
            })
        default:
            return ({
                color: Theme.base_color_3,

            })
    }
}
