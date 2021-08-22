// @flow
import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../Text';
import Theme from '../../App.style';


type Props = {
    text: string,
    action(): void,
    size: number,
    color?: string,
    weight?: 'regular' | 'light' | 'bold',
    style?: any
};
const Button_Text = (props: Props) => {
    return (
        <TouchableOpacity onPress={props.action}>
            <Text size={props.size} weight={props.weight} color={props.color} style={props.style}>{props.text}</Text>
        </TouchableOpacity>
    );
};

Button_Text.defaultProps = {
    weight: 'regular',
    color: Theme.base_color_1,
};

export default Button_Text;
