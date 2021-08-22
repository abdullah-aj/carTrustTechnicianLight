import {StyleSheet} from 'react-native';
import Theme from "../../App.style";
import Util from "../../util";


const style = StyleSheet.create({
    otpMainContainer:{
      backgroundColor:'rgba(0,0,0,0.8)',
        width:100,
        height:'100%',
        position:'absolute'
    },
    textContainer: {
        marginTop: '5%',
        justifyContent: 'space-between',
        paddingLeft: '10%',
        paddingRight: '10%',
        alignSelf:'center',
        alignItems:'flex-end'
    },
    header: {
        color: Theme.base_color_10,
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 0
    },
    message: {
        color: Theme.base_color_10,
        textAlign: 'center',
        letterSpacing: 0,
        marginBottom: 20
    },
    inputFieldsMainContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '70%'
    },
    inputField: {
        display: 'none',
    },
    otpFields: {
        backgroundColor: `rgba(${Util.Functions.HexToRgb(Theme.base_color_10)},0.1)`,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    otpText: {
        color: Theme.base_color_10,
    },
    iconContainerView:{
        backgroundColor:Theme.primary_color_2,
        justifyContent:'space-between',
        alignSelf:'center',
        alignItems:'flex-end',
        marginTop:0,
        flexDirection: 'row',
    },
    lottieIcon:{

    },
})

export default style
