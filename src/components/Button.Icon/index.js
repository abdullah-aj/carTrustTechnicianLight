// @flow
import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import style from './style';
import Icon from '../Icons';
import Theme from '../../App.style';


type Props = {
    onPress: ()=>void,
    icon: string,
    size: number,
    iconColor?: string,
    backgroundColor?: string,
    style?: any,
};
const Button_Icon = (props: Props) => {
    return (
        <TouchableOpacity onPress={props.onPress}
                          style={[style.mainContainer, {
                              width: props.size,
                              height: props.size,
                              backgroundColor: props.backgroundColor,
                              borderRadius: props.size / 2,
                          }]}>
            <Icon name={props.icon} width={props.size * 0.4} height={props.size * 0.4} fill={props.iconColor}/>
        </TouchableOpacity>
    );
};

Button_Icon.defaultProps = {
    iconColor: Theme.base_color_10,
    backgroundColor: Theme.primary_color_1,
};

export default Button_Icon;
