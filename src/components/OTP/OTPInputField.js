// @flow
import React, {Component, useState, useEffect, useRef, useImperativeHandle} from 'react';
import {View, TextInput, Animated, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import style from './style';
import Text from '../Text';
import Theme from '../../App.style';

export type Props = {
    count: number,
    animateOnClear: boolean,
    resendAction?: ()=>vodi,
    onSubmit: (value: string)=>Promise<*>
}

type States = {}

export class OTPInputField extends Component<Props, States> {
    static defaultProps: * = {
        count: 4,
        animateOnClear: true,
    };

    inputRef: * = React.createRef();
    animationVariables: Array<Object> = [];
    wrongAnimation: * = new Animated.Value(0);
    mountAnimation: * = new Animated.Value(0);

    constructor(props: Props) {
        super(props);
        this.state = {
            animationVariables: [],
            passcode: '',
        };
    }

    componentDidMount(): * {
        //create animations fields variables
        const animationsList = [];
        for (let x = 0; x < this.props.count; x++) {
            animationsList[x] = new Animated.Value(x === 0 ? 1 : 0);
        }

        //set animation fields in the state and start mount animation.
        this.setState({
            animationVariables: animationsList,
        }, () => {
            Animated.timing(this.mountAnimation, {toValue: 1, duration: 500, useNativeDriver: false}).start();
        });

    }


    /**
     * called when the user start typing. when the user will type we have to animation all the fields
     * we will make the current input view bigger and the rest will be smaller
     * @param value
     * @returns {Promise<void>}
     */
    onInputChange: * = async (value): * => {
        const animationList = [];
        // loop over all fields views and create animation for each one based on the field status(active or not)
        for (let x = 0; x < this.props.count; x++) {
            animationList.push(
                Animated.timing(this.state.animationVariables[x], {
                    toValue: x === value.length ? 1 : 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            );
        }

        this.setState({passcode: value});
        if (value.length === this.props.count) {
            this.onSubmit(value);
        }
        //start the animation in parallel
        Animated.parallel(animationList).start();
    };

    inputPressed: * = () => {
        this.inputRef.current.focus();
    };

    onSubmit: * = async (data) => {
        try {
            await this.props.onSubmit(data);
        } catch (e) {
            // will reject the promise in case we need to clear the fields.
            console.log(e);
            this.clearFields(true);
        }
    };

    clearFields: * = () => {
        this.setState({passcode: ''});
        //make first input view active
        Animated.timing(this.state.animationVariables[0], {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();

        //check if we have to do clear animation (shake animation)
        if (this.props.animateOnClear === true) {
            Animated.loop(Animated.timing(this.wrongAnimation, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            }), {iterations: 2}).start();
        }
    };

    render() {
        return (
            <>
                <TouchableWithoutFeedback onPress={this.inputPressed}>
                    <Animated.View style={[style.inputFieldsMainContainer, {
                        opacity: this.mountAnimation,
                        transform: [{
                            translateX: this.wrongAnimation.interpolate({
                                inputRange: [0, 0.33, 0.66, 1],
                                outputRange: [0, -20, 20, 0],
                            }),
                        }],
                    }]}>
                        {
                            this.state.animationVariables.map((animation, index) => {
                                return (
                                    <Animated.View key={index} style={[style.otpFields, {
                                        transform: [{
                                            scale: animation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.2],
                                            }),
                                        }],
                                    }]}>
                                        <Text size={12} weight={'regular'} style={style.otpText}>
                                            {this.state.passcode[index]}
                                        </Text>
                                    </Animated.View>
                                );
                            })
                        }
                        <TextInput ref={this.inputRef} caretHidden={true} maxLength={this.props.count}
                                   editable={true} value={this.state.passcode}
                                   onChangeText={this.onInputChange} style={style.inputField}
                                   blurOnSubmit={false}
                                   autoFocus={true} keyboardType={'numeric'}/>
                    </Animated.View>
                </TouchableWithoutFeedback>
                {
                    typeof this.props.resendAction === 'function' &&
                    <TouchableOpacity onPress={this.props.resendAction}>
                        <Text style={{marginTop: 30, color: Theme.base_color_10, textAlign: 'center'}} size={8}>
                            Resend
                        </Text>
                    </TouchableOpacity>
                }
            </>
        );
    }
}
