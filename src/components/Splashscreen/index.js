// @flow
import * as React from 'react';
import {View, Dimensions, Image} from 'react-native';
import Icon from "../Icons";
import Theme from "../../../src/App.style";
import {Loader} from "../Loader";

type Props = {};
export const Splashscreen = (props: Props) => {
    const {height, width} = Dimensions.get('window');
    return (
        <View style={{justifyContent: 'center', height: height, width: width, backgroundColor:Theme.primary_color_2}}>
            <Icon name={'Animation_Splashscreen'} style={{height: height, width: width}}/>
            <Icon name={'LOGO'} width={140} height={140} style={{width: 200, height: 200, alignSelf: 'center', position: 'absolute'}}/>
            <Image source={require('../../assets/icons/logo_color.png')}
                   style={{width: 180, height: 200, alignSelf: 'center', position: 'relative', marginBottom:"18%"}} resizeMode={'contain'}/>

           <Loader visible={true} overlay={false}/>
        </View>
    );
};
