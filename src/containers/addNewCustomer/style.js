import {StyleSheet} from 'react-native';
import Theme from '../../App.style';


const style = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    formContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    cardContainer:{
        height:"90%",
        width:"50%",
        backgroundColor:"#fff",
        alignSelf:'center',
        justifyContent:'center',
        marginTop:"4%",
        marginBottom:"2%"
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
    hrContainer:{
      flexDirection: 'row',
      justifyContent:'space-around',
        alignItems: 'center'
    },
    hr:{
        borderBottomWidth:1,
        borderBottomColor:Theme.base_color_8,
        marginTop: 20,
        marginBottom:20,
        width: '30%'

    },
    qrIcon:{
        position:'absolute',
        marginTop:10,
        right:20
    },
    lottieIcon:{
        position:'absolute',
        right:12,
        width:28
    },
    iconContainerView:{
      backgroundColor:Theme.primary_color_2,
        width:'18%',
        height:'82%',
        borderBottomRightRadius:50,
        borderTopRightRadius:50,
        position:'absolute',
        justifyContent:'center',
        alignSelf:'flex-end'
    },
    imagesContainer:{
        width:'80%',
        marginTop:"5%",
        flexDirection:'row',
        flexWrap: 'wrap',
        justifyContent:'center'
    },
    img:{
        margin:8,
    },
    btnContainer:{
        justifyContent: 'center',
        width:'30%'
    },
    cameraContainer:{
        width:"100%",
        height:"100%",
        position:'absolute',
        zIndex: 2,
        justifyContent:'center',
        alignSelf:'center'
    },
    cameraIconContainer:{
        height:300,
        justifyContent:'space-between',
        padding:20,
    },
    captureIcon:{
        marginRight: "5%",
        zIndex: 4,
        alignSelf:'flex-end',
        padding:10
    },
    takeImageMessageView:{
        alignSelf:'center',
        justifyContent:'center',
        backgroundColor:'rgba(255,255,255,0.5)',
        opacity:0.5,
        padding:10,
        borderRadius:10
    },
    capture: {
        color: "black",
        fontSize:20,
        alignSelf:'center'
    },
    iconCenter:{
        backgroundColor:'rgba(0,0,0,0.4)',
        alignSelf:'center',
        justifyContent:'center',
        padding:20,
        margin:10,
        position:'absolute',
        width:'100%',
        height:'100%',
        overflow:'hidden',
        borderRadius:8
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
    },
    flipButton: {
        flex: 0.3,
        height: 50,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 3,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipText: {
        color: 'white',
        fontSize: 20,
        padding:10
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    zoomButtons:{
        position:'absolute',
        marginTop:"5%",
        width:'100%',
        height:'100%',
        alignSelf:'center',
        justifyContent:'flex-start',
        flexDirection:'row'
    },
    loadingOverlay:{
        backgroundColor:'rgba(255,255,255,0.3)',
        width:'100%',
        height:'100%',
        position:'absolute',
        zIndex:3,
        justifyContent:'center'
    }
});

export default style;
