// @flow
import * as React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import TwoHalves from '../../../components/Layout/TwoHalves';
import {AppHeader} from '../../../components/AppHeader';
import Theme from '../../../App.style';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Text from '../../../components/Text';
import Icon from '../../../components/Icons';
import {Form} from '../../../components/Form';
import FormBody from '../../../components/FormBody';
import {Field} from 'formik';
import InputField from '../../../components/InputFields/TextInputField';
import Utility from '../../../util';
import AP from '../../../api';
import Message from '../../../components/Message';

type Props = {
  navigation: {
    goBack: function,
    push: any,
    manufacturerId: number,
    modelId: number,
    yearId: number,
  },
};

type State = {
  modalVisible: boolean,
  userChoice: string,
  formValues: Object,
  cpo: number,
  ppi: number,
  vat: number,
  grandTotalCPO: number,
  grandTotalPPI: number,
};

class Price extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      userChoice: '',
      formValues: {},
      cpo: 0,
      ppi: 0,
      vat: 0,
      grandTotalCPO: 0,
      grandTotalPPI: 0,
    };
  }

  componentDidMount: function = async () => {
    const {manufacturerId, modelId, yearId} = this.props.route.params;
    try {
      const res: any = await AP.Calls.Quotation.getQuotation({
        manufacturerId,
        modelId,
        yearId,
      });

      if (res.cpo_sixmonth) {
        const grandTotalCPO = parseFloat(
          parseFloat(this.calculatePercentage(res.cpo_sixmonth, res.vat)) +
            parseFloat(res.cpo_sixmonth),
        ).toFixed(1);

        const grandTotalPPI = parseFloat(
          parseFloat(this.calculatePercentage(res.price_ppi, res.vat)) +
            parseFloat(res.price_ppi),
        ).toFixed(1);

        this.setState({
          cpo: res.cpo_sixmonth,
          ppi: res.price_ppi,
          vat: res.vat,
          grandTotalCPO: grandTotalCPO,
          grandTotalPPI: grandTotalPPI,
        });
      } else {
        this.setState({
          cpo: '0',
          ppi: '0',
          vat: 0,
          grandTotal: 0,
        });
        Message.alert(
          'No Price Found',
          'Current Vehicle has no price set in Database. Showing Dummy Value',
        );
      }
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  handleModalVisibility: function = (visible) => {
    if (visible === false) {
      this.setState({
        modalVisible: visible,
        userChoice: '',
      });
    } else {
      this.setState({modalVisible: visible});
    }
  };

  handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  handleGoBack: function = () => {
    this.props.navigation.goBack();
  };

  handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  handleSms: function = () => {
    this.setState({
      userChoice: 'sms',
    });
  };

  handleEmail: function = () => {
    this.setState({
      userChoice: 'email',
    });
  };

  handleSend: function = () => {
    this.handleModalVisibility(true);
  };

  handleBookNow: function = () => {
    this.props.navigation.push('onboarding');
  };

  onSubmit: function = async (values) => {
    this.setState({formValues: values});
    let res: any;
    const {manufacturerId, modelId, yearId} = this.props.route.params;
    try {
      if (this.state.userChoice === 'sms') {
        res = await AP.Calls.Quotation.sendSms({
          manufacturerId,
          modelId,
          yearId,
          phone: values.mobile,
        });
      } else {
        res = await AP.Calls.Quotation.sendEmail({
          manufacturerId,
          modelId,
          yearId,
          email: values.email,
        });
      }
      this.handleModalVisibility(!this.state.modalVisible);
      // this.props.navigation.push('Dashboard');
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  btnDisableCheck: function = (values) => {
    if (this.state.userChoice === 'sms') {
      return values.mobile.length < 9 ? true : false;
    } else {
      return values.email.length < 9 ? true : false;
    }
  };

  calculatePercentage: function = (number, percent) => {
    let num = percent / 100;
    num = num * number;
    return num;
  };

  render(): React.Node {
    return (
      <>
        <Message />
        <TwoHalves
          artType={'list'}
          title={'Services'}
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Quotation'}
              rightIcon={[
                {
                  icon: 'Profile',
                  action: this.handleProfileClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
                {
                  icon: 'Search',
                  action: this.handleSearchClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
              ]}
              leftIcon={{
                icon: 'backBtn',
                action: this.handleGoBack,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              }}
            />
          }
          sectionBody={
            <View style={style.container}>
              <View style={style.table}>
                <View style={[style.row, style.titleRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Name of Service
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Biz Inspection
                    </Text>
                  </View>
                </View>

                {/* TABLE BODY */}

                <View style={[style.row, style.evenRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Car Trust Inspection Report
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Icon
                      name={'check'}
                      width={16}
                      height={16}
                      fill={Theme.secondary_color_3}
                    />
                  </View>
                </View>

                <View style={[style.row, style.oddRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Limited Warranty Coverage (6 Months Inclusive)
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Icon
                      name={'close'}
                      width={16}
                      height={16}
                      fill={Theme.secondary_color_2}
                    />
                  </View>
                </View>

                <View style={[style.row, style.evenRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Car Trust certificate
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Icon
                      name={'close'}
                      width={16}
                      height={16}
                      fill={Theme.secondary_color_2}
                    />
                  </View>
                </View>

                <View style={[style.row, style.oddRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      ELM Mojaz Report
                    </Text>
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Icon
                      name={'close'}
                      width={16}
                      height={16}
                      fill={Theme.secondary_color_2}
                    />
                  </View>
                </View>

                {/* <View style={[style.row, style.evenRow, style.lastRow]}>
                  <View style={[style.col, style.colLeft]}>
                    <Text weight={'light'} size={2} color={Theme.base_color_10}>
                      Inspection Report
                    </Text>
                  </View>
                  <View style={[style.col, style.colMid]}>
                    <Icon
                      name={'check'}
                      width={16}
                      height={16}
                      fill={Theme.secondary_color_3}
                    />
                  </View>
                  <View style={[style.col, style.colRight]}>
                    <Icon
                      name={'check'}
                      width={16}
                      height={16}
                      fill={Theme.secondary_color_3}
                    />
                  </View>
                </View> */}

                {/* TOTAL ROW */}
                <View style={[style.row, style.totalRowMid]}>
                  <View style={[style.col, style.colTotalLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Total
                    </Text>
                  </View>
                  <View style={[style.col, style.colTotalRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      {this.state.ppi} SAR
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.totalRowMid]}>
                  <View style={[style.col, style.colTotalLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      VAT
                    </Text>
                  </View>
                  <View style={[style.col, style.colTotalRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      {this.state.vat} %
                    </Text>
                  </View>
                </View>

                <View style={[style.row, style.totalRow]}>
                  <View style={[style.col, style.colTotalLeft]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      Grand Total
                    </Text>
                  </View>                  
                  <View style={[style.col, style.colTotalRight]}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{fontWeight: 'bold'}}>
                      {this.state.grandTotalPPI} SAR
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <Button
                  type={'tertiary'}
                  label={'Send Quote'}
                  disabled={false}
                  action={this.handleSend.bind(this)}
                  style={[
                    style.button,
                    {width: 120, marginRight: 20, elevation: 0},
                  ]}
                />
                <Button
                  type={'tertiary'}
                  label={'Book Inspection'}
                  disabled={false}
                  action={this.handleBookNow.bind(this)}
                  style={[style.button, {width: 220}]}
                />
              </View>
              {/* ---------- Modal --------- */}
              <View style={style.centeredView}>
                <Modal
                  animationType={'fade'}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    this.handleModalVisibility(!this.state.modalVisible);
                  }}>
                  <View style={style.centeredView}>
                    <View style={style.modalView}>
                      <View style={style.closeButton}>
                        <TouchableOpacity
                          onPress={this.handleModalVisibility.bind(
                            this,
                            !this.state.modalVisible,
                          )}>
                          <Icon
                            name={'close'}
                            width={15}
                            height={15}
                            fill={Theme.base_color_5}
                            style={{}}
                          />
                        </TouchableOpacity>
                      </View>
                      {this.state.userChoice === '' ? (
                        <>
                          <View
                            style={[style.modalBodyRow, style.modalBodyPrompt]}>
                            <Button
                              type={'primary'}
                              label={'SEND BY SMS'}
                              disabled={false}
                              action={this.handleSms.bind(this)}
                              style={{
                                width: 200,
                                backgroundColor: Theme.primary_color_2,
                              }}
                            />
                            <Text
                              weight={'light'}
                              size={3}
                              color={Theme.base_color_5}
                              style={{
                                marginTop: '2%',
                                alignSelf: 'flex-start',
                              }}>
                              OR
                            </Text>
                            <Button
                              type={'tertiary'}
                              label={'SEND BY EMAIL'}
                              disabled={false}
                              action={this.handleEmail.bind(this)}
                              style={{width: 200, elevation: 0, borderWidth: 2}}
                            />
                          </View>
                        </>
                      ) : (
                        <>
                          <View style={[style.modalBodyRow, {width: 460}]}>
                            <Form
                              initialValues={{
                                mobile: '',
                                name: '',
                                email: '',
                              }}
                              // validateSchema={
                              //   Utility.FormsValidations.walkInCustomer
                              // }
                              onSubmit={this.onSubmit}
                              enableReinitialize={false}>
                              {({handleSubmit, isSubmitting, values}) => (
                                <FormBody
                                  handleKeyboard={true}
                                  backgroundColor={'transparent'}>
                                  <View style={{width: 400}}>
                                    {/* <View>
                                      <Field
                                        name={'name'}
                                        component={InputField}
                                        placeholder={'Name'}
                                        style={style.inputFieldText}
                                        keyboardType={'default'}
                                        maxLength={25}
                                        onFocusOut={() => {}}
                                      />
                                    </View> */}
                                    {this.state.userChoice === 'sms' ? (
                                      <>
                                        <View>
                                          <Field
                                            name={'mobile'}
                                            component={InputField}
                                            placeholder={
                                              'Mobile No. (0xxxxxxxxx)'
                                            }
                                            style={style.inputFieldText}
                                            keyboardType={'phone-pad'}
                                            maxLength={10}
                                            onFocusOut={() => {}}
                                          />
                                        </View>
                                      </>
                                    ) : (
                                      <>
                                        <View>
                                          <Field
                                            name={'email'}
                                            component={InputField}
                                            placeholder={
                                              'someone@something.com'
                                            }
                                            style={style.inputFieldText}
                                            keyboardType={'email-address'}
                                            maxLength={20}
                                            onFocusOut={() => {}}
                                          />
                                        </View>
                                      </>
                                    )}

                                    <View>
                                      <Button
                                        label={'SEND'}
                                        type={'secondary'}
                                        disabled={this.btnDisableCheck(values)}
                                        action={handleSubmit}
                                      />
                                    </View>
                                  </View>
                                </FormBody>
                              )}
                            </Form>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          }
        />
      </>
    );
  }
}

const evenRow = '';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 90,
  },
  table: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    height: 45,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  titleRow: {
    height: 50,
    backgroundColor: Theme.primary_color_1,
    borderTopLeftRadius: Theme.card_border_radius,
    borderTopRightRadius: Theme.card_border_radius,
  },
  evenRow: {
    backgroundColor: Theme.primary_color_2,
  },
  oddRow: {
    backgroundColor: '#3537a0',
  },
  lastRow: {
    borderBottomLeftRadius: Theme.card_border_radius,
  },
  totalRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: Theme.primary_color_1,
    borderBottomLeftRadius: Theme.card_border_radius,
    borderBottomRightRadius: Theme.card_border_radius,
  },
  totalRowMid: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: Theme.primary_color_1,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
  col: {
    alignSelf: 'stretch',
    // alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 30,
  },
  colLeft: {
    flex: 0.6,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  colRight: {
    flex: 0.2,
  },
  colMid: {
    flex: 0.2,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  colTotalLeft: {
    flex: 0.4,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  colTotalRight: {
    flex: 0.4,
  },
  button: {
    elevation: 0,
    borderWidth: 2,
  },
  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 265,
  },
  modalBodyRow: {
    flexDirection: 'row',
  },
  modalBodyPrompt: {
    width: 650,
    justifyContent: 'space-between',
    paddingTop: 90,
    paddingLeft: 20,
    paddingRight: 20,
  },
  closeButton: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  inputFieldText: {
    borderColor: Theme.primary_color_2,
    borderWidth: 2,
    marginBottom: 30,
  },
});

export default Price;
