// @flow

import * as React from 'react';
import Card from '../Card';
import {
  View,
  TouchableOpacity,
  Dimensions,
  // Alert,
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
import ErrorBoundary from '../ErrorBoundary';
import Message from '../Message';

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
  questionLoading: string,
  paused: boolean,
  questionData: Object,
  hasImage: boolean,
  loadCompleteAction: () => void,
  onPause: () => void,
  onSummary: () => void,
  onAnswer: (param: string) => void,
  onCameraOpen: () => void,
};

type State = {
  lottieJson: string,
  saveBtnSelected: boolean,
  naButtonShow: boolean,
  naButtonSelected: boolean,
  buttonsDisable: boolean,
  selectedValueArr: Array<any>,
  showImage: boolean,
  imgLoading: boolean,
};

const ANSWER_NOT_APPLICABLE = 'na';
const {width, height} = Dimensions.get('screen');
const width2x = width * 0.245;
const width1x = '100%';
const TEST_TYPE_SELECT_SCORE = 'select_has_score';
const TEST_TYPE_SELECT = 'select';

class TestQuestionSelect extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lottieJson: '',
      saveBtnSelected: false,
      naButtonShow: false,
      naButtonSelected: false,
      buttonsDisable: false,
      selectedValueArr: [],
      showImage: false,
      imgLoading: false,
    };
  }

  componentDidMount: function = async () => {
    this.checkNaButtonStatus();
    await this.loadLottieImage(true);
    //this.highlightAnsweredBtn();
    this.setState({
      selectedValueArr: new Array(
        this.props.questionData.question.step_repeat_count,
      ).fill(0),
    });
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
      this.checkNaButtonStatus();
      await this.loadLottieImage(true);
      // this.highlightAnsweredBtn();
      this.setState({
        selectedValueArr: new Array(
          this.props.questionData.question.step_repeat_count,
        ).fill(0),
      });
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

  handleAnswersAction: function = async (answerType) => {
    if (answerType === ANSWER_NOT_APPLICABLE) {
      this.props.onAnswer(ANSWER_NOT_APPLICABLE);
    } else {
      let hasError = false;
      let score = 0;
      let type = TEST_TYPE_SELECT;
      this.state.selectedValueArr.forEach((element) => {
        if (element === 0) {
          hasError = true;
        } else if (element.score) {
          type = TEST_TYPE_SELECT_SCORE;
          score += parseFloat(element.score);
        }
      });
      if (hasError) {
        Message.alert('Info', 'Please Select all Options to save answer');
      } else {
        if (type === TEST_TYPE_SELECT_SCORE) {
          const totalScore =
            score / this.props.questionData.question.step_repeat_count;

          this.props.onAnswer(
            TEST_TYPE_SELECT_SCORE,
            JSON.stringify(this.state.selectedValueArr),
            totalScore,
          );
        } else {
          this.props.onAnswer(
            TEST_TYPE_SELECT,
            JSON.stringify(this.state.selectedValueArr),
          );
        }
      }
    }
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
          saveBtnSelected: answer,
          naButtonSelected: false,
        });
      } else if (answer === ANSWER_NOT_APPLICABLE) {
        this.setState({
          naButtonSelected: true,
          saveBtnSelected: '',
        });
      }
    } else {
      this.setState({
        saveBtnSelected: '',
        naButtonSelected: false,
      });
    }
  };

  handleSelectUpdate: function = (selectValueArr) => {
    this.setState({
      selectedValueArr: selectValueArr,
    });
  };

  /******  HELPER FUNCTIONS END ******/

  render(): React.Node {
    return (
      <>
        <Message />
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
                        this.openCamera();
                        // if (this.props.hasImage) {
                        //  this.setState({showImage: true});
                        // } else {
                        //   this.openCamera();
                        // }
                      }}>
                      <Text
                        style={{
                          height: 20,
                          marginTop: 10,
                          paddingRight: 10,
                          alignSelf: 'flex-start',
                        }}>
                        {this.props.hasImage
                          ? this.props.hasImage !== true
                            ? this.props.hasImage + ' Pictures Added'
                            : '1 Picture Added'
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
                paddingBottom: 10,
              }}>
              {this.state.selectedValueArr.length > 0 && (
                <>
                  <RenderQuestion
                    questionData={this.props.questionData}
                    selectedValueArr={this.state.selectedValueArr}
                    onSelection={this.handleSelectUpdate.bind(this)}
                  />
                </>
              )}
              {/* {'PASS FAIL BUTTONS'} */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
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
                          {width: width2x},
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
                      pageStyle.saveBtn,
                      pageStyle.testBtn,
                      this.state.saveBtnSelected && pageStyle.saveBtnSelected,
                      this.state.buttonsDisable && {opacity: 0.4},
                      this.state.naButtonShow
                        ? {width: width2x}
                        : {width: width1x},
                    ]}
                    onPress={this.handleAnswersAction.bind(this, 'save')}>
                    <Text
                      size={5}
                      style={[
                        pageStyle.saveBtnText,
                        pageStyle.testBtnText,
                        this.state.saveBtnSelected &&
                          pageStyle.actionTextSelected,
                      ]}>
                      {'Save'}
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

export default TestQuestionSelect;
