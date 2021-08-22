// @flow
import * as React from 'react';
import {
  View,
  Image,
  LogBox,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  // Alert,
  AppState,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import AP from '../../api';
import {Loader} from '../../components/Loader';
import Card from '../../components/Card';
import LottieView from 'lottie-react-native';
import {SetLoginStatus} from '../../redux/actions/setLoginStatus';
import Icon from '../../components/Icons';
import {ActivityIndicator} from '../../components/ActivityIndicator';
import Button_Icon from '../../components/Button.Icon';
import Button from '../../components/Button';
import {RNCamera} from 'react-native-camera';
import TestQuestionsSimple from '../../components/testComponent.simple';
import TestQuestionSelect from '../../components/testComponent.Select';
import TestQuestionInput from '../../components/testComponent.Input';
import TestQuestionODB from '../../components/testComponent.ODB';
import TestCamera from '../../components/testComponent.Camera';
import TabCategoryItem from '../../components/TabCategories/TabCategoryItem';
import moment from 'moment';
import Camera from '../../components/Camera';
import Layout from '../../components/Layout/FullPage';
import Message from '../../components/Message';

type Props = {
  navigation: {
    goBack: () => void,
    push: any,
    addListener: any,
    openDrawer: any,
  },
  route: {
    params: any,
  },
  bookingId: number,
};

type State = {
  isLoading: boolean,
  data: Object,
  bookingId: number,
  stageId: number | '',
  stepId: number | '',
  stageIndex: number,
  stepIndex: number,
  stage: Object,
  stageId: number,
  questionData: {
    question: Object,
    stepNo: number,
    totalSteps: number,
  },
  buttonsDisable: boolean,
  questionLoading: string,
  paused: boolean,
  CameraOn: boolean,
  hasImage: boolean | number,
  imageData: {
    uri: string,
    type: string,
    name: string,
  },
  odbMessages: Array<Object>,
  multiCameraOpen: boolean,
  appState: any,
};

const ANSWER_PASS = 'pass';
const ANSWER_FAIL = 'fail';
const ANSWER_NOT_APPLICABLE = 'na';
const TEST_TYPE_SIMPLE = 'radio';
const TEST_TYPE_SELECT = 'select';
const TEST_TYPE_INPUT = 'input';
const TEST_TYPE_SELECT_SCORE = 'select_has_score';
const TEST_TYPE_ODB = 'input_no_score';
const TEST_TYPE_SELECT_ALL = 'select_all_same';

class Tests extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inspectionType: '',
      isLoading: true,
      data: [],
      bookingId: 0,
      stageId: '',
      stepId: '',
      stageIndex: 0,
      stepIndex: 0,
      stage: {},
      stageId: 0,
      questionData: {
        question: {},
        stepNo: 0,
        totalSteps: 0,
      },
      buttonsDisable: false,
      questionLoading: '',
      paused: false,
      // ---- Camera
      CameraOn: false,
      hasImage: false,
      imageData: {
        uri: '',
        type: 'image/jpeg',
        name: '',
      },
      odbMessages: [],
      multiCameraOpen: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount: function = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    AppState.addEventListener('change', this._handleAppStateChange);
    this._unsubscribe = this.props.navigation.addListener('blur', () => {
      this.updateBookingStatus('Paused');
    });
    await this.handleBookingStatusOnLoad();
    await this.getDataFromApi();
    const {stageId, stepId} = this.state;
    await this.getTestAnswers();
    await this.setQuestion(stageId, stepId);
    await this.setState({
      inspectionType: this.props.route.params.inspectionType,
    });
    // TODO: Check if stage has question, else Give Alert
    console.log(this.state.data);
  };

  componentWillUnmount: function = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._unsubscribe();
  };

  handleBackButton: function = () => {
    ToastAndroid.show(
      'Back Action is Disabled at this Stage',
      ToastAndroid.SHORT,
    );
    return true;
  };

  _handleAppStateChange: function = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App came to foreground
      // this.updateBookingStatus('Resumed');
      // this.setState({
      //   paused: false,
      // });
    } else {
      // App gone to background
      this.updateBookingStatus('Paused');
      this.setState({
        paused: true,
      });
    }
    this.setState({appState: nextAppState});
  };

  handleBookingStatusOnLoad: function = async () => {
    const {status} = this.props.route.params;
    if (status) {
      if (status === 'visually_inspected') {
        await this.updateBookingStatus('Resumed');
      } else if (status === 'Paused') {
        await this.updateBookingStatus('Resumed');
      }
    }
  };

  updateBookingStatus: function = async (status) => {
    const {bookingId} = this.props.route.params;
    try {
      const response = await AP.Calls.Booking.setBookingStatus({
        booking_id: bookingId,
        status: status,
      });
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  getDataFromApi: function = async () => {
    try {
      const {bookingId, stageId, stepId} = this.props.route.params;
      const response = await AP.Calls.TestsCategories.getTestCategories();
      const filteredStages = response.data.stages.filter(
        (stage) => stage.title !== 'Road Test',
      );
      this.setState({
        bookingId: bookingId || 0,
        stageId: stageId || '',
        stepId: stepId || '',
        data: [...filteredStages],
        odbMessages: response.data.odbMessages ? response.data.odbMessages : [],
      });
      return;
    } catch (e) {
      console.log(e);
    }
  };

  setQuestion: function = async (stageId, stepId) => {
    const data = [...this.state.data];
    const stageIndex = stageId
      ? data.findIndex((obj) => obj.id === stageId)
      : 0;

    const stepIndex = stepId
      ? data[stageIndex].steps.findIndex((obj) => obj.id === stepId)
      : 0;

    if (data[stageIndex].steps[stepIndex].step_type === TEST_TYPE_ODB) {
      data[stageIndex].steps[stepIndex]['odbMessages'] = this.state.odbMessages;
      await this.setState({
        data: data,
      });
    }

    let hasImage = '';
    if (Array.isArray(data[stageIndex].steps[stepIndex].answerImg)) {
      hasImage = data[stageIndex].steps[stepIndex].answerImg.length;
    } else {
      hasImage = data[stageIndex].steps[stepIndex].answerImg ? true : false;
    }

    await this.setState({
      stageIndex: stageIndex,
      stepIndex: stepIndex,
      stage: data[stageIndex],
      stageId: stageId ? stageId : data[stageIndex].id,
      questionData: {
        question: data[stageIndex].steps[stepIndex],
        stepNo: stepIndex + 1,
        totalSteps: data[stageIndex].steps.length,
      },
      hasImage: hasImage,
      imageData: {
        uri: '',
        type: 'image/jpeg',
        name: '',
      },
    });
    console.log(this.state);
    return;
  };

  getTestAnswers: function = async () => {
    const testData = [...this.state.data];
    try {
      const answersData = await AP.Calls.TestsCategories.getSummary({
        booking_id: this.state.bookingId,
      });

      if (answersData.summary.length) {
        const filteredStagesWithAnswers = answersData.summary.filter(
          (obj) => obj.stage.name !== 'Road Test',
        );

        filteredStagesWithAnswers.map((obj, i) => {
          obj.stage.step.map((step, j) => {
            if (step.answer !== '') {
              if (
                step.question.step_type === TEST_TYPE_SELECT ||
                step.question.step_type === TEST_TYPE_SELECT_SCORE ||
                step.question.step_type === TEST_TYPE_ODB ||
                step.question.step_type === TEST_TYPE_SELECT_ALL
              ) {
                testData[i].steps[j]['answer'] =
                  step.answer.not_applicable === 1
                    ? ANSWER_NOT_APPLICABLE
                    : step.answer.answer;
                console.log(step.answer);
              } else {
                testData[i].steps[j]['answer'] =
                  step.answer.not_applicable === 1
                    ? ANSWER_NOT_APPLICABLE
                    : step.answer.score > 0
                    ? ANSWER_PASS
                    : ANSWER_FAIL;
              }

              if (step.answer.step_answer_image) {
                try {
                  const img = JSON.parse(step.answer.step_answer_image);
                  if (Array.isArray(img)) {
                    if (img.length === 1) {
                      testData[i].steps[j]['answerImg'] = img[0];
                    } else if (img.length > 1) {
                      const arr = img.map((obj) => {
                        return {
                          uri: obj,
                          type: 'image/jpeg',
                          name: '',
                        };
                      });
                      testData[i].steps[j]['answerImg'] = arr;
                    } else {
                      testData[i].steps[j]['answerImg'] = '';
                    }
                  }
                } catch (e) {
                  console.log('NOT A VALID JSON ERROR');
                  testData[i].steps[j]['answerImg'] =
                    step.answer.step_answer_image;
                }
              }
            } else {
              testData[i].steps[j]['answer'] = '';
            }
          });
        });
      }
      await this.setState({
        data: testData,
      });
      return true;
    } catch (e) {
      console.log('Error Getting Summary on page Load :>>', e);
    }
  };

  handleLoadComplete: function = () => {
    this.setState({
      isLoading: false,
      questionLoading: '',
    });
  };

  handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  handleMenu: function = () => {
    this.props.navigation.openDrawer();
  };

  handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  // handleCategorySelection: function = (stageId: number) => {
  //   const stageIndex = this.state.data.findIndex((obj) => obj.id === stageId);
  //   const stage = this.state.data[stageIndex];
  //   if (stage.steps.length === 0) {
  //     alert('Selected Category has no Steps');
  //   } else if (stageId === this.state.stageId && this.state.stepIndex === 0) {
  //     console.log('Same Stage same question');
  //   } else {
  //     this.setState({
  //       questionLoading: 'Fetching Category...',
  //     });
  //     this.setQuestion(stageId, '');
  //   }
  // };

  handleCategorySelection: function = (stageIndex: number) => {
    const stage = this.state.data[stageIndex];
    if (stage.steps.length === 0) {
      alert('Selected Category has no Steps');
    } else if (stage.id === this.state.stageId && this.state.stepIndex === 0) {
      console.log('Same Stage same question');
    } else {
      this.setState({
        questionLoading: 'Fetching Category...',
      });
      this.setQuestion(stage.id, '');
    }
  };

  handleBackAction: function = () => {
    this.setState({
      questionLoading: 'Fetching Previous Question...',
    });
    const stage = this.state.stage;
    let stepIndex = this.state.stepIndex - 1;
    if (this.hasMoreSteps(stage, stepIndex)) {
      this.setQuestion(stage.id, stage.steps[stepIndex].id);
    } else if (this.hasReachedFirstStep(stage, stepIndex)) {
      let stageIndex = this.state.stageIndex - 1;
      let upDateBy = 0;
      let endData = false;
      for (let i = stageIndex; i < this.state.data.length; i++) {
        if (this.hasNoSteps(this.state.data[i])) {
          upDateBy++;
        } else {
          break;
        }
      }
      stageIndex = stageIndex - upDateBy;
      const stage = this.state.data[stageIndex];
      stepIndex = stage.steps.length - 1;
      this.setQuestion(stage.id, stage.steps[stepIndex].id);
    } else if (this.hasReachedStart(stage, stepIndex)) {
      console.log('Reached Start of the Test.');
    } else {
      console.log('---------Should Never Come here----------');
      // Some condition is unhandled if here
    }
  };

  handleSkipAction: function = () => {
    this.setState({
      questionLoading: 'Fetching Next Question...',
    });
    const stage = this.state.stage;
    let stepIndex = this.state.stepIndex + 1;
    if (this.hasMoreSteps(stage, stepIndex)) {
      this.setQuestion(stage.id, stage.steps[stepIndex].id);
    } else if (this.hasReachedLastStep(stage, stepIndex)) {
      let stageIndex = this.state.stageIndex + 1;
      let upDateBy = 0;
      let endData = false;
      for (let i = stageIndex; i < this.state.data.length; i++) {
        if (this.hasNoSteps(this.state.data[i])) {
          upDateBy++;
        } else {
          break;
        }
      }
      stageIndex = stageIndex + upDateBy;
      const stage = this.state.data[stageIndex];
      this.setQuestion(stage.id, '');
    } else if (this.hasReachedFinish(stage, stepIndex)) {
      this.handleSummary();
    } else {
      console.log('---------Should Never Come here----------');
      // Some condition is unhandled if here
    }
  };

  emptyObject: function = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  hasMoreSteps: function = (stage, stepIndex) => {
    return (
      typeof stage.steps !== 'undefined' &&
      stage.steps.length > 0 &&
      stepIndex < stage.steps.length &&
      stepIndex >= 0
    );
  };

  hasReachedLastStep: function = (stage, stepIndex) => {
    const dataSrc = this.state.data;
    return (
      typeof stage.steps !== 'undefined' &&
      stage.steps.length > 0 &&
      stepIndex >= stage.steps.length &&
      dataSrc[dataSrc.length - 1].id !== stage.id
    );
  };

  hasReachedFirstStep: function = (stage, stepIndex) => {
    const dataSrc = this.state.data;
    return (
      typeof stage.steps !== 'undefined' &&
      stage.steps.length > 0 &&
      stepIndex === -1 &&
      dataSrc[0].id !== stage.id
    );
  };

  hasNoSteps: function = (stage) => {
    return typeof stage.steps === 'undefined' || stage.steps.length === 0;
  };

  hasReachedFinish: function = (stage, stepIndex) => {
    const dataSrc = this.state.data;
    const srcSteps = dataSrc[dataSrc.length - 1].steps;

    return (
      (dataSrc[dataSrc.length - 1].id === stage.id &&
        srcSteps.length === stepIndex) ||
      (dataSrc[dataSrc.length - 1].id === stage.id && srcSteps.length === 0)
    );
  };

  hasReachedStart: function = (stage, stepIndex) => {
    const dataSrc = this.state.data;
    const srcSteps = dataSrc[0].steps;

    return (
      (dataSrc[0].id === stage.id && stepIndex === -1) ||
      (dataSrc[0].id === stage.id && srcSteps.length === 0)
    );
  };

  handlePauseToggle: function = async () => {
    this.setState({
      isLoading: true,
    });
    if (this.state.paused === true) {
      await this.updateBookingStatus('Resumed');
      await this.setState({
        paused: false,
        isLoading: false,
      });
    } else {
      await this.updateBookingStatus('Paused');
      await this.setState({
        paused: true,
        isLoading: false,
      });
    }
  };

  handleSummary: function = () => {
    this.setState({
      questionLoading: '',
      isLoading: false,
    });
    this.props.navigation.push('testSummary', {
      bookingId: this.state.bookingId,
      paused: this.state.paused,
      inspectionType: this.state.inspectionType,
    });
  };

  handleAnswer: function = async (userChoice, data = '', score = 0) => {
    this.setState({
      questionLoading: 'Saving...',
    });
    let res;

    try {
      const question = this.state.questionData.question;
      if (
        question.camera_image === 'mandatory' &&
        (this.state.hasImage === false || this.state.hasImage === 0)
      ) {
        Message.alert('Error', 'Please Upload Image to Finish this Step.');
        this.setState({
          questionLoading: '',
        });
        return;
      }
      if (this.state.hasImage) {
        if (this.state.hasImage === true) {
          const formData = this.createSaveFormData(userChoice, data, score);
          console.log('Sending Form Data :>> ', formData);
          res = await AP.Calls.TestsCategories.submitAnswer(formData);
        } else {
          // Multiple Images
          const obtainedImgs = this.state.hasImage;
          const totalImgs = question.step_repeat_count;

          if (obtainedImgs < totalImgs) {
            Message.alert(
              'Error',
              `Please Upload All ${totalImgs} Images to Finish this Step.`,
            );
            this.setState({
              questionLoading: '',
            });
            return;
          }
          const formData = this.createSaveFormDataWithMultiImages(
            userChoice,
            data,
            score,
          );
          console.log('Sending Multi Form Data :>> ', formData);
          res = await AP.Calls.TestsCategories.submitAnswer(formData);
        }
      } else {
        console.log(score);
        const saveData = this.createSaveObject(userChoice, data, score);
        console.log('Sending Data Simple :>> ', saveData);
        res = await AP.Calls.TestsCategories.submitAnswer(saveData);
      }

      if (res) {
        const testData = [...this.state.data];

        if (
          userChoice === TEST_TYPE_SELECT ||
          userChoice === TEST_TYPE_SELECT_SCORE ||
          userChoice === TEST_TYPE_ODB ||
          userChoice === TEST_TYPE_SELECT_ALL
        ) {
          testData[this.state.stageIndex].steps[this.state.stepIndex][
            'answer'
          ] = data;
        } else {
          testData[this.state.stageIndex].steps[this.state.stepIndex][
            'answer'
          ] = userChoice;
        }

        if (res.data.step_answer_image) {
          console.log(res.data.step_answer_image);
          try {
            const img = JSON.parse(res.data.step_answer_image);
            if (Array.isArray(img)) {
              if (img.length === 1) {
                console.log('===========SHOULD BE HERE============');
                testData[this.state.stageIndex].steps[this.state.stepIndex][
                  'answerImg'
                ] = img[0];
              } else if (img.length > 1) {
                const arr = img.map((obj) => {
                  return {
                    uri: obj,
                    type: 'image/jpeg',
                    name: '',
                  };
                });
                testData[this.state.stageIndex].steps[this.state.stepIndex][
                  'answerImg'
                ] = arr;
              } else {
                testData[this.state.stageIndex].steps[this.state.stepIndex][
                  'answerImg'
                ] = '';
              }
            }
          } catch (e) {
            console.log('NOT A VALID JSON ERROR');
            if (Array.isArray(res.data.step_answer_image)) {
              if (res.data.step_answer_image.length === 1) {
                testData[this.state.stageIndex].steps[this.state.stepIndex][
                  'answerImg'
                ] = res.data.step_answer_image[0];
              } else {
                console.log('SHOULD NOT HAPPEN THIS');
              }
            } else {
              testData[this.state.stageIndex].steps[this.state.stepIndex][
                'answerImg'
              ] = res.data.step_answer_image;
            }
          }
        } else {
          testData[this.state.stageIndex].steps[this.state.stepIndex][
            'answerImg'
          ] = '';
        }

        this.setState({
          data: testData,
        });
        this.handleSkipAction();
      }
    } catch (e) {
      console.log('===============UNABLE TO SAVE ANSWER=================');
      console.log(e);
    }
  };

  createSaveObject: function = (userChoice, data, score) => {
    const question = this.state.questionData.question;
    const result = {
      stage_id: question.stage_id,
      step_id: question.id,
      booking_id: this.state.bookingId,
      not_applicable: userChoice === ANSWER_NOT_APPLICABLE ? 1 : 0,
    };
    if (userChoice === TEST_TYPE_SELECT) {
      result['answer'] = data;
    } else if (
      userChoice === TEST_TYPE_SELECT_SCORE ||
      userChoice === TEST_TYPE_SELECT_ALL ||
      userChoice === TEST_TYPE_ODB
    ) {
      result['answer'] = data;
      result['score'] = score;
    } else {
      result['score'] = userChoice === ANSWER_PASS ? question.score : 0;
    }
    return result;
  };

  createSaveFormData: function = (userChoice, data, score) => {
    const question = this.state.questionData.question;
    const imgUrl = this.state.imageData.uri
      ? this.state.imageData.uri
      : this.state.questionData.question.answerImg;
    const formData = new FormData();
    formData.append('step_answer_image[]', {
      uri: imgUrl,
      type: this.state.imageData.type,
      name: this.state.imageData.name,
    });
    formData.append('stage_id', question.stage_id);
    formData.append('step_id', question.id);
    formData.append('booking_id', this.state.bookingId);
    formData.append(
      'not_applicable',
      userChoice === ANSWER_NOT_APPLICABLE ? 1 : 0,
    );

    if (userChoice === TEST_TYPE_SELECT) {
      formData.append('answer', data);
    } else if (
      userChoice === TEST_TYPE_SELECT_SCORE ||
      userChoice === TEST_TYPE_SELECT_ALL ||
      userChoice === TEST_TYPE_ODB
    ) {
      formData.append('answer', data);
      formData.append('score', score);
    } else {
      formData.append('score', userChoice === ANSWER_PASS ? question.score : 0);
    }
    return formData;
  };

  createSaveFormDataWithMultiImages: function = (userChoice, data, score) => {
    const question = this.state.questionData.question;
    const formData = new FormData();
    const localData = this.state.imageData;
    const serverData = question.answerImg;
    if (Array.isArray(localData) && localData[0].uri !== '') {
      localData.map((obj) => {
        formData.append('step_answer_image[]', {
          uri: obj.uri,
          type: obj.type,
          name: obj.side,
        });
      });
    } else if (Array.isArray(serverData) && serverData[0].uri !== '') {
      serverData.map((obj) => {
        formData.append('step_answer_image[]', {
          uri: obj.uri,
          type: obj.type,
          name: obj.side,
        });
      });
    }

    formData.append('stage_id', question.stage_id);
    formData.append('step_id', question.id);
    formData.append('booking_id', this.state.bookingId);
    formData.append(
      'not_applicable',
      userChoice === ANSWER_NOT_APPLICABLE ? 1 : 0,
    );

    if (userChoice === TEST_TYPE_SELECT) {
      formData.append('answer', data);
    } else if (
      userChoice === TEST_TYPE_SELECT_SCORE ||
      userChoice === TEST_TYPE_SELECT_ALL ||
      userChoice === TEST_TYPE_ODB
    ) {
      formData.append('answer', data);
      formData.append('score', score);
    } else {
      formData.append('score', userChoice === ANSWER_PASS ? question.score : 0);
    }
    return formData;
  };

  checkComponentToShow: function = () => {
    switch (this.state.questionData.question.step_type) {
      case null:
        return TEST_TYPE_SIMPLE;
      default:
        return this.state.questionData.question.step_type;
    }
  };

  closeCamera: function = () => {
    this.setState({CameraOn: false});
  };

  openCamera: function = () => {
    console.log(this.state.questionData.question);
    if (this.state.questionData.question.step_repeat_count > 1) {
      this.setState({
        multiCameraOpen: true,
      });
    } else {
      this.setState({
        CameraOn: true,
      });
    }
  };

  takePicture: function = async (imageObj) => {
    try {
      let questionData = {...this.state.questionData};
      questionData.question['answerImg'] = imageObj.uri;
      this.setState({
        imageData: imageObj,
        hasImage: true,
        CameraOn: false,
        questionData: questionData,
      });
    } catch (e) {
      console.log(e);
    }
  };

  multiCameraClose: function = (imageDataArr) => {
    let countImgs = 0;
    const validImgs = [];
    imageDataArr.map((obj) => {
      if (obj !== 0) {
        countImgs++;
        validImgs.push(obj);
      }
    });
    // let questionData = {...this.state.questionData};
    // questionData.question['answerImg'] = validImgs;

    this.setState({
      imageData: validImgs,
      hasImage: countImgs,
      multiCameraOpen: false,
      //   questionData: questionData,
    });
  };

  render(): React.Node {
    return (
      <>
        <Message />
        {this.state.CameraOn && (
          // Direct Camera
          <Camera
            CameraOn={this.state.CameraOn}
            closeCamera={this.closeCamera.bind(this)}
            takePicture={(imageObj) => {
              this.takePicture(imageObj);
            }}
          />
        )}
        {
          // Multi Image Camera via component
          <TestCamera
            visible={this.state.multiCameraOpen}
            onClose={this.multiCameraClose}
            label={this.state.questionData.question.label}
            count={this.state.questionData.question.step_repeat_count}
            id={this.state.stageIndex + '-' + this.state.stepIndex}
            answerImages={this.state.questionData.question.answerImg}
          />
        }
        {<Loader visible={this.state.isLoading} message={'Loading...'} />}
        <Layout
          backgroundColor={Theme.base_color_9}
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Light Inspection'}
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
                icon: 'menu',
                action: this.handleMenu,
                fill: Theme.primary_color_2,
                bg: Theme.primary_color_2,
              }}
            />
          }
          sectionBody={
            <>
              <View style={styles.mainContainer}>
                {this.state.data.length > 0 &&
                !this.emptyObject(this.state.questionData.question) > 0 ? (
                  <>
                    <TouchableOpacity
                      disabled={this.state.buttonsDisable}
                      style={[
                        styles.sideBtn,
                        styles.sideLeftBtn,
                        this.state.buttonsDisable && {opacity: 0.4},
                      ]}
                      onPress={this.handleBackAction.bind(this)}>
                      <View style={{alignSelf: 'center'}}>
                        <Text size={5} style={styles.sideLeftArrow}>{`<`}</Text>
                      </View>
                      <View style={{alignSelf: 'center'}}>
                        <Text
                          size={3}
                          style={[styles.sideBtnText, styles.sideBtnTextLeft]}>
                          PREVIOUS
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={this.state.buttonsDisable}
                      style={[
                        styles.sideBtn,
                        styles.sideRightBtn,
                        this.state.buttonsDisable && {opacity: 0.4},
                      ]}
                      onPress={this.handleSkipAction.bind(this)}>
                      <View style={{alignSelf: 'center'}}>
                        <Text
                          size={3}
                          style={[styles.sideBtnText, styles.sideBtnTextRight]}>
                          SKIP
                        </Text>
                      </View>
                      <View style={{alignSelf: 'center'}}>
                        <Text
                          size={5}
                          style={styles.sideRightArrow}>{`>`}</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.stepCategoriesContainer}>
                      <TabCategoryItem
                        data={this.state.data}
                        selectedCategory={this.handleCategorySelection.bind(
                          this,
                        )}
                        selected={this.state.stageIndex}
                      />
                    </View>
                    {this.checkComponentToShow() === TEST_TYPE_SIMPLE && (
                      <>
                        <TestQuestionsSimple
                          loadCompleteAction={this.handleLoadComplete}
                          navigation={this.props.navigation}
                          questionData={this.state.questionData}
                          questionLoading={this.state.questionLoading}
                          paused={this.state.paused}
                          hasImage={this.state.hasImage}
                          onCameraOpen={this.openCamera.bind(this)}
                          onPause={this.handlePauseToggle.bind(this)}
                          onAnswer={this.handleAnswer.bind(this)}
                          onSummary={this.handleSummary.bind(this)}
                        />
                      </>
                    )}
                    {(this.checkComponentToShow() === TEST_TYPE_SELECT ||
                      this.checkComponentToShow() === TEST_TYPE_SELECT_SCORE ||
                      this.checkComponentToShow() === TEST_TYPE_SELECT_ALL) && (
                      <>
                        <TestQuestionSelect
                          loadCompleteAction={this.handleLoadComplete}
                          navigation={this.props.navigation}
                          questionData={this.state.questionData}
                          questionLoading={this.state.questionLoading}
                          paused={this.state.paused}
                          hasImage={this.state.hasImage}
                          onCameraOpen={this.openCamera.bind(this)}
                          onPause={this.handlePauseToggle.bind(this)}
                          onAnswer={this.handleAnswer.bind(this)}
                          onSummary={this.handleSummary.bind(this)}
                        />
                      </>
                    )}
                    {this.checkComponentToShow() === TEST_TYPE_INPUT && (
                      <>
                        <TestQuestionInput
                          loadCompleteAction={this.handleLoadComplete}
                          navigation={this.props.navigation}
                          questionData={this.state.questionData}
                          questionLoading={this.state.questionLoading}
                          paused={this.state.paused}
                          hasImage={this.state.hasImage}
                          onCameraOpen={this.openCamera.bind(this)}
                          onPause={this.handlePauseToggle.bind(this)}
                          onAnswer={this.handleAnswer.bind(this)}
                          onSummary={this.handleSummary.bind(this)}
                        />
                      </>
                    )}
                    {this.checkComponentToShow() === TEST_TYPE_ODB && (
                      <>
                        <TestQuestionODB
                          loadCompleteAction={this.handleLoadComplete}
                          navigation={this.props.navigation}
                          questionData={this.state.questionData}
                          questionLoading={this.state.questionLoading}
                          paused={this.state.paused}
                          hasImage={this.state.hasImage}
                          onCameraOpen={this.openCamera.bind(this)}
                          onPause={this.handlePauseToggle.bind(this)}
                          onAnswer={this.handleAnswer.bind(this)}
                          onSummary={this.handleSummary.bind(this)}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <Text size={5}>Loading . . .</Text>
                )}
              </View>
            </>
          }
        />
      </>
    );
  }
}

const {width, height} = Dimensions.get('screen');

const sideMargin = (width * 0.15) / 2;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 0,
    width: '85%',
    alignSelf: 'center',
  },
  stepCategoriesContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    padding: 0,
  },
  //------ Right And Left Fixed Buttons
  sideBtn: {
    position: 'absolute',
    top: 220,
    width: 70,
    height: 200,
    borderWidth: 2,
  },
  sideLeftBtn: {
    left: -sideMargin,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: Theme.primary_color_1,
    borderLeftWidth: 0,
    flexDirection: 'row',
  },
  sideRightBtn: {
    right: -sideMargin,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: Theme.primary_color_1,
    borderRightWidth: 0,
    backgroundColor: Theme.primary_color_1,
    flexDirection: 'row',
  },
  sideBtnText: {
    transform: [{rotate: '270deg'}],
  },
  sideBtnTextLeft: {
    color: Theme.primary_color_1,
    marginLeft: -35,
    fontWeight: 'bold',
    width: 115,
  },
  sideLeftArrow: {
    color: Theme.primary_color_1,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  sideBtnTextRight: {
    color: Theme.base_color_10,
    marginLeft: 0,
    fontWeight: 'bold',
  },
  sideRightArrow: {
    color: Theme.base_color_10,
    fontWeight: 'bold',
  },
});

export default Tests;
