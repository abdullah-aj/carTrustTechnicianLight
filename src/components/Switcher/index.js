// @flow
import React, {useEffect} from 'react';
import {Switch, StyleSheet} from 'react-native'
import Theme from "../../App.style";


type Props = {
    name?: string,
    form?: any,
    field?: any,
    style?: object,
    value: Boolean,
    upperFunction: ()=>void
}


const Switcher = (props: Props) => {
    const {style, value} = props


    const onChange = React.useCallback((value) => {
        if (props.form) {
            props.form.handleChange(props.field.name)(value === true?'true':'false');
        } else {
            props.upperFunction(value);
        }
    }, []);


    const currentValue = ()=>{
        return (props.field ? props.field.value === 'true' : props.value)
    }
    return (
        <Switch
            style={[style, styles.switch]}
            trackColor={{false: Theme.base_color_8, true: Theme.primary_color_2}}
            thumbColor={Theme.base_color_10}
            ios_backgroundColor={Theme.base_color_7}
            onValueChange={onChange}
            value={currentValue()}
        />)
}
Switcher.defaultProps = {
    style: {},
    value: false,
    upperFunction: (value) => console.log(value)
};


const styles = StyleSheet.create({
    switch: {
        transform: [
            {scale: 1},
        ]
    }
})
export default Switcher;
