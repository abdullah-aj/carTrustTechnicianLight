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
        maxWidth: 500,
    },
    cardContainer:{
        height:"90%",
        width:"52%",
        backgroundColor:Theme.primary_color_2,
        alignSelf:'flex-start',
        alignItems:'center',
        justifyContent:'center',
        marginTop:"4%",
        marginBottom:"2%",
        marginLeft:"5%"
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
        alignItems: 'center',
        marginBottom:20,
        marginTop:20,
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
        width:'18%',
        height:'82%',
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
    loadingOverlay:{
        backgroundColor:'rgba(255,255,255,0.3)',
        width:'100%',
        height:'100%',
        position:'absolute',
        zIndex:3,
        justifyContent:'center'
    },
    modal:{
        height:100
    },

    // modal for tip info
    centeredView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
        marginRight: 30
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 265,
      },
      modalBodyRow: {
        flexDirection: 'row',
      },
      modalBodyPrompt: {
       // width: 650,
        justifyContent: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
      },
      closeButton: {
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
      },

       // ----- camera ----
  zoomButtons: {
    position: 'absolute',
    marginTop: '5%',
    right: 10,
    //width: '100%',
    //height: '100%',
   // alignSelf: 'center',
   // justifyContent: 'flex-start',
   // flexDirection: 'row',
  },
  captureIcon: {
    marginRight: '5%',
    zIndex: 4,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  cameraIconSubContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default style;
