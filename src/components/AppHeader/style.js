import {StyleSheet} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import Theme from "../../App.style";
import {Util} from "../../util";


const header_height = Theme.header_height;
const style = StyleSheet.create({
    mainContainerWithChildren: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        minHeight: header_height,
        paddingLeft: Theme.page_padding,
        paddingRight: Theme.page_padding
    },
    mainContainerNoChildren: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        backgroundColor: 'transparent',
        position:'absolute',
        paddingLeft: Theme.page_padding,
        paddingRight: Theme.page_padding,
        height: header_height,
        zIndex:10
    },
    headerText: {
        color: Theme.base_color_10,
        flex: 1,
        textAlign: 'center',
        marginLeft: 0,
        textTransform: 'uppercase'

    },
    headerText2: {
        color: Theme.primary_color_2,
        flex: 1,
        textAlign: 'left',
        marginLeft: 0,
        textTransform: 'uppercase'
    },

    right_section: {
        flex: 1,
        flexDirection: 'row',
    },
    sub_icons_container: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    sub_icons_action: {
        marginLeft: 5,
        padding: 5,
        paddingBottom: 0
    },
    header_subText: {
        color: Theme.base_color_10
    }

});

export default style
