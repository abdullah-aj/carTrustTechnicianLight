import {StyleSheet} from 'react-native';
import Theme from '../../App.style';


const style = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    formContainer:{
        justifyContent:'flex-start',
        alignItems:'flex-start',
        maxWidth: 500,
    },
    cardContainer:{
        height:100,
        width:"90%",
        backgroundColor:Theme.base_color_10,
        alignSelf:'flex-start',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:"0%",
        marginBottom:"2%",
        marginLeft:"5%",
        flexDirection:'row',
        padding:30
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
    iconTxtContainer:{
        flexDirection: 'row',
        alignItems:'center',
        alignSelf:'center'
    },
    vehicleSectionHeading:{
        height:100,
        width:"80%",
        padding:0,
        marginLeft:"5%",
        marginTop:"2%"
    },
    vehiclesCards:{
        width:"90%",
        flexDirection:'row',
        marginLeft:"5%",
        marginRight:"5%",
    },
    addNewBtnContainer:{
        justifyContent:'center',
        alignSelf:'center',
        marginTop:"2%"
    },
    cardsStyle:{
        alignSelf:'flex-end',
        width:'70%'
    }

});

export default style;
