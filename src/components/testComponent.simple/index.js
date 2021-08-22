// @flow

import * as React from 'react';
import Card from '../Card';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from '../Icons';
import Text from '../Text';
import Theme from '../../App.style';
import Button from '../Button';
import pageStyle from './style';
import TabCategoryItem from '../TabCategories/TabCategoryItem';
import {Loader, LoaderSmall} from '../Loader';
import RenderQuestion from './renderQuestion';
import AP from '../../api';
import LottieView from 'lottie-react-native';
import style from '../Card/style';
import ErrorBoundary from '../../components/ErrorBoundary';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  questionLoading: string,
  paused: boolean,
  hasImage: boolean,
  questionData: Object,
  loadCompleteAction: () => void,
  onPause: () => void,
  onSummary: () => void,
  onAnswer: () => void,
  onCameraOpen: () => void,
};

type State = {
  lottieJson: string,
  passFailBtnState: string,
  naButtonShow: boolean,
  naButtonSelected: boolean,
  buttonsDisable: boolean,
  showImage: boolean,
  imgLoading: boolean,
};

const ANSWER_PASS = 'pass';
const ANSWER_FAIL = 'fail';
const ANSWER_NOT_APPLICABLE = 'na';
const {width, height} = Dimensions.get('screen');
const width2x = width * 0.245;
const width3x = width * 0.165;

class TestComponentSimple extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lottieJson: '',
      passFailBtnState: '',
      naButtonShow: false,
      naButtonSelected: false,
      buttonsDisable: false,
      showImage: false,
      imgLoading: false,
    };
  }

  componentDidMount: function = async () => {
    console.log(this.props.questionData.question.answerImg);
    this.checkNaButtonStatus();
    await this.loadLottieImage(true);
    this.highlightAnsweredBtn();
    if (this.props.paused) {
      this.setState({
        buttonsDisable: true,
      });
    }
  };

  componentDidUpdate: function = async (prevProp, prevState) => {
    if (
      prevProp.questionData.question.id !== this.props.questionData.question.id
    ) {
      console.log('Update Run');
      this.checkNaButtonStatus();
      await this.loadLottieImage(true);
      this.highlightAnsweredBtn();
    }
    if (this.props.paused !== prevProp.paused) {
      this.setState({
        buttonsDisable: this.props.paused,
      });
    }
  };

  checkNaButtonStatus: function = () => {
    this.setState({
      naButtonShow:
        this.props.questionData.question.is_mandatory === 0 ? true : false,
    });
  };

  loadLottieImage: function = async (onLoad) => {
    try {
      const response = await fetch(this.props.questionData.question.image);
      if (response.ok === false) {
        this.setState(
          {
            lottieJson: '',
          },
          () => {
            this.props.loadCompleteAction();
          },
        );
      }
      const json = await response.json();
      this.setState(
        {
          lottieJson: this.validLottieObject(json) ? json : '',
        },
        () => {
          this.props.loadCompleteAction();
        },
      );
      return;
    } catch (e) {
      console.log('Error :>>', e);
    }
  };

  handleAnswersAction: function = async (userChoice) => {
    this.props.onAnswer(userChoice);
  };

  handlePauseAction: function = () => {
    this.props.onPause();
  };

  handleJumpToSummary: function = () => {
    this.props.onSummary();
  };

  openCamera: function = () => {
    this.props.onCameraOpen();
  };

  /******  HELPER FUNCTIONS ******/

  validLottieObject: function = (str) => {
    let hasError = undefined;
    try {
      if (typeof str.assets !== 'undefined') {
        for (let i = 0; i < str.assets.length; i++) {
          if (
            typeof str.assets[i].p !== 'undefined' &&
            str.assets[i].p.includes('data:image')
          ) {
            hasError = false;
            break;
          } else {
            if (typeof str.assets[i].layers === 'undefined') {
              hasError = true;
            } else if (str.assets[i].layers.length > 2) {
              hasError = true;
            }
          }
        }
      } else {
        hasError = true;
      }
    } catch (e) {
      console.log('Catch===========', e);
    }
    console.log('hasError', hasError);
    // console.log('============>>>>', str.assets);

    try {
      return JSON.stringify(str) && !!str && !hasError;
    } catch (e) {
      return false;
    }
  };

  highlightAnsweredBtn: function = (stageId, stepId) => {
    const answer = this.props.questionData.question.answer;
    if (answer) {
      if (answer === ANSWER_PASS || answer === ANSWER_FAIL) {
        this.setState({
          passFailBtnState: answer,
          naButtonSelected: false,
        });
      } else if (answer === ANSWER_NOT_APPLICABLE) {
        this.setState({
          naButtonSelected: true,
          passFailBtnState: '',
        });
      }
    } else {
      this.setState({
        passFailBtnState: '',
        naButtonSelected: false,
      });
    }
  };

  /******  HELPER FUNCTIONS END ******/

  render(): React.Node {
    return (
      <>
        {
          <LoaderSmall
            visible={this.props.questionLoading !== ''}
            message={this.props.questionLoading}
          />
        }
        {/* QUESTION AREA */}
        <Card style={pageStyle.questionsContainer}>
          <View style={pageStyle.cardRowOne}>
            {/* Pause Resume button */}
            <TouchableOpacity
              style={[
                pageStyle.roundBtn,
                this.props.paused
                  ? pageStyle.roundBtnResume
                  : pageStyle.roundBtnPause,
                this.state.buttonsDisable && {opacity: 0.4},
              ]}
              onPress={this.handlePauseAction.bind(this)}>
              {this.props.paused ? (
                <Icon
                  name={'play'}
                  fill={Theme.base_color_10}
                  width={20}
                  height={20}
                  style={{alignSelf: 'center', marginTop: 9}}
                />
              ) : (
                <Icon
                  name={'pause'}
                  fill={Theme.base_color_10}
                  width={20}
                  height={20}
                  style={{alignSelf: 'center', marginTop: 9}}
                />
              )}
            </TouchableOpacity>

            <View style={{flexDirection: 'row'}}>
              <>
                {(this.props.questionData.question.camera_image ===
                  'mandatory' ||
                  this.props.questionData.question.camera_image ===
                    'enabled') && (
                  <>
                    <TouchableOpacity
                      disabled={this.state.buttonsDisable}
                      style={{height: 40}}
                      onPress={() => {
                        if (this.props.hasImage) {
                          this.setState({showImage: true});
                        } else {
                          this.openCamera();
                        }
                      }}>
                      <Text
                        style={{
                          height: 20,
                          marginTop: 10,
                          paddingRight: 10,
                          alignSelf: 'flex-start',
                        }}>
                        {this.props.hasImage
                          ? '1 Picture Added'
                          : 'No Picture Added'}
                      </Text>
                    </TouchableOpacity>

                    {/* Take Picture Button */}
                    <TouchableOpacity
                      disabled={this.state.buttonsDisable}
                      style={[
                        pageStyle.roundBtn,
                        pageStyle.roundBtnCamera,
                        this.state.buttonsDisable && {opacity: 0.4},
                        this.props.questionData.question.camera_image ===
                          'mandatory' && {
                          backgroundColor: Theme.secondary_color_2,
                        },
                        {marginRight: 10},
                      ]}
                      onPress={this.openCamera.bind(this)}>
                      <Icon
                        name={'camera'}
                        fill={Theme.base_color_10}
                        width={24}
                        height={24}
                        style={{alignSelf: 'center', marginTop: 6}}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </>
              {/* Summary Button */}
              <TouchableOpacity
                // disabled={this.state.buttonsDisable}
                style={[
                  pageStyle.roundBtn,
                  pageStyle.roundBtnSummary,
                  this.state.buttonsDisable && {opacity: 0.4},
                ]}
                onPress={this.handleJumpToSummary.bind(this)}>
                <Icon
                  name={'notepad'}
                  fill={Theme.base_color_10}
                  width={24}
                  height={24}
                  style={{alignSelf: 'center', marginTop: 6}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={pageStyle.cardRowTwo}>
            {/* LOTTIE ANIMATION */}
            <ErrorBoundary>
              <View style={{flex: 0.3, padding: 20}}>
                {this.state.lottieJson ? (
                  <>
                    <LottieView
                      source={this.state.lottieJson}
                      autoPlay
                      loop
                      style={{
                        width: 320,
                        height: 320,
                        aspectRatio: 320 / 320,
                      }}
                    />
                  </>
                ) : (
                  <View style={{flex: 0.35, padding: 120}}>
                    <Icon name={'loading'} width={50} height={50} />
                  </View>
                )}
              </View>
            </ErrorBoundary>

            {/* {'QUESTION RENDER WITH PASS FAIL BTN'} */}
            <View
              style={{
                flex: 0.69,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}>
              <RenderQuestion questionData={this.props.questionData} />
              {/* {'PASS FAIL BUTTONS'} */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                {/* {'FAIL BUTTON'} */}
                <View style={pageStyle.testBtnContainer}>
                  <TouchableOpacity
                    disabled={this.state.buttonsDisable}
                    style={[
                      pageStyle.failBtn,
                      pageStyle.testBtn,
                      this.state.passFailBtnState === ANSWER_FAIL &&
                        pageStyle.failBtnSelected,
                      this.state.buttonsDisable && {opacity: 0.4},
                      this.state.naButtonShow
                        ? {width: width3x}
                        : {width: width2x},
                    ]}
                    onPress={this.handleAnswersAction.bind(this, ANSWER_FAIL)}>
                    <Icon
                      name={'close'}
                      fill={
                        this.state.passFailBtnState === ANSWER_FAIL
                          ? Theme.base_color_10
                          : Theme.secondary_color_2
                      }
                      width={24}
                      height={24}
                      style={{alignSelf: 'center'}}
                    />
                    <Text
                      size={5}
                      style={[
                        pageStyle.failBtnText,
                        pageStyle.testBtnText,
                        this.state.passFailBtnState === ANSWER_FAIL &&
                          pageStyle.actionTextSelected,
                      ]}>
                      {'No'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* {'NOT APPLICABLE BUTTON'} */}
                {this.state.naButtonShow && (
                  <>
                    <View style={pageStyle.testBtnContainer}>
                      <TouchableOpacity
                        disabled={this.state.buttonsDisable}
                        style={[
                          pageStyle.naBtn,
                          pageStyle.testBtn,
                          this.state.naButtonSelected &&
                            pageStyle.naBtnSelected,
                          this.state.buttonsDisable && {opacity: 0.4},
                        ]}
                        onPress={this.handleAnswersAction.bind(
                          this,
                          ANSWER_NOT_APPLICABLE,
                        )}>
                        <Text
                          size={3}
                          style={[
                            pageStyle.naBtnText,
                            pageStyle.testBtnText,
                            {fontWeight: 'bold'},
                            this.state.naButtonSelected &&
                              pageStyle.actionTextSelected,
                          ]}>
                          {'NOT APPLICABLE'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* {'PASS BUTTON'} */}
                <View style={pageStyle.testBtnContainer}>
                  <TouchableOpacity
                    disabled={this.state.buttonsDisable}
                    style={[
                      pageStyle.passBtn,
                      pageStyle.testBtn,
                      this.state.passFailBtnState === ANSWER_PASS &&
                        pageStyle.passBtnSelected,
                      this.state.buttonsDisable && {opacity: 0.4},
                      this.state.naButtonShow
                        ? {width: width3x}
                        : {width: width2x},
                    ]}
                    onPress={this.handleAnswersAction.bind(this, ANSWER_PASS)}>
                    <Icon
                      name={'check'}
                      fill={
                        this.state.passFailBtnState === ANSWER_PASS
                          ? Theme.base_color_10
                          : Theme.secondary_color_3
                      }
                      width={24}
                      height={24}
                      style={{alignSelf: 'center'}}
                    />
                    <Text
                      size={5}
                      style={[
                        pageStyle.passBtnText,
                        pageStyle.testBtnText,
                        this.state.passFailBtnState === ANSWER_PASS &&
                          pageStyle.actionTextSelected,
                      ]}>
                      {'Yes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Card>
        {/* Modal */}
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.showImage}>
          <View style={pageStyle.centeredView}>
            <View style={pageStyle.modalView}>
              <View style={pageStyle.closeButton}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showImage: !this.state.showImage,
                    });
                  }}>
                  <Icon
                    name={'close'}
                    width={15}
                    height={15}
                    fill={Theme.base_color_5}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>
              <View style={[pageStyle.modalBodyRow, pageStyle.modalBodyPrompt]}>
                {this.state.showImage && (
                  <>
                    <Image
                      source={{uri: this.props.questionData.question.answerImg}}
                      style={{height: 420, width: 600}}
                      resizeMode="contain"
                      onLoadStart={() => {
                        this.setState({imgLoading: true});
                      }}
                      onLoadEnd={() => {
                        this.setState({imgLoading: false});
                      }}
                    />
                    {this.state.imgLoading && (
                      <ActivityIndicator
                        size="large"
                        color={Theme.primary_color_1}
                        style={{
                          marginLeft: -600,
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default TestComponentSimple;
