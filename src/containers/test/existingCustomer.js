// @flow
import * as React from 'react';
import {View, Image, LogBox, TouchableOpacity, ScrollView} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import PageContainer from '../../components/PageContainer';
import {Form} from '../../components/Form';
import FormBody from '../../components/FormBody';
import {Field} from 'formik';
import InputField from '../../components/InputFields/TextInputField';
import Button from '../../components/Button';
import Button_Text from '../../components/Button.text';
import AP from "../../api";
import {connect, useDispatch} from "react-redux";
import {SetLoginStatus} from "../../redux/actions/setLoginStatus";
import {bindActionCreators} from "redux";
import axios from "axios";
import Card from '../../components/Card'
import Icon from "../../components/Icons";

type Props = {};

const existingCustomer = (props: Props) => {
    const dispatch = useDispatch();

    const Profile = () => {
    };
    const goBack = () => {
        props.navigation.goBack(null)
    }

    const onSubmit = async (values) => {
        console.log("///",values);

        try {
            const response = await AP.Calls.Authentication.login({userId: values.userid, password: values.password});
            response.message;
            console.log("response message token", response.access_token);
            dispatch(SetLoginStatus(true));
            axios.defaults.headers.common["Authorization"]=`Bearer ${response.access_token}`;

        }catch (e){
            console.log(e)
        }
    };


    return (
        <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
            <AppHeader headerLogo={false} rightIcon={[{
                icon: 'Profile',
                action: Profile,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
            }, {icon: 'Search', action: Profile, fill: Theme.primary_color_2, bg: Theme.base_color_10}]}
                       leftIcon={{icon: 'backBtn', action: goBack, fill: Theme.primary_color_2, bg: Theme.base_color_10}}/>
            <ScrollView>
                <Card style={style.cardContainer}>
                    <Form initialValues={{userid:""}} onSubmit={onSubmit} enableReinitialize={false}>
                        {
                            ({handleSubmit, isSubmitting}) => (
                                <FormBody handleKeyboard={true} backgroundColor={Theme.body_bg_color_5}>
                                    <View style={style.formContainer}>
                                        <Text weight={'bold'} size={6}>START NEW CPO</Text>
                                        <Text weight={'light'} size={2} color={Theme.base_color_5}  style={{marginTop:"3%"}}>
                                            Lorem ipsum doler sit amit some random subtext here to explain stuff here right here Lorem ipsum doler sit amit some ...
                                        </Text>
                                        <View style={{flex: 1, width: '100%', maxWidth: 400, marginTop: 30}}>
                                            <View>
                                                <Field name={'QR'} component={InputField}
                                                       placeholder={'Scan QR Code'} style={{marginBottom: 10}}/>
                                                <Icon name={"qr"} width={30} height={30} fill={Theme.base_color_10} style={style.qrIcon}/>
                                            </View>
                                            <View style={style.hrContainer}>
                                                <View style={style.hr}></View>
                                                <Text style={{fontSize:18}}>OR</Text>
                                                <View style={style.hr}></View>

                                            </View>
                                            <Field name={'bookingref'} component={InputField}
                                                   placeholder={'Booking Reference No.'} style={{marginBottom: 5}} type={'password'}/>

                                            <Button label={'Next'} action={handleSubmit} style={{marginTop: 20}}/>
                                        </View>
                                    </View>
                                </FormBody>
                            )
                        }
                    </Form>
                </Card>
            </ScrollView>
        </View>
    );
};



export default existingCustomer;
