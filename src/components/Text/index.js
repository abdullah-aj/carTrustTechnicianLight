// @flow
import React, {Component} from 'react';
import {Text as ReactText, Animated, View} from 'react-native';
import style from './style';
import Theme from '../../App.style';
import Util from '../../util';


type Props = {
    size: number, // from 0 to 20
    weight: 'bold' | 'light' | 'regular',
    color: string,
    withAnimation: boolean,
    numberOfLines?: number,
    underline:boolean,
    style: *,
    children: *
};

class Text extends Component<Props> {

    static defaultProps = {
        size: 0,
        withAnimation: false,
        color:Theme.base_color_1
    };

    fontWeight() {
        switch (this.props.weight) {
            case 'light':
                return style.light;
            case 'regular':
                return style.regular;
            case 'bold':
                return style.bold;
            default:
                return style.regular;
        }
    }

    render() {
        const {style, size, ...rest} = this.props;
        if (this.props.withAnimation) {
            return (
                <Animated.Text {...rest}
                               style={[{
                                   textAlign: 'center',
                                   color: this.props.color,
                               }, this.fontWeight(), ...style.length ? style : [style], {fontSize: Util.Functions.FontSize(size)}]}>
                    {this.props.children}
                </Animated.Text>
            );
        } else {
            return (
                <>
                <ReactText {...rest} numberOfLines={this.props.numberOfLines}
                           style={[{textAlign: 'left', color:this.props.color},
                               this.fontWeight(), {fontSize: Util.Functions.FontSize(size)}, ...style && style.length ? style : [style]]}>
                    {this.props.children}
                </ReactText>
                    {this.props.underline && this.props.underline===true && <View style={{width:80, alignSelf:'flex-start', height:4, backgroundColor:Theme.primary_color_3, marginTop:20}}></View>
                    }
                </>
            );
        }
    }
}

export default Text;



