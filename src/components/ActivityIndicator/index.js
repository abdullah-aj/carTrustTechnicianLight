// @flow
import * as React from 'react';
import {View, ActivityIndicator as Loader} from 'react-native';
import Theme from '../../App.style';


type Props = {};
export const ActivityIndicator = (props: Props) => {
    return (
        <Loader {...props} color={Theme.primary_color_1}/>
    );
};
