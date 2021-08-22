import {StyleSheet} from 'react-native';
import Theme from "../../App.style";

const btHeight = 50;
const style = StyleSheet.create({
    mainContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: btHeight,
        borderRadius: 4
    },
    primaryContainer: {
        borderColor: Theme.primary_color_1,
        borderWidth: 0,
        backgroundColor: Theme.primary_color_1,
        shadowColor: Theme.base_color_6,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 1
    },
    secondaryContainer: {
        borderColor: Theme.primary_color_1,
        borderWidth: 0,
        backgroundColor: Theme.supporting_color_3,
        shadowColor: Theme.base_color_6,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 1
    },
    tertiaryContainer: {
        borderColor: Theme.primary_color_2,
        borderWidth: 1,
        backgroundColor: 'transparent',
        shadowColor: Theme.secondary_color_2,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0,
        shadowRadius: 3,
        elevation: 1
    },
    quaternaryContainer: {
        borderColor: '#fff',
        borderWidth: 1,
        backgroundColor: 'transparent',
        shadowColor: Theme.secondary_color_2,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 1
    },
    greyContainer: {
        borderColor: '#fff',
        borderWidth: 1,
        backgroundColor: 'transparent',
        shadowColor: Theme.base_color_6,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 1
    },
    iconBtn: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        shadowOpacity: 0,
    },
    disabled: {
        opacity: Theme.disabled_opacity,
        backgroundColor: Theme.base_color_8,
        color: Theme.base_color_3
    }

});
export default style;
