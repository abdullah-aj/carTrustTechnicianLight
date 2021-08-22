import React from 'react';
import Icon from "../Icons";
import {View} from 'react-native';
import style from './style'
import Text from '../Text';
import Theme from "../../App.style";


type Props = {
    icon: string,
    title:string,
    color: string

}
const IconAndTitle = (props:Props) => {
    return (
        <View style={style.iconAndTitleContainer}>
            <View style={style.iconCircle}>
                <Icon name={props.icon} width={50} height={50} fill={props.color} />
            </View>
            <View>
                <Text weight={"bold"} underline={true} size={6} color={Theme.base_color_10}>
                    {props.title}
                </Text>
            </View>
        </View>
    );
};

export default IconAndTitle;
