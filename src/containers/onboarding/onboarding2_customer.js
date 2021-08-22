import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import style from './style';
import Theme from '../../App.style';
import {AppHeader} from '../../components/AppHeader';
import PageBGArtwork from '../../components/PageBGArtwork';
import Card from '../../components/Card';
import {Form} from '../../components/Form';
import Utility from '../../util';
import FormBody from '../../components/FormBody';
import Text from '../../components/Text';
import {Field} from 'formik';
import InputField from '../../components/InputFields/TextInputField';
import Icon from '../../components/Icons';
import Button from '../../components/Button';
import FooterLine from '../../components/footerLine';
import AP from '../../api';
import {Loader} from '../../components/Loader';
import Message from '../../components/Message';

type Props = {
  phone: string,
};
const Onboarding2Customer = (props: Props) => {
  const {phoneValue} = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [idFromBE, setIdFromBE] = useState(null);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await AP.Calls.Customer.AddCustomer({
        firstName: values.firstName,
        lastName: values.lastName,
        mobile: phoneValue,
      });

      if (response) {
        setIdFromBE(response.data.id);
        if (response.data.error) {
          Message.alert(
            'Customer Exists',
            'Visit profile by clicking the button below.'[
              {
                text: 'VIEW PROFILE',
                onPress: () => handleViewProfile.bind(this, idFromBE),
                type: 'yes',
              }
            ],
          );
        } else {
          console.log(
            'response from API in step 2 and id is',
            response.data.id,
          );

          //get id from the response here and pass it to the next step
          setIsLoading(false);
          console.log(
            'value of id before sending in step 2 is::>',
            idFromBE,
            response.data.id,
          );
          Message.alert('Yay!', 'The customer has been added successfully.', [
            {
              text: 'CONTINUE',
              onPress: () =>
                props.navigation.push('onboardingVehicle', {
                  customerInfo: {
                    firstName: values.firstName,
                    id: response.data.id && response.data.id,
                  },
                }),
              type: 'yes',
            },
          ]);
        }
      }
    } catch (e) {
      console.log('error:', e);
    }
  };

  const handleViewProfile = (idFromBE) => {
    props.navigation.push('onboardingVehicle', {id: idFromBE});
  };

  const handleContinue = (firstName, idFromBE) => {
    console.log('//idFromBEis', idFromBE);
    props.navigation.push('onboardingVehicle', {
      customerInfo: {
        firstName: firstName,
        id: idFromBE,
      },
    });
  };

  const handleOnChange = () => {};
  const Profile = () => {};
  const goBack = () => {
    props.navigation.goBack(null);
  };
  return (
    <>
      <Message />
      <Loader visible={isLoading} message={'Reading...'} />

      <View style={{flex: 1, backgroundColor: Theme.base_color_10}}>
        <AppHeader
          headerLogo={false}
          type={2}
          headerText={'Customer Onboarding'}
          rightIcon={[
            {
              icon: 'Profile',
              action: Profile,
              fill: Theme.primary_color_2,
              bg: Theme.base_color_10,
            },
            {
              icon: 'Search',
              action: Profile,
              fill: Theme.primary_color_2,
              bg: Theme.base_color_10,
            },
          ]}
          leftIcon={{
            icon: 'backBtn',
            action: goBack,
            fill: Theme.primary_color_2,
            bg: Theme.base_color_10,
          }}
        />
        <View style={{flex: 1}}>
          <PageBGArtwork />
        </View>
        <ScrollView>
          <Card style={style.cardContainer}>
            <Form
              initialValues={{mobile: phoneValue, firstName: '', lastName: ''}}
              validateSchema={Utility.FormsValidations.walkInCustomer}
              onSubmit={onSubmit}
              enableReinitialize={true}>
              {({handleSubmit, isSubmitting, values}) => (
                <FormBody handleKeyboard={true} backgroundColor={'transparent'}>
                  <View style={style.formContainer}>
                    <Text
                      weight={'bold'}
                      size={6}
                      color={Theme.base_color_10}
                      style={{
                        fontFamily: 'Proxima-Nova-Alt-Bold',
                        alignSelf: 'flex-start',
                      }}
                      underline={true}>
                      Owner Registration
                    </Text>
                    <Text
                      weight={'light'}
                      size={2}
                      color={Theme.base_color_10}
                      style={{marginTop: '4%'}}>
                      Please enter the details of the customer as per the
                      driver's license or another official ID
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        maxWidth: 500,
                        marginTop: 30,
                      }}>
                      <View>
                        <Field
                          name={'mobile'}
                          component={InputField}
                          placeholder={'Mobile No. (0xxxxxxxxx)'}
                          style={{marginBottom: 10}}
                          keyboardType={'phone-pad'}
                          onFocusOut={handleOnChange.bind(this)}
                          disabled={true}
                        />
                      </View>
                      <View>
                        <Field
                          name={'firstName'}
                          component={InputField}
                          placeholder={'First Name'}
                          style={{marginBottom: 10}}
                          onFocusOut={handleOnChange.bind(this)}
                        />
                      </View>
                      <View>
                        <Field
                          name={'lastName'}
                          component={InputField}
                          placeholder={'Last Name'}
                          style={{marginBottom: 10}}
                          onFocusOut={handleOnChange.bind(this)}
                        />
                      </View>

                      <TouchableOpacity onPress={Profile}></TouchableOpacity>

                      <Button
                        type={'secondary'}
                        label={'NEXT'}
                        disabled={isSubmitting || values.firstName.length === 0}
                        action={handleSubmit}
                        style={{marginTop: 20}}
                      />
                    </View>
                  </View>
                </FormBody>
              )}
            </Form>
          </Card>
        </ScrollView>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <FooterLine />
        </View>
      </View>
      {/*{*/}

      {/*    this.state.setModalVisible && this.showOTP()*/}
      {/*    // this.state.setModalVisible && this.renderModal()*/}

      {/*}*/}
    </>
  );
};

export default Onboarding2Customer;
