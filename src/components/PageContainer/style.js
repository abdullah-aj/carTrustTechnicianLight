import {StyleSheet} from 'react-native';
import Theme from "../../App.style";


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.body_bg_color_1,
        flexDirection: 'column',
        paddingLeft: Theme.page_padding,
        paddingRight: Theme.page_padding
    }
})

export default style
