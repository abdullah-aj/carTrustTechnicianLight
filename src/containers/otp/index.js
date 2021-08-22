// @flow
import * as React from 'react';
import {View, Image, LogBox, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import Button from '../../components/Button';
import AP from "../../api";
import Card from '../../components/Card'
import {useEffect, useRef, Component} from "react";
import PageBGArtwork from "../../components/PageBGArtwork";
import Button_Text from "../../components/Button.text";
import Icon from "../../components/Icons";



type Props = {
    title: string,
    message: string,
    onChange: ()=>void,
    onSubmit: ()=>void,
};

export default class OTP extends Component {
    phoneValue = this.props.route.params.phoneValue;

    constructor(props) {
        super(props);
        this.state = {
            otpValue: "",
            isDisabled:true,
            count:null,
            showResendOTP:false,
        }
        this.textInputRef = React.createRef();
    }


    componentDidMount() {
        console.log("//inside refffff")

        this.textInputRef.current.focus();
        this.otpTimer();
    }


    focusTextInput = () => {
        console.log("inside foucssssss")
        this.textInputRef.current.focus();
    }

    focusChange = (e) => {
        if (e.target.value.length >= e.target.getAttribute("maxlength")) {
            e.target.nextElementSibling.focus();
        }
    }

    onChange = (value) => {
        console.log('Value', value);
        this.setState({otpValue: value})

        if(value.length===5){
            this.setState({isDisabled: false})
        }
        else{
            this.setState({isDisabled: true})

        }
    }

    otpTimer = ()=>{
        this.setState({count: 5});
        this.inter = setInterval(() => {
            if (this.state.count <= 0) {
                clearInterval(this.inter);
                this.setState({
                    //
                });
            } else {
                this.setState((prevState) => ({count: prevState.count - 1}));
            }

            if(this.state.count===0){
                this.setState((prevState) => ({showResendOTP:true}));

            }
        }, 1000);
    }

    sendOTPAgain = async ()=>{
        console.log("//send otp again", this.phoneValue);
        this.otpTimer();
        try{
            const response = await AP.Calls.Otp.GetOtpCode({phone: this.phoneValue});
            response;
            console.log("Response from otp is ///", response);
        }
        catch (e){
            console.log("error", e);
        }
    }

    Profile = () => {
    };

    goBack = () => {
        this.props.navigation.goBack(null)
    }

     onSubmit = async (values) => {
        console.log("///",this.phoneValue);
        this.props.navigation.push("onboardingCustomer",{phoneValue:this.phoneValue? this.phoneValue : "N/A"});
        //
        // try {
        //     const response = await AP.Calls.Otp.VerifyOtpCode({otpCode:values.otpCode, phone:this.phoneValue });
        //     response;
        //     console.log("//success", response);
        // }catch (e){
        //     console.log(e)
        // }
    };

    render() {
        const {phoneValue} = this.props.route.params;

        return (
            <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
                <AppHeader type={2} headerText={"Customer Onboarding"} headerLogo={false} rightIcon={[{
                    icon: 'Profile',
                    action: this.Profile,
                    fill: Theme.primary_color_2,
                    bg: Theme.base_color_10,
                }, {icon: 'Search', action: this.Profile, fill: Theme.primary_color_2, bg: Theme.base_color_10}]}
                           leftIcon={{
                               icon: 'backBtn',
                               action: this.goBack,
                               fill: Theme.primary_color_2,
                               bg: Theme.base_color_10
                           }}/>
                <View style={{flex: 1,}}>
                    <PageBGArtwork/>
                </View>
                <ScrollView>
                    <Card style={style.cardContainer}>
                        <View style={style.formContainer}>
                            <Text weight={'bold'} size={6} color={Theme.base_color_10}
                                  style={{fontFamily: 'Proxima-Nova-Alt-Bold', alignSelf: 'flex-start', marginTop:'8%'}}
                                  underline={true}>Verification</Text>
                            {/*<Icon name={"otp"} fill={Theme.base_color_7} style={style.lottieIcon}/>*/}

                            <Text weight={'light'} size={2} color={Theme.base_color_10} style={{marginTop: "4%"}}>
                                Enter the Code sent to the provided Mobile No. below
                            </Text>
                            <View style={{flex: 1, width: '100%', maxWidth: 500, marginTop: 30}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '36%'}}>
                                    {
                                        new Array(5).fill("").map((val, index) => {
                                            return (
                                                <View key={index} style={{
                                                    width: 30, height: 90,
                                                    borderBottomColor: Theme.primary_color_3,
                                                    borderBottomWidth: 5, alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Text weight={'bold'} color={Theme.base_color_10} size={3}>
                                                        {
                                                            this.state.otpValue.split("")[index]
                                                        }
                                                    </Text>
                                                </View>
                                            )
                                        })
                                    }

                                </View>
                                <View style={style.otpFieldContainer}>
                                    <TextInput autoFocus={true}
                                               style={{width: '100%', height: 60, opacity: 0,marginTop:-30, backgroundColor: 'red'}}
                                               ref={this.textInputRef} onChangeText={this.onChange} maxLength={5} keyboardType='numeric'/>
                                </View>
                                <View>
                                    <Button disabled={this.state.isDisabled} label={'VERIFY'} type={'secondary'} action={this.onSubmit} style={{marginTop: 20, marginBottom: 20, width: '100%'}}/>

                                </View>
                                <Text weight={'light'} size={2} color={Theme.base_color_10} style={{marginTop: "3%"}}>
                                    Did not receive the code?
                                </Text>
                                <View style={{flexDirection:'row'}}>
                                    {
                                        this.state.count >0 &&
                                        <Text weight={'light'} size={2} color={Theme.base_color_10} style={{marginTop: "3%", marginBottom: '8%', marginRight:5}}>
                                            Send again in
                                        </Text>
                                    }

                                    {
                                        this.state.count >0 &&
                                        <Text weight={'bold'} size={2} color={Theme.primary_color_3} style={{marginTop: "3%", marginBottom: '8%'}}>
                                            {`00:${this.state.count}`}
                                        </Text>
                                    }

                                    {
                                        this.state.count ===0  &&
                                        <View style={{flexDirection:'row', alignItems:'center', marginTop:"3%", marginBottom: '8%'}}>
                                            <Button_Text size={2} text={'Send OTP Code Again'}
                                                         color={Theme.primary_color_3}
                                                         action={this.sendOTPAgain}/>
                                            <Icon name={'backBtn'} fill={Theme.primary_color_3} width={18} height={18} style={{marginRight:5, marginLeft:5,transform: [{scaleX: -1}]}}/>
                                        </View>


                                    }
                                </View>


                            </View>
                        </View>

                    </Card>
                </ScrollView>
            </View>
        );
    }

};

