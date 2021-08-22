import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import Theme from '../../App.style';
import FormBody from '../../components/FormBody';
import {Form} from '../../components/Form';
import Icons from '../../components/Icons';
import Button from '../../components/Button';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import {MultiSelect} from '../../components/multiSelect';
import Button_Text from '../../components/Button.text';
import Button_Icon from '../../components/Button.Icon';
import Icon from '../../components/Icons';
import Text from '../../components/Text';
import {Tags} from '../../components/Tags';
import _ from 'lodash';
import {AppHeader} from '../../components/AppHeader';
import Utility from '../../util';
import Card from '../../components/Card';
import InputField from '../../components/InputFields/TextInputField';
import {Field} from 'formik';
import style from '../onboarding/style';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import moment from 'moment';

export default class SketchDraw extends Component {
  canvas;
  state = {
    CameraOn: false,
    imageUri: null,
    isTypeModalVisible: false,
    isTypeModalSelected: false,
    selectedDefectTypes: [],
    hasDrawing: false,
    comment: '',
  };
  srcimg = {
    filename: this.props.img,
    directory: SketchCanvas.MAIN_BUNDLE,
    mode: 'AspectFit',
  };

  selectedDefectTypes = [];

  componentDidMount = async () => {
    let vInspectionData = await AsyncStorage.getItem(
      this.props.aSyncStorageKey,
    );
    const side = this.props.img;
    if (vInspectionData) {
      vInspectionData = JSON.parse(vInspectionData);
      if (vInspectionData[side]) {
        // marked paths
        if (
          vInspectionData[side].markedPaths &&
          vInspectionData[side].markedPaths.length > 0
        ) {
          vInspectionData[side].markedPaths.map((path) => {
            this.canvas.addPath(path);
          });
        }
        // Camera Img
        if (vInspectionData[side].cameraImg) {
          this.setState({
            imageUri: vInspectionData[side].cameraImg,
            selectedDefectTypes: vInspectionData[side].defectsType,
            comment: vInspectionData[side].comment,
          });
        }
      }
    }
  };

  formatSideName = () => {
    switch (this.props.img) {
      case 'side_left':
        return 'LEFT SIDE';
      case 'side_right':
        return 'RIGHT SIDE';
      case 'top':
        return 'TOP SIDE';
      case 'back':
        return 'BACK SIDE';
      case 'front':
        return 'FRONT SIDE';
    }
  };

  Profile = () => {};
  goBack = () => {
    //this.props.navigation.goBack(null);
    this.props.onComplete();
  };
  onSubmit = async (values) => {
    const side = this.props.img;
    let haveData = false;

    let vInspectionData = await AsyncStorage.getItem(
      this.props.aSyncStorageKey,
    );
    if (vInspectionData) {
      vInspectionData = JSON.parse(vInspectionData);
      if (this.emptyObject(vInspectionData) === false) {
        haveData = true;
      }
    }

    this.canvas.getBase64(
      'jpeg',
      false,
      true,
      true,
      true,
      async (err, result) => {
        try {
          const imagePath = `${
            RNFS.TemporaryDirectoryPath
          }/img_${moment().format('YYYY-MM-DD_HH-mm-ss')}.jpg`;

          RNFS.writeFile(imagePath, result, 'base64').then(async () => {
            const data = {
              markedImg: 'file://' + imagePath,
              markedPaths: this.canvas.getPaths(),
              cameraImg: this.state.imageUri,
              defectsType: this.state.selectedDefectTypes,
              comment: values.comment,
            };

            if (haveData) {
              vInspectionData[side] = data;
              await AsyncStorage.setItem(
                this.props.aSyncStorageKey,
                JSON.stringify(vInspectionData),
              );
              this.props.onComplete();
            } else {
              await AsyncStorage.setItem(
                this.props.aSyncStorageKey,
                JSON.stringify({
                  [side]: data,
                }),
              );
              this.props.onComplete();
            }
          });
        } catch (error) {
          console.log('Error :>> ', e);
        }
      },
    );
  };

  emptyObject: function = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  handleOnChange = () => {};
  takePicture = async function () {
    const options = {quality: 0.5};
    const {uri} = await this.RNCamera.takePictureAsync(options);
    this.setState({
      imageUri: uri,
      CameraOn: !this.state.CameraOn,
    });
    // CameraRoll.save(uri);
  };

  closeCamera = () => {
    this.setState({CameraOn: !this.state.CameraOn});
  };

  handleTakePicturePress = async function () {
    this.setState({
      CameraOn: !this.state.CameraOn,
    });
  };

  onTypeClose = (typesList: string[]) => {
    const uniqueValues = _.uniqBy(typesList, 'id');
    this.setState({
      selectedDefectTypes: uniqueValues,
      isTypeModalVisible: false,
      isTypeModalSelected: true,
    });
  };

  onMultiSelectClose = () => {
    this.setState({isTypeModalVisible: false});
  };

  tagsHandleClose = (idToRemove) => {
    let arrayAfterRemoval = this.state.selectedDefectTypes;
    if (arrayAfterRemoval) {
      const indexToRemove = arrayAfterRemoval.findIndex(function (item, index) {
        return item.id === idToRemove;
      });
      let b = arrayAfterRemoval.splice(indexToRemove, 1);
      this.setState({selectedDefectTypes: arrayAfterRemoval});
    }
  };

  onChange = () => {
    return (val) => this.setState({selectedTeam: val});
  };

  clearCanvas = () => {
    this.canvas.clear();
    this.setState({
      hasDrawing: false,
    });
  };

  render() {
    return (
      <>
        <AppHeader
          type={2}
          headerText={this.formatSideName()}
          headerLogo={false}
          leftIcon={{
            icon: 'backBtn',
            action: this.goBack,
            fill: Theme.primary_color_2,
            bg: Theme.base_color_10,
          }}
        />
        {this.state.CameraOn && (
          <View style={styles.cameraContainer}>
            <RNCamera
              ref={(cam) => {
                this.RNCamera = cam;
              }}>
              <View style={styles.takeImageMessageView}>
                <Text style={styles.capture}>
                  [ Take a Photograph of the defected area of the vehicle ]
                </Text>
              </View>

              <View style={styles.cameraIconContainer}>
                <TouchableOpacity onPress={this.closeCamera.bind(this)}>
                  <Icons
                    name={'close'}
                    width={70}
                    height={70}
                    fill={Theme.base_color_7}
                    style={styles.captureIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.takePicture.bind(this)}>
                  <Icons
                    name={'camera'}
                    width={70}
                    height={70}
                    fill={Theme.base_color_7}
                    style={styles.captureIcon}
                  />
                </TouchableOpacity>
              </View>
            </RNCamera>
          </View>
        )}

        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <View style={{marginTop: 10}}>
              <Text style={styles.sketchHeading}>
                Please mark the defected areas by drawing over the image below.
              </Text>
              <Text style={styles.sketchSubHeading}>
                You can encircle an area or mark it with an X
              </Text>
            </View>
            <View style={{}}>
              <Button
                type={'tertiary'}
                disabled={false}
                label={'CLEAR'}
                action={this.clearCanvas.bind(this)}
                style={{
                  width: 70,
                  height: 35,
                  marginTop: 20,
                  alignSelf: 'flex-end',
                  padding: 2,
                }}
              />
            </View>
            <SketchCanvas
              ref={(ref) => (this.canvas = ref)}
              style={(styles.sketchContainer, {height: 400})}
              strokeColor={'red'}
              strokeWidth={5}
              localSourceImage={this.srcimg}
              onPathsChange={(pathsCount) => {
                this.setState({
                  hasDrawing: pathsCount === 0 ? false : true,
                });
              }}
            />
          </View>

          <View style={styles.rightContainer}>
            <Form
              initialValues={{comment: this.state.comment}}
              onSubmit={this.onSubmit}
              enableReinitialize={true}>
              {({handleSubmit, isSubmitting, values}) => (
                <FormBody handleKeyboard={true} backgroundColor={'transparent'}>
                  <View style={style.formContainer}>
                    {/* <Text
                      weight={'bold'}
                      size={2}
                      color={Theme.primary_color_2}
                      style={{
                        fontFamily: 'Proxima-Nova-Alt-Bold',
                        alignSelf: 'flex-start',
                      }}
                      underline={true}>
                      Add Comment
                    </Text> */}

                    {/*comment*/}
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        maxWidth: 500,
                        marginTop: 10,
                      }}>
                      {/* <View>
                        <Field
                          name={'comment'}
                          component={InputField}
                          placeholder={'Please enter...'}
                          style={{marginBottom: 0, height: 160}}
                          multiline={true}
                          textArea={true}
                          onFocusOut={this.handleOnChange.bind(this)}
                        />
                      </View> */}

                      {/*defect type selector*/}
                      <View style={{marginTop: 30}}>
                        <Text
                          weight={'bold'}
                          size={2}
                          color={Theme.primary_color_2}
                          style={{
                            fontFamily: 'Proxima-Nova-Alt-Bold',
                            alignSelf: 'flex-start',
                          }}
                          underline={true}>
                          Select Defect Type
                        </Text>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            justifyContent: 'flex-start',
                          }}
                          onPress={() =>
                            this.setState({isTypeModalVisible: true})
                          }>
                          <Icon
                            name={'list'}
                            width={20}
                            height={20}
                            fill={Theme.primary_color_2}
                            style={{marginRight: 10}}
                          />
                          <Text
                            size={1.6}
                            weight={'regular'}
                            color={Theme.base_color_5}>
                            Defect Type...
                          </Text>
                        </TouchableOpacity>

                        {this.state.isTypeModalVisible === true && (
                          <MultiSelect
                            alreadySelected={this.state.selectedDefectTypes}
                            handleClose={this.onTypeClose}
                            handleSelected={this.onMultiSelectClose}
                          />
                        )}

                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                          <Tags
                            selectedDefectTypesList={
                              this.state.selectedDefectTypes &&
                              this.state.selectedDefectTypes
                            }
                            handleSelect={this.tagsHandleClose}
                          />
                        </View>

                        {/*take photo*/}
                        {
                          <View style={{marginTop: 30}}>
                            <View>
                              <Text
                                weight={'bold'}
                                size={2}
                                color={Theme.primary_color_2}
                                style={{
                                  fontFamily: 'Proxima-Nova-Alt-Bold',
                                  alignSelf: 'flex-start',
                                }}
                                underline={true}>
                                Add Photo
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={styles.takePhotoContainer}
                              onPress={this.handleTakePicturePress.bind(this)}>
                              {this.state.imageUri && (
                                <Image
                                  source={{uri: this.state.imageUri}}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8,
                                  }}
                                />
                              )}
                              <View style={styles.iconCenter}>
                                <Icons
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
                          </View>
                        }
                      </View>
                      <Button
                        type={'secondary'}
                        disabled={
                          isSubmitting ||
                          // this.state.hasDrawing === false ||
                          this.state.selectedDefectTypes.length < 1 ||
                          this.state.imageUri === null
                        }
                        label={'SUBMIT'}
                        action={handleSubmit}
                        style={{marginTop: 20}}
                      />
                    </View>
                  </View>
                </FormBody>
              )}
            </Form>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  leftContainer: {
    width: '46%',
    marginRight: '10%',
    height: '100%',
  },
  sketchContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sketchHeading: {
    fontSize: 18,
    marginTop: '16%',
    width: '120%',
  },
  sketchSubHeading: {
    color: Theme.base_color_5,
    fontSize: 16,
    marginTop: 10,
  },
  rightContainer: {
    width: '30%',
    backgroundColor: Theme.base_color_9,
    height: '90%',
    alignSelf: 'center',
  },
  textAreaContainer: {},
  textArea: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    textAlignVertical: 'top',
    padding: 20,
    backgroundColor: 'white',
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    padding: 20,
    justifyContent: 'flex-end',
  },
  icons: {},
  takePhotoContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 180,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  iconCenter: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  takeImageMessageView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    opacity: 0.5,
    padding: 10,
    borderRadius: 10,
  },
  capture: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
  },
  takePhotoIconBtn: {},
  captureIcon: {
    marginRight: '5%',
    zIndex: 4,
    alignSelf: 'flex-end',
    padding: 10,
  },
  cameraIconContainer: {
    height: 300,
    justifyContent: 'space-between',
    padding: 20,
  },
});
