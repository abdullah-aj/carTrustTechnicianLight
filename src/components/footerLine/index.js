import React from 'react'
import {View, TouchableOpacity, Dimensions} from 'react-native'
import style from './style';
import Theme from "../../App.style";

type Props = {
    style?: *,
    onPress: ()=>void,
}

const FooterLine = (props:Props) => {
    const {style: customStyle} = props
    const windowWidth = Dimensions.get('window').width;
    return(
        <View style={props.style? props.style:style.lineViewContainer}>
            <View style={{backgroundColor: Theme.primary_color_3, height:8, width:Dimensions.get('window').width/3}}></View>
            <View style={{backgroundColor: Theme.primary_color_1, height:8, width:Dimensions.get('window').width/3}}></View>
            <View style={{backgroundColor: Theme.primary_color_2, height:8, width:Dimensions.get('window').width/3}}></View>
        </View>
    )
}


export default FooterLine
