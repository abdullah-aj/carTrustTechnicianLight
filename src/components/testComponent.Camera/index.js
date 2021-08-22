// @flow
import * as React from 'react';
import {
  View,
  Image,
  LogBox,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import Theme from '../../App.style';
import AP from '../../api';
import Icon from '../../components/Icons';
import Button from '../../components/Button';
import {RNCamera} from 'react-native-camera';
import moment from 'moment';
import Camera from '../../components/Camera';

type Props = {
  visible: boolean,
  titleText?: string,
  descriptionText?: string,
  label: string,
  count: number,
  id: string,
  answerImages: Array<Object>,
  onClose: (imageObj: Object) => void,
};

type State = {
  imgArray: Array<any>,
  CameraOn: boolean,
  currentCamera: null | number,
  currentLabel: string,
  imageView: boolean,
  imagePath: string,
};

class TestCamera extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imgArray: [],
      CameraOn: false,
      currentCamera: null,
      currentLabel: '',
      imageView: false,
      imagePath: '',
    };
  }

  componentDidMount: function = () => {
    if (
      this.props.answerImages !== '' &&
      Array.isArray(this.props.answerImages)
    ) {
      this.setState({
        imgArray: this.props.answerImages,
      });
    } else {
      this.setState({
        imgArray: new Array(this.props.count).fill(0),
      });
    }
  };

  componentDidUpdate: function = async (prevProp, prevState) => {
    if (prevProp.id !== this.props.id) {
      if (
        this.props.answerImages !== '' &&
        Array.isArray(this.props.answerImages)
      ) {
        this.setState({
          imgArray: this.props.answerImages,
        });
      } else {
        this.setState({
          imgArray: new Array(this.props.count).fill(0),
        });
      }
    }
  };

  getLabel: function = (count) => {
    const length = this.state.imgArray.length;
    switch (length) {
      case 2:
        return count === 0 ? 'Left ' : 'Right ';
      case 3:
        if (count === 0) {
          return 'Left ';
        } else if (count === 1) {
          return 'Middle ';
        } else if (count === 2) {
          return 'Right ';
        }
      case 4:
        if (count === 0) {
          return 'Front Left ';
        } else if (count === 1) {
          return 'Front Right ';
        } else if (count === 2) {
          return 'Rear Left ';
        } else if (count === 3) {
          return 'Rear Right ';
        }
      case 5:
        if (count === 0) {
          return 'Front Left ';
        } else if (count === 1) {
          return 'Front Right ';
        } else if (count === 2) {
          return 'Rear Left ';
        } else if (count === 3) {
          return 'Rear Right ';
        } else if (count === 4) {
          return 'Middle ';
        }
      case 6:
        if (count === 0) {
          return 'Front Left ';
        } else if (count === 1) {
          return 'Front Middle ';
        } else if (count === 2) {
          return 'Front Right ';
        } else if (count === 3) {
          return 'Rear Left ';
        } else if (count === 4) {
          return 'Rear Middle ';
        } else if (count === 5) {
          return 'Rear Right ';
        }
      default:
        return '';
    }
  };

  closeCamera: function = () => {
    this.setState({
      CameraOn: false,
      currentCamera: null,
      currentLabel: '',
    });
  };

  openCamera: function = (currentCamera) => {
    this.setState({
      currentCamera: currentCamera,
      CameraOn: true,
      currentLabel: this.getLabel(currentCamera)
        .slice(0, -1)
        .replace(/\s/g, '_'),
    });
  };

  takePicture: function = async (imageObj) => {
    try {
      const imgArray = [...this.state.imgArray];
      if (this.state.currentCamera !== null) {
        imgArray[this.state.currentCamera] = imageObj;
        imgArray[this.state.currentCamera]['side'] = this.state.currentLabel;

        this.setState({
          CameraOn: false,
          imgArray: imgArray,
          currentCamera: null,
          currentLabel: '',
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  viewImage: function = (imgUri) => {
    if (imgUri) {
      this.setState({
        imageView: true,
        imagePath: imgUri,
      });
    }
  };

  render(): React.Node {
    return (
      <>
        {this.state.CameraOn ? (
          <Camera
            CameraOn={this.state.CameraOn}
            closeCamera={this.closeCamera.bind(this)}
            takePicture={(imageObj) => {
              this.takePicture(imageObj);
            }}
          />
        ) : (
          <>
            <Modal
              visible={this.props.visible}
              statusBarTranslucent={true}
              transparent={true}
              hardwareAccelerated={true}>
              <View style={style.mainContainer}>
                <View style={style.insideContainer}>
                  <View style={style.titleRow}>
                    <View style={style.titleContainer}>
                      <Text
                        size={5}
                        weight={'bold'}
                        style={style.titleText}
                        underline={true}>
                        {this.props.titleText
                          ? this.props.titleText
                          : 'Take Pictures'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={style.closeButton}
                      onPress={() => {
                        this.props.onClose(this.state.imgArray);
                      }}>
                      <Icon
                        name={'close'}
                        width={20}
                        height={20}
                        fill={Theme.base_color_5}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={style.descriptionRow}>
                    <Text style={style.subText}>
                      {this.props.descriptionText
                        ? this.props.descriptionText
                        : 'Please take images in day-light, well-lit environment or use flash to take clear images'}
                    </Text>
                  </View>

                  <View style={style.bodyRow}>
                    {/* CAMERA BOX */}

                    {Array.isArray(this.state.imgArray) &&
                      this.state.imgArray.map((obj, i) => {
                        return (
                          <>
                            <View key={'camera_' + i} style={style.cameraBox}>
                              <View style={style.cameraBoxTitle}>
                                <Text
                                  underline={true}
                                  size={2}
                                  style={style.cameraBoxTitleText}>
                                  {this.getLabel(i) + this.props.label}
                                </Text>
                              </View>
                              {/* <View style={style.cameraBoxBtn}>
                          <TouchableOpacity
                            disabled={false}
                            style={[style.cameraButton]}
                            onPress={() => {}}>
                              <Icon
                                name={'camera'}
                                fill={Theme.base_color_10}
                                width={24}
                                height={24}
                                style={{alignSelf: 'center'}}
                              />
                              <Text style={style.cameraBtnText}>Open Camera</Text>
                            </TouchableOpacity>
                          </View> */}

                              <TouchableOpacity
                                style={style.imageViewer}
                                onPress={this.openCamera.bind(this, i)}>
                                {this.state.imgArray[i].uri && (
                                  <>
                                    <Image
                                      source={{uri: this.state.imgArray[i].uri}}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 0,
                                      }}
                                    />
                                  </>
                                )}
                                <View style={style.iconCenter}>
                                  <Icon
                                    name={'image'}
                                    width={30}
                                    height={30}
                                    style={{alignSelf: 'center'}}
                                  />
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      position: 'relative',
                                      color: Theme.base_color_9,
                                    }}>
                                    Tap to take a photo
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{
                                  width: '100%',
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                  height: 35,
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignItems: 'center',
                                }}
                                onPress={this.viewImage.bind(
                                  this,
                                  this.state.imgArray[i].uri,
                                )}>
                                <View style={{}}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      position: 'relative',
                                      color: Theme.base_color_10,
                                    }}>
                                    VIEW IMAGE
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </>
                        );
                      })}
                  </View>
                </View>
              </View>
            </Modal>
            {/* Image View MODEL */}
            <Modal
              visible={this.state.imageView}
              statusBarTranslucent={true}
              transparent={true}
              hardwareAccelerated={true}>
              <View style={style.mainContainer}>
                <View style={[style.insideContainerImage]}>
                  <View style={style.titleRow}>
                    <View style={style.titleContainer}>
                      <Text
                        size={5}
                        weight={'bold'}
                        style={style.titleText}
                        underline={true}>
                        Image Viewer
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={style.closeButton}
                      onPress={() => {
                        this.setState({
                          imageView: false,
                          imagePath: '',
                        });
                      }}>
                      <Icon
                        name={'close'}
                        width={20}
                        height={20}
                        fill={Theme.base_color_5}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={style.descriptionRow}>
                    <Image
                      source={{uri: this.state.imagePath}}
                      style={{
                        width: '100%',
                        height: '95%',
                        borderRadius: 0,
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </>
    );
  }
}

export default TestCamera;
