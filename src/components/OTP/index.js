// @flow
import * as React from 'react';
import {Animated, Dimensions, View} from 'react-native';
import style from './style';
import Text from "../Text";
import {OTPInputField} from "./OTPInputField";
import {AppHeader} from "../AppHeader";
import {Loader} from "../Loader";
import PageContainer from "../PageContainer";
import Theme from "../../App.style";
import Icon from "../Icons";


type OTPComponentType = {
    title: string,
    message: string,
    submitting: boolean,
    onSubmit: (otp: string)=>Promise<{}>,
    animationStart: 'bottom' | 'right',
    close: ()=>void,
}
type State = {
    showOTPFields: boolean,
};

class OTP extends React.Component<OTPComponentType, State> {
    static defaultProps = {
        title: 'VERIFICATION CODE',
        message: '',
        animationStart: 'right',
        submitting: false,
    };
    _screenWidth = Dimensions.get('window').width;
    _screenHeight = Dimensions.get('window').height;
    _animationValue = new Animated.Value(0);
    _animationTime = 500;

    otpFieldsRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            showOTPFields: false,
        }
    }


    componentDidMount(): * {
        this._animationValue.setValue(0);
        Animated.timing(this._animationValue, {
            toValue: 1,
            duration: this._animationTime,
            useNativeDriver: true
        }).start(() => {
            this.setState({showOTPFields: true});
        });
    }


    close = () => {
        this.setState({showOTPFields: false});
        Animated.timing(this._animationValue, {
            toValue: 0,
            duration: this._animationTime,
            useNativeDriver: true
        }).start(() => {
            this.props.close();
        });
    };


    render() {
        return (
            <>
                <AppHeader headerText={""} leftIcon={{icon: "Back", action: this.close}}/>
                    <PageContainer bgColor={Theme.primary_color_2}>

                        <View style={style.textContainer}>


                            <Text size={5} weight={'regular'}
                                  style={[style.message]}>
                                {
                                    this.props.message
                                }
                            </Text>
                        </View>
                        {this.state.showOTPFields &&
                        <OTPInputField onSubmit={this.props.onSubmit} count={4} ref={this.otpFieldsRef}/>}
                </PageContainer>
                    <Loader visible={this.props.submitting}/>

            </>
        );
    };
};


export default OTP
