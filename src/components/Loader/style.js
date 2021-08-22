import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 9999,
    },
    transparentMainContainer:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 9999,
    },
    insideContainer: {
        width: 500,
        height: 100,
        borderRadius: 5,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    mainContainerSM: {
        // position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 9999,
    },
    insideContainerSM: {
        width: 500,
        height: 250,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ffffff'
    }

});

export default style;

