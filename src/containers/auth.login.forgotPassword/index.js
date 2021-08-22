// @flow
import * as React from 'react';
import {View, Image} from 'react-native';
import {AppHeader} from "../../components/AppHeader";
import Theme from "../../App.style";
import PageContainer from "../../components/PageContainer";
import Card from "../../components/Card";
import {Form} from "../../components/Form";
import FormBody from "../../components/FormBody";
import style from "./style";
import {Field} from "formik";
import InputField from "../../components/InputFields/TextInputField";
import Button_Text from "../../components/Button.text";
import Button from "../../components/Button";
import AP from "../../api";
import Text from '../../components/Text';
import PageBGArtwork from "../../components/PageBGArtwork";


type Props = {};
const Auth_ForgotPassword = (props: Props) => {

    const Profile = () => {
    };
    const onSubmit = async (values) => {
        console.log("///",values);

        const response = await AP.arqum();
        response.message;
    };

    const goBack = () => {
        props.navigation.goBack(null)
    }
    return (

        <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
            <AppHeader leftIcon={{icon: 'backBtn', action: goBack, fill: Theme.primary_color_2, bg: Theme.base_color_10}}/>
            <View bgColor={'transparent'} style={{flex: 1, flexDirection: 'row'}}>
                <Image
                    source={require('../../assets/artwork/login_bg.png')}
                    style={{width: '100%', height: '100%', position:'absolute'}}/>
                <View style={style.formSection}>

                    <Form initialValues={{userid:""}} onSubmit={onSubmit} enableReinitialize={false}>
                        {
                            ({handleSubmit, isSubmitting}) => (
                                <FormBody handleKeyboard={true} backgroundColor={'transparent'}>
                                    <View style={style.mainContainer} >
                                        <View style={{flex: 1, width: '100%', maxWidth: 400, marginTop: 30}}>
                                            <Text weight={'regular'} size={6} underline={true} style={{fontFamily:'Proxima-Nova-Alt-Bold', alignSelf:'flex-start'}} color={"white"}>FORGET PASSWORD</Text>
                                            <Text weight={'regular'} size={2} color={Theme.base_color_5} style={{fontFamily:'Proxima-Nova-Alt-Light', alignSelf:'flex-start', marginTop:'5%', marginBottom:'5%'}} color={"white"}>Please enter the Mobile number associated with your account</Text>
                                            <View style={{flex: 1, width: '100%', maxWidth: 400, marginTop: 30}}>
                                                <Field name={'Mobile'} component={InputField}
                                                       placeholder={'Mobile No.'} style={{marginBottom: 10}}/>

                                                <Button label={'Send'} action={handleSubmit} style={{marginTop: 20}}/>
                                            </View>
                                        </View>
                                    </View>
                                </FormBody>
                            )
                        }
                    </Form>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flexDirection:'column', padding:0}}>
                        <Image source={require("../../assets/artwork/art_1.png")} style={{height: '80%', width:'100%', alignSelf:'flex-end'}} resizeMode="stretch"/>
                    </View>
                    <View style={{flex:1,}}>
                        <Image source={require("../../assets/icons/logo_color.png")} style={{height: '60%', width:'56%', alignSelf:'flex-end'}} resizeMode="contain"/>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Auth_ForgotPassword;
