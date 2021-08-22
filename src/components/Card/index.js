import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import style from './style';

type Props = {
    style?: *,
    onPress: ()=>void,
}

const Card = (props:Props) => {
    const {style: customStyle} = props

    if (props.onPress) {
        return (
            <TouchableOpacity style={[style.mainContainer, customStyle]} onPress={props.onPress}>
                {props.children}
            </TouchableOpacity>
        )

    } else {
        return (
            <View style={[style.mainContainer, customStyle]}>
                {props.children}
            </View>
        )
    }
}


export default Card
