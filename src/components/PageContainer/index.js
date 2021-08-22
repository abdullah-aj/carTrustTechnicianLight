// @flow
import * as React from 'react';
import {View} from 'react-native';
import style from './style';
import Theme from "../../App.style";


type PageContainerType = {
    bgColor: string,
    style?: *,
    children: *,
}
const PageContainer = (props: PageContainerType): * => {
    return (
        <View style={[style.container, {backgroundColor: props.bgColor}, props.style]}>
            {
                props.children
            }
        </View>
    );
};

export default PageContainer
