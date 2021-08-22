// @flow
import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions, Animated, Easing, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import style from './style'
import Text from "../Text";
import {ClearToast, SetToast} from "../../redux/actions/setToast";
import type {ToastType} from "../../redux/states/toasts";
import {hasNotch} from "react-native-device-info";

type Props = {
    Toast: ToastType
};

const CustomToast = (props: Props) => {
    const _screenHeight = Dimensions.get('window').height;
    const _animationValue = useRef(new Animated.Value(0)).current;
    const _timeOutVar = useRef(null);
    const viewHeight = hasNotch() ? 100 : 80;

    useEffect(() => {
        if (props.Toast !== null) {
            _animationValue.setValue(0);
            Animated.timing(_animationValue, {
                toValue: 1,
                easing: Easing.in(Easing.elastic(2)),
                duration: 500,
                useNativeDriver: true
            }).start(() => {
                _timeOutVar.current = setTimeout(() => {
                    Animated.timing(_animationValue, {
                        toValue: 0,
                        easing: Easing.out(Easing.elastic(2)),
                        duration: 500,
                        useNativeDriver: true
                    }).start(() => {
                        props.ClearToast();
                    });
                }, 4000);

            });
        }
    }, [props.Toast]);

    const close = () => {
        clearTimeout(_timeOutVar.current);
        Animated.timing(_animationValue, {
            toValue: 0,
            easing: Easing.out(Easing.elastic(2)),
            duration: 500,
            useNativeDriver: true
        }).start()
    };

    const getLayout = React.useCallback(({nativeEvent}) => {
        // console.log('-----',nativeEvent);
    }, []);

    return (
        <View style={{flex: 1}}>
            {props.children}
            <TouchableWithoutFeedback onPress={close}>
                <Animated.View onLayout={getLayout}
                               style={[{backgroundColor: props.Toast && (props.Toast.status === 'danger' ? '#F64C54' : props.Toast.status === 'success' ? '#C0CE00' : '#F69E4C')}, style.mainContainer, {
                                   height: viewHeight,
                                   top: 0,
                                   opacity: _animationValue,
                                   transform: [{
                                       translateY: _animationValue.interpolate({
                                           inputRange: [0, 1],
                                           outputRange: [-viewHeight, 0]
                                       })
                                   }]
                               }]}>
                    <Text size={5} weight={'light'} style={style.text}>{props.Toast ? props.Toast.message : ''} </Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
};


const mapActionToProps = (dispatch) => {
    return bindActionCreators({SetToast, ClearToast}, dispatch);
};
const mapStateToProps = ({Toast}) => {
    return ({Toast})
};
export default connect(mapStateToProps, mapActionToProps)(CustomToast);
