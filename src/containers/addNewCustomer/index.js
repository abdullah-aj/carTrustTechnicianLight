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

type Props = {
    mobile:number
};

const AddNewCustomer = (props: Props) => {
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
            <AppHeader headerLogo={false} headerText={'Add New Customer'} rightIcon={[{
                icon: 'Profile',
                action: Profile,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
            }, {icon: 'Search', action: Profile, fill: Theme.primary_color_2, bg: Theme.base_color_10}]}
                       leftIcon={{icon: 'backBtn', action: goBack, fill: Theme.primary_color_2, bg: Theme.base_color_10}}/>
            <ScrollView>
                <Card style={style.cardContainer}>
                    <Form initialValues={{fullName:"", mobile:props.mobile? props.mobile:""}} onSubmit={onSubmit} enableReinitialize={false}>
                        {
                            ({handleSubmit, isSubmitting}) => (
                                <FormBody handleKeyboard={true} backgroundColor={Theme.body_bg_color_5}>
                                    <View style={style.formContainer}>
                                        <Text weight={'bold'} size={6}>Fill in Customer Information below</Text>
                                        <Text weight={'light'} size={2} color={Theme.base_color_5} style={{marginTop:"4%"}}>
                                            Let us onboard the new Customer!
                                        </Text>
                                        <View style={{flex: 1, width: '100%', maxWidth: 400, marginTop: 30}}>
                                            <View>
                                                <Field name={'fullName'} component={InputField}
                                                       placeholder={'Full Name'} style={{marginBottom: 10}}/>
                                                <Icon name={"Profile"} width={22} height={22} fill={Theme.base_color_6} style={style.qrIcon}/>
                                            </View>

                                            <View>
                                                <Field name={'mobile'} component={InputField}
                                                       placeholder={'Mobile No.'} style={{marginBottom: 10}}/>
                                                <Icon name={"mobile"} width={26} height={26} fill={Theme.base_color_6} style={style.qrIcon}/>
                                            </View>
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



export default AddNewCustomer;
