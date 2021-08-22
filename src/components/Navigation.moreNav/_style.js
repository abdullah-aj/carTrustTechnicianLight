import {StyleSheet} from 'react-native';
import Theme from "../../App.style";


const style = StyleSheet.create({
    //========== More Nav ===========
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    mainTitleWrapper: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,

    },
    iconAndLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius:5,
        flex: 1,
        justifyContent: 'flex-start',
    },
    activeTitle: {
        backgroundColor: Theme.primary_color_2,
    },
})

export default style
