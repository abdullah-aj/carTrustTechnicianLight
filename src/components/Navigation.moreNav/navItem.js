// @flow
import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import style from './_style';
import Icon from '../Icons';
import Theme from '../../App.style';
import Text from '../Text';

type Props = {
    name: string,
    index: number,
    onPress: ()=>void,
    isFocused: boolean,
    iconName: string,
    iconColor?: string,
    label: string,
    otherSideLabel: string

};
export const Navigation_MoreNav_Item = (props: Props): any => {
    const {name, onPress, iconName, isFocused, iconColor} = props;
    return (
        <TouchableOpacity key={name}
                          onPress={onPress}
                          style={[style.mainTitleWrapper]}>
            <View style={[style.iconAndLabel, isFocused ? style.activeTitle : null]}>
                <Icon
                    name={iconName}
                    width={25}
                    height={25}
                    fill={iconColor ? iconColor : isFocused ? Theme.base_color_10 : Theme.primary_color_2}
                />
                <Text size={5}
                      style={{marginLeft: 15, color: isFocused ? Theme.base_color_10 : Theme.base_color_4}}>
                    {props.label}
                </Text>
            </View>
            <Text size={4} style={{color: Theme.primary_color_1, marginRight: 30,}}>
                {props.otherSideLabel ? props.otherSideLabel : ''}
            </Text>
        </TouchableOpacity>
    );
};
