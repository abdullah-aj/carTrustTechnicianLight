// @flow
import * as React from 'react';
import {View, Image, LogBox, TouchableOpacity} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import PageContainer from '../../components/PageContainer';
import {Form} from '../../components/Form';
import FormBody from '../../components/FormBody';
import {Field} from 'formik';
import InputField from '../../components/InputFields/TextInputField';
import CheckBoxInput from '../../components/InputFields/CheckBoxInput';
import Button from '../../components/Button';
import Button_Text from '../../components/Button.text';
import AP from '../../api';
import {connect, useDispatch} from 'react-redux';
import {SetLoginStatus} from '../../redux/actions/setLoginStatus';
import {bindActionCreators} from 'redux';
import axios from 'axios';
import {Loader} from '../../components/Loader';
import Icon from '../../components/Icons';
import SetUserDetails from '../../redux/actions/setUserDetails';
import AsyncStorage from '@react-native-community/async-storage';
import {ClearToast, SetToast} from '../../redux/actions/setToast';

type Props = {};
const Auth_Login = (props: Props) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = React.useState(false);
  const Profile = () => {};
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const aSyncStorageKey = 'CAR_TRUST_USER';
  // Form Fields Defaults
  const [formDefaults, setFormDefaults] = React.useState({
    userName: '',
    password: '',
    // remember: false
  });

  React.useEffect(() => {
    getRememberedUser()
      .then((user) => {
        if (user) {
          setRememberMe(true);
          setFormDefaults({
            userName: user.name,
            password: user.password,
            remember: true,
          });
        } else {
          console.log('Saved User Not Found');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const forgotPassword = () => {
    props.navigation.push('Forgot');
  };

  const onSubmit = async (values) => {
    console.log('///', values);
    //dispatch(SetLoginStatus(true));
    setLoading(true);
    if (rememberMe) {
      rememberUser(values);
    } else {
      forgetUser();
    }
    try {
      const response = await AP.Calls.Authentication.login({
        userId: values.userid,
        password: values.password,
      });
      response.message;
      console.log('//login response message:::>>>', response);
      console.log('response message token', response.access_token);
      setLoading(false);
      dispatch(SetLoginStatus(true));
      props.setUserDetails(response);
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.access_token}`;
    } catch (e) {
      setLoading(false);
      console.log('error is::', e);
      dispatch(SetToast('Please check username/password', 'danger'));
    }
  };

  const handleCheckBoxToggle = (state) => {
    setRememberMe(state);
  };

  const rememberUser = async (loginDetails) => {
    const user = {
      name: loginDetails.userid,
      password: loginDetails.password,
    };
    try {
      await AsyncStorage.setItem(aSyncStorageKey, JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  };

  const getRememberedUser = async () => {
    try {
      const userObj = await AsyncStorage.getItem(aSyncStorageKey);
      if (userObj !== null) {
        return JSON.parse(userObj);
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const forgetUser = async () => {
    try {
      await AsyncStorage.removeItem(aSyncStorageKey);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {<Loader visible={isLoading} message={'Working...'} />}
      <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
        <View bgColor={'transparent'} style={{flex: 1, flexDirection: 'row'}}>
          <Image
            source={require('../../assets/artwork/login_bg.png')}
            style={{width: '100%', height: '100%', position: 'absolute'}}
          />
          <View style={style.formSection}>
            <Form
              initialValues={{
                userid: formDefaults.userName,
                password: formDefaults.password,
                remember: rememberMe,
              }}
              onSubmit={onSubmit}
              enableReinitialize={true}>
              {({handleSubmit, isSubmitting}) => (
                <FormBody handleKeyboard={true} backgroundColor={'transparent'}>
                  <View style={style.mainContainer}>
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        maxWidth: 400,
                        marginTop: 30,
                      }}>
                      <Text
                        weight={'regular'}
                        size={6}
                        underline={true}
                        style={{
                          fontFamily: 'Proxima-Nova-Alt-Bold',
                          alignSelf: 'flex-start',
                        }}
                        color={'white'}>
                        Log in now
                      </Text>
                      <Text
                        weight={'regular'}
                        size={2}
                        color={Theme.base_color_5}
                        style={{
                          fontFamily: 'Proxima-Nova-Alt-Light',
                          alignSelf: 'flex-start',
                          marginTop: '5%',
                          marginBottom: '5%',
                        }}
                        color={'white'}>
                        Login to Car Trust Platform
                      </Text>

                      <Field
                        name={'userid'}
                        component={InputField}
                        placeholder={'Mobile #'}
                        keyboardType={'phone-pad'}
                        style={{marginBottom: 10}}
                      />

                      <View style={{flexDirection: 'row'}}>
                        <Field
                          name={'password'}
                          component={InputField}
                          placeholder={'Password'}
                          style={{marginBottom: 5, width: 400}}
                          type={showPassword ? 'text' : 'password'}
                        />
                        <View
                          style={{width: 50, marginLeft: -45, marginTop: 13}}>
                          <TouchableOpacity
                            onPress={() => {
                              setShowPassword(!showPassword);
                            }}
                            style={[]}>
                            {showPassword ? (
                              <>
                                <Icon
                                  name={'eyeClose'}
                                  width={25}
                                  height={25}
                                  fill={Theme.base_color_6}
                                  //style={style.iconStyle}
                                />
                              </>
                            ) : (
                              <>
                                <Icon
                                  name={'eyeOpen'}
                                  width={25}
                                  height={25}
                                  fill={Theme.base_color_6}
                                  //style={style.iconStyle}
                                />
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Field
                        name={'remember'}
                        component={CheckBoxInput}
                        label={'Remember Me'}
                        labelColor={'#ffffff'}
                        onChange={handleCheckBoxToggle.bind(this)}
                      />
                      <Button_Text
                        size={1.2}
                        text={'Forgot password?'}
                        color={'white'}
                        style={{paddingTop: 10, paddingBottom: 10}}
                        action={forgotPassword}
                      />
                      <Button
                        label={'LOG IN'}
                        action={handleSubmit}
                        style={{marginTop: 20}}
                        type={'primary'}
                      />
                    </View>
                  </View>
                </FormBody>
              )}
            </Form>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'column', padding: 0}}>
              <Image
                source={require('../../assets/artwork/art_1.png')}
                style={{height: '80%', width: '100%', alignSelf: 'flex-end'}}
                resizeMode="stretch"
              />
            </View>
            <View style={{flex: 1}}>
              <Image
                source={require('../../assets/icons/logo_color.png')}
                style={{height: '60%', width: '56%', alignSelf: 'flex-end'}}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

type ConnectProps = {
  mapStateToProps: any,
  mapDispatchToProps: any,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserDetails: (data) => dispatch(SetUserDetails(data)),
  };
};

export default (connect<ConnectProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Auth_Login): any);
