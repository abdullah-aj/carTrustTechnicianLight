// @flow
import * as React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import Theme from '../../App.style';
import {Loader} from '../../components/Loader';
import Icon from '../../components/Icons';
import Button from '../../components/Button';
import {RNCamera} from 'react-native-camera';
import moment from 'moment';

type Props = {
  CameraOn: boolean,
  closeCamera: () => void,
  takePicture: (param: Object) => void,
};

type State = {
  isLoading: boolean,
  zoom: number,
  autoFocus: string,
  depth: number,
  torch: any,
};

class Camera extends React.Component<Props, State> {
  camera: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      zoom: 0,
      autoFocus: 'on',
      depth: 1,
      torch: RNCamera.Constants.FlashMode.off,
    };
  }

  componentDidMount: function = async () => {};

  zoomOut: function = () => {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  };

  zoomIn: function = () => {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  };

  closeCamera: function = () => {
    this.props.closeCamera();
  };

  takePicture: function = async () => {
    if (this.camera) {
      this.setState({isLoading: true});
      const options = {
        quality: 0.5,
        base64: true,
        skipProcessing: true,
        forceUpOrientation: true,
      };
      const data = await this.camera.takePictureAsync(options);
      this.props.takePicture({
        uri: data.uri,
        type: 'image/jpeg',
        name: 'Image_' + moment().format('YYYY-MM-DD_HH-mm-ss'),
      });
      this.setState({
        isLoading: false,
      });
    }
  };

  toggleTorch: function = () => {
    let torch = this.state.torch;
    if (torch == RNCamera.Constants.FlashMode.off) {
      torch = RNCamera.Constants.FlashMode.torch;
    } else {
      torch = RNCamera.Constants.FlashMode.off;
    }
    this.setState({torch: torch});
  };

  render(): React.Node {
    return (
      <>
        {<Loader visible={this.state.isLoading} message={'Processing...'} />}
        {this.props.CameraOn && (
          <View style={style.cameraContainer}>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{
                flex: 1,
              }}
              flashMode={this.state.torch}
              autoFocus={this.state.autoFocus}
              zoom={this.state.zoom}
              focusDepth={this.state.depth}
              trackingEnabled
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}>
              <View style={style.zoomButtons}>
                <TouchableOpacity onPress={this.zoomIn.bind(this)}>
                  <Icon
                    name={'add'}
                    width={40}
                    height={40}
                    fill={Theme.base_color_7}
                    style={[style.captureIcon]}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.zoomOut.bind(this)}>
                  <Icon
                    name={'minus'}
                    width={40}
                    height={40}
                    fill={Theme.base_color_7}
                    style={[style.captureIcon, {marginTop: 50}]}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.toggleTorch.bind(this)}>
                  <Icon
                    name={
                      this.state.torch === RNCamera.Constants.FlashMode.off
                        ? 'flashOn'
                        : 'flashOff'
                    }
                    width={40}
                    height={40}
                    fill={Theme.base_color_7}
                    style={[style.captureIcon, {marginTop: 50}]}
                  />
                </TouchableOpacity>
              </View>
              <View style={style.cameraIconContainer}>
                <View style={style.cameraIconSubContainer}>
                  <TouchableOpacity onPress={this.closeCamera.bind(this)}>
                    <Icon
                      name={'close'}
                      width={30}
                      height={30}
                      fill={Theme.base_color_10}
                      style={[style.captureIcon, {marginLeft: 50}]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.takePicture.bind(this)}>
                    <Icon
                      name={'camera'}
                      width={80}
                      height={80}
                      fill={Theme.base_color_7}
                      style={style.captureIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </RNCamera>
          </View>
        )}
      </>
    );
  }
}

export default Camera;
