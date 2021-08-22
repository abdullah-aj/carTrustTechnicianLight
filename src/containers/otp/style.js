import {StyleSheet} from 'react-native';
import Theme from '../../App.style';


const style = StyleSheet.create({
    otpFieldContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center'
    },
    mainContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    formContainer:{
        justifyContent:'center',
        alignItems:'center',
        maxWidth: 500,
    },
    cardContainer:{
        height:"94%",
        width:"52%",
        backgroundColor:Theme.primary_color_2,
        alignSelf:'flex-start',
        alignItems:'center',
        justifyContent:'center',
        marginTop:"1%",
        marginBottom:"2%",
        marginLeft:"5%",
    },
    cardContainerLarge:{
        height:"92%",
        width:"90%",
        backgroundColor:"#fff",
        alignSelf:'center',
        justifyContent:'flex-start',
        alignItems:'center',
        marginTop:"2%"
    },
    field:{
        width:"100%",
        margin:10,
    },
    iconContainerView:{
        backgroundColor:Theme.primary_color_2,
        justifyContent:'space-between',
        alignSelf:'center',
        alignItems:'flex-end',
        marginTop:0,
        flexDirection: 'row',
        position:'absolute'
    },
    lottieIcon:{
        width:80,
        height:90
    },
});

export default style;
