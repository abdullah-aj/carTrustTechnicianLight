import {StyleSheet} from 'react-native';
import Theme from "../../../App.style";
import Util from "../../../util";

const _inputFieldHeight = 40;
const style = StyleSheet.create({
    inputLabel: {
        color: Theme.text_label,
    },
    inputLabelActive: {
        position: 'absolute',
        top: 0,
        marginLeft: 5,
        color: '#5BA646',
        fontSize: 13,
    },
    inputValue: {
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 5,
        opacity: 1,
        elevation: 1,
        paddingLeft: 5,
        height: _inputFieldHeight,
        fontSize: Util.Functions.FontSize(4),
        borderRadius: 4,
        paddingHorizontal: 15,
    },
    validationMessage: {
        marginTop: 5,
        marginLeft: 10,
        fontSize: 11,
        color: '#F64C54',
    },
    iosPickerModal: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iosPicker: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: Theme.base_color_8,
    },
    cancelContainer: {
        alignItems: 'flex-end',
        backgroundColor: Theme.base_color_10,
    },
    cancelLabel: {
        color: 'blue',
        padding: 10,
    },
    androidCardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    androidPicker: {
        maxHeight: '80%',
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    androidScroll: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    androidPickerText: {
        alignItems: 'flex-start',
        padding: 10,
    },
});

export default style;
