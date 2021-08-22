import React from 'react';
import Text from '../Text';
import style from './style';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  Linking,
  Alert,
} from 'react-native';
import Icon from '../Icons';
import Theme from '../../App.style';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import Button from '../Button';
import AP from '../../api';
import Message from '../Message';

type Props = {
  testData: [],
  bookingId: number,
  roadTested: boolean,
};
let innerAccordion;
let anySkipped;
const Accordion = (props: Props) => {
  const [disableFinish, setDisableFinish] = React.useState(true);
  const [showHandover, setShowHandover] = React.useState(true);

  React.useEffect(() => {
    if (props.testData) {
      checkCompletion();
      // checkRoadTested();
    }
  }, [props.testData]);

  const checkCompletion: function = async () => {
    const skipped = props.testData.find((obj) =>
      obj.stage.step.find((step) => step.skip === true),
    );
    if (typeof skipped === 'undefined') {
      setDisableFinish(false);
    }
  };

  // const checkRoadTested: function = async () => {
  //   if (props.roadTested === true) {
  //     setShowHandover(false);
  //   }
  // };

  // const handleTestFinish: function = async () => {
  //   try {
  //     const res = await AP.Calls.TestsCategories.finishTest({
  //       booking_id: props.bookingId,
  //     });
  //     console.log(res, '========================');
  //     // if (res.data.result === 'pass') {
  //     if (res.data.obtain_score >= res.data.passing_score) {
  //       props.navigation.push('result', {
  //         title: 'Pass Report',
  //         icon: 'check',
  //         leftHalfContainer: {
  //           heading: 'Nice-to-have',
  //           dataList: ['Rear Camera Check', 'Gear box Oil', 'AC Compressor'],
  //         },
  //         rightHalfContainer: {
  //           heading: '',
  //           dataList: [''],
  //         },
  //         buttons: [
  //           // {label: 'WARRANTY', action: () => alert('Under Process'), disable: true },
  //           // {label: 'CERTIFICATE', action: () => alert('Under Process'), disable: true},
  //           {
  //             label: 'REPORT',
  //             action: () => Linking.openURL(res.data.report_link),
  //           },
  //           //   {label: 'MOJIZ', action: () => alert('Under Process'), disable: true},
  //           //  {label: 'PRINT ALL', action: () => alert('Under Process')},
  //         ],
  //       });
  //     } else if (res.data.result === 'fail') {
  //       props.navigation.push('result', {
  //         title: 'Fail Report',
  //         icon: 'closeRed',
  //         leftHalfContainer: {
  //           heading: 'Must-have',
  //           dataList: [
  //             'Air Filter',
  //             'Spark Plugs',
  //             'Oil Filter',
  //             'Brake shoes',
  //           ],
  //         },
  //         rightHalfContainer: {
  //           heading: 'Nice-to-have',
  //           dataList: [
  //             'Rear Camera Check',
  //             'Gearbox Oil',
  //             'AC Compressor',
  //             'Paint Job',
  //           ],
  //         },
  //         buttons: [
  //           {label: 'REBOOKING', action: () => alert('Re-Booking')},
  //           {label: 'PRINT REPORT', action: () => alert('Print Report')},
  //         ],
  //       });
  //     }
  //   } catch (e) {
  //     console.log('===============UNABLE TO FINISH TEST=================');
  //     console.log(e);
  //   }
  // };

  const handleTestFinishTWo: function = async () => {
    try {
      Message.alert(
        'Message',
        'Are you sure you want to Finish the Inspection?',
        [
          {
            text: 'No',
            onPress: () => {},
            type: 'no',
          },
          {
            text: 'Finish Inspection',
            onPress: async () => {
              const response = await AP.Calls.Booking.setBookingStatus({
                booking_id: props.bookingId,
                status: 'Completed',
              });
              if (response) {
                Alert.alert('Success', 'Inspection Completed Successfully', [
                  {
                    text: 'Go to Dashboard',
                    onPress: () => props.navigation.navigate('Dashboard'),
                  },
                ]);
              }
            },
            type: 'yes',
          },
        ],
      );
    } catch (e) {
      console.log('ERROR :>> ', e);
    }
  };

  const handleHandover: function = async () => {
    try {
      const response = await AP.Calls.Booking.setBookingStatus({
        booking_id: props.bookingId,
        status: 'Road_test_ready',
      });
      Message.alert(
        'Success',
        'Inspection successfully transferred to Road Test Driver',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => {
              props.navigation.navigate('Dashboard');
            },
            type: 'yes',
          },
        ],
      );
    } catch (e) {
      console.log('ERROR :>> ', e);
    }
  };

  const handleQuestionClick = (stageId, stepId) => {
    props.navigation.push('Test', {
      bookingId: props.bookingId,
      stageId: stageId,
      stepId: stepId,
      inspectionType: props.inspectionType,
    });
  };

  return (
    <View>
      <Message />
      <View style={style.mainContainer}>
        <View style={{}}>
          {props.testData &&
            props.testData.map((val, index) => {
              {
                anySkipped = false;
                innerAccordion = val.stage.step.map((val2, index2) => {
                  // console.log('//////result:::', val2.answer);
                  //val2.question.step_type
                  if (val2.skip) {
                    anySkipped = val2.skip;
                  }

                  return (
                    <View key={'K_' + index2} style={style.innerPanelRow}>
                      <TouchableOpacity
                        onPress={() => {
                          handleQuestionClick(
                            val2.question.stage_id,
                            val2.question.id,
                          );
                        }}>
                        <Text
                          weight={'bold'}
                          size={2}
                          color={Theme.primary_color_2}
                          style={[
                            {width: '100%'},
                            val2.answer.not_applicable && {
                              color: Theme.base_color_6,
                            },
                            val2.skip && {
                              color: Theme.secondary_color_2,
                              fontWeight: 'bold',
                            },
                          ]}>
                          {val2.question.inspection_name}
                        </Text>
                      </TouchableOpacity>

                      <View style={style.iconsRow}>
                        {val2.answer.not_applicable ? (
                          <>
                            <Text
                              size={1}
                              style={{
                                paddingRight: 10,
                                color: Theme.base_color_5,
                              }}>
                              Not Applicable
                            </Text>
                          </>
                        ) : (
                          <>
                            {val2.question.step_type === 'select' ||
                            val2.question.step_type === 'input' ? (
                              <>
                                <Text
                                  size={1}
                                  style={{
                                    paddingRight: 10,
                                    color: Theme.base_color_5,
                                  }}>
                                  No Score
                                </Text>
                              </>
                            ) : (
                              <>
                                <Icon
                                  name={'skip'}
                                  width={16}
                                  height={16}
                                  fill={
                                    val2.skip
                                      ? Theme.primary_color_3
                                      : Theme.base_color_6
                                  }
                                  style={{marginRight: 10}}
                                />
                                {/* <Icon name={"check"} width={16} height={16}
                                          fill={ (typeof val2.answer.score !== 'undefined' && val2.answer.score > 0) ? Theme.secondary_color_3 : Theme.base_color_6 }
                                          style={{marginRight: 10}}/>
                                    <Icon name={"close"} width={16} height={16}
                                          fill={(typeof val2.answer.score !== 'undefined' && val2.answer.score === 0) ? Theme.secondary_color_2 : Theme.base_color_6}
                                          style={{marginRight: 10}}/> */}
                                <Icon
                                  name={'check'}
                                  width={16}
                                  height={16}
                                  fill={
                                    val2.answer.result === 'pass'
                                      ? Theme.secondary_color_3
                                      : Theme.base_color_6
                                  }
                                  style={{marginRight: 10}}
                                />
                                <Icon
                                  name={'close'}
                                  width={16}
                                  height={16}
                                  fill={
                                    val2.answer.result === 'fail'
                                      ? Theme.secondary_color_2
                                      : Theme.base_color_6
                                  }
                                  style={{marginRight: 10}}
                                />
                              </>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  );
                });
              }
              return (
                <Collapse
                  style={
                    anySkipped
                      ? style.accordionPanelFailure
                      : style.accordionPanelSuccess
                  }>
                  <CollapseHeader
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '98%',
                      alignItems: 'center',
                    }}>
                    <Text
                      weight={'bold'}
                      size={3}
                      color={Theme.base_color_10}
                      style={{padding: 20}}>
                      {val.stage.name}{' '}
                      {anySkipped && (
                        <Text size={1} color={'#242424'}>
                          {' '}
                          - Some Steps are missing
                        </Text>
                      )}
                    </Text>
                    <Icon
                      name={'backBtn'}
                      fill={Theme.base_color_10}
                      width={16}
                      height={16}
                      style={{transform: [{rotate: '-90deg'}]}}
                    />
                  </CollapseHeader>
                  <CollapseBody style={style.accordionInnerPanel}>
                    {innerAccordion}
                  </CollapseBody>
                </Collapse>
              );
            })}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignContent: 'center',
            height: 80,
            marginBottom: 30,
            width: '100%',
          }}>
          <Button
            type={'primary'}
            label={'FINISH'}
            disabled={disableFinish}
            action={handleTestFinishTWo}
            style={[
              {
                width: 200,
                marginRight: 20,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default Accordion;
