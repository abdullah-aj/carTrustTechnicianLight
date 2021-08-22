// @flow
import * as React from 'react';
import {Animated, StatusBar, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import style from './style';
import Icon from '../Icons';
import Text from '../Text';
import Theme from '../../App.style';
import Util from '../../util';
import Button_Icon from '../Button.Icon';


type Props = {
    height?: number,
    statusBarColor?: string | 'transparent',
    headerText?: string,
    headerLogo?: boolean,
    leftIcon?: { icon: string, action: ()=>void, fill?: string },
    rightIcon?: Array<{ icon: string, action: ()=>void, fill?: string, bg?: string, type?: 'text' }>,
    animateValue?: any,//used to hide the right icons on scroll,
    style?: any,
    children?: any,
    headerImg: boolean,
    headerImgPath: string,
    type: number
};
export const AppHeader = (props: Props): any => {
    //if we passed a child for the component
    const logo = require('../../assets/icons/user.svg');


    const renderDefaultHeader = (withChild: boolean) => {
        const mainStyles = [style.mainContainerNoChildren];
        if (withChild === true) {
            mainStyles.push({backgroundColor: 'transparent'});
        }
        if (!withChild) {
            mainStyles.push(props.style);
        }
        return (
            <>
                {
                    props.headerImg &&
                    <View style={{flex: 1}}>
                        <Image source={props.headerImgPath}
                               style={{height: '48%', width: '100%', alignSelf: 'center'}} resizeMode="cover"/>
                    </View>

                }

                <View style={mainStyles}>
                    {typeof props.headerLogo && props.headerLogo &&
                        <View style={{flex: 0.2, height: 54, width: 100, alignItems: 'flex-start'}}>
                            <Image source={require("../../assets/icons/logo_white.png")}
                                   style={{height: '100%', width: '50%'}} resizeMode="contain"/>
                        </View>
                    }

                    {
                        typeof props.leftIcon !== 'undefined' ?
                            <TouchableOpacity style={[{flex: 0.1}]} onPress={props.leftIcon.action}>
                                <Icon name={props.leftIcon.icon} width={30} height={30}
                                      fill={props.leftIcon.fill ? props.leftIcon.fill : (props.type === 2 ? Theme.primary_color_2 : Theme.base_color_10)}/>
                            </TouchableOpacity>
                            : <View style={{flex: 0.1}}/>

                    }

                    <Text size={5} weight={"bold"} style={props.type === 2 ? style.headerText2 : style.headerText}>
                        {props.headerText}
                    </Text>
                    <Animated.View style={[style.right_section, {
                        opacity: props.animateValue ? props.animateValue.interpolate({
                            inputRange: [50, 100],
                            outputRange: [0.8, 0],
                        }) : 1,
                    }]}>
                        <View style={style.sub_icons_container}>

                            {
                                typeof props.rightIcon !== 'undefined' ?
                                    props.rightIcon.map((icon, index) => {
                                        if (icon.type === 'text') {
                                            return (
                                                <TouchableOpacity onPress={icon.action} key={index}
                                                                  style={style.sub_icons_action}>
                                                    <Text size={5} style={style.header_subText}>{icon.icon}</Text>
                                                </TouchableOpacity>
                                            );
                                        } else {
                                            return (
                                                <View style={{marginHorizontal: 2}}>
                                                    <Button_Icon key={index} onPress={icon.action} icon={icon.icon}
                                                                 size={70} iconColor={ icon.fill ? icon.fill : Theme.base_color_10}
                                                                 backgroundColor={'transparent'}/>
                                                </View>
                                            );
                                        }
                                    })
                                    : null
                            }
                        </View>
                    </Animated.View>
                </View>
            </>
        );
    };
    if (props.children) {
        return (
            <View style={[{flexDirection: 'column'}, props.style]}>
                <StatusBar barStyle={'light-content'}
                           backgroundColor={`rgba(${Util.Functions.HexToRgb(Theme.body_bg_color_2)},0.8)`}/>
                {
                    typeof props.headerText !== 'undefined' &&
                    renderDefaultHeader(true)
                }
                {/*check if we have title with the children*/}
                <View
                    style={[style.mainContainerWithChildren, {
                        minHeight: typeof props.headerText === 'undefined' ? Theme.header_height : 0,
                        marginTop: typeof props.headerText === 'undefined' ? 0 : 5,
                    }]}>
                    {props.children}
                </View>
            </View>
        );
    } else {
        return (
            <>
                <StatusBar barStyle={'light-content'}
                           backgroundColor={`rgba(${Util.Functions.HexToRgb(Theme.primary_color_2)},1)`}/>
                {
                    renderDefaultHeader()
                }
            </>
        );
    }
};
const styles = StyleSheet.create({
    headerLogo: {}
})
AppHeader.defaultProps = {
    height: Theme.header_height,
};

