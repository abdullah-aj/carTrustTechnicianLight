import {StyleSheet} from 'react-native';
import Theme from '../../../App.style';

const _inputFieldHeight = 40;
const style = StyleSheet.create({
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
