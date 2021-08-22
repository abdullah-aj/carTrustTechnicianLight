import {StyleSheet} from 'react-native';
import Theme from "../../App.style";


const style = StyleSheet.create({
    mainContainer: {
        left: 0,
        position: 'absolute',
        zIndex: 100,
        elevation: 100,
        width: '100%',
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        justifyContent: 'flex-end',
        paddingBottom: 20,
        alignItems: 'center',
    },
    text: {
        color: Theme.base_color_10,
        textAlign: 'center',
    }
})

export default style
