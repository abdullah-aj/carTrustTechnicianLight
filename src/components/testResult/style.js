import {StyleSheet} from 'react-native';
import Theme from "../../App.style";


const style = StyleSheet.create({

    mainCard:{
      backgroundColor: Theme.primary_color_2,
      marginTop:Theme.page_margin_for_transparent_header,
        width: "90%",
        height: "70%",
        alignSelf:'center',
        borderRadius: Theme.card_border_radius,
    },
    iconAndTitleContainer: {
        flexDirection:'row',
        alignItems: "center"
    },
    iconCircle:{
        borderRadius:100,
        backgroundColor:Theme.base_color_10,
        justifyContent:'center',
        alignItems:'center',
        height:80,
        width:80,
        marginRight:"2%"
    },
    halvesContainer:{
        flexDirection: "row",
        marginLeft:100
    }
})
export default style
