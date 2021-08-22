// @flow
import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import Theme from '../../../App.style';
import {AppHeader} from '../../../components/AppHeader';
import PageBGArtwork from '../../../components/PageBGArtwork';
import AP from '../../../api';
import Icon from '../../../components/Icons';
import Button from '../../../components/Button';

type Props = {
  navigation: {
    goBack: () => void,
    push: any,
  },
  route: {
    params: any,
  },
  bookingId: number,
};

type State = {
  hasDrawing: boolean,
  bookingId: number,
};

const {height, width} = Dimensions.get('screen');

class Signature extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasDrawing: false,
      bookingId: 0,
    };
  }

  componentDidMount: function = () => {
    const {bookingId} = this.props.route.params;
    this.setState({
      bookingId: bookingId,
    });
  };

  handleProfileClick: function = () => {};

  handleSearchClick: function = () => {};

  handleGoBack: function = () => {
    this.props.navigation.goBack();
  };

  clearCanvas: function = () => {
    this.setState({
      hasDrawing: false,
    });
    this.canvas.clear();
  };

  handleConfirmSave: function = () => {
    const IMG_TYPE = 'jpeg';
    this.canvas.getBase64(
      IMG_TYPE,
      false,
      false,
      false,
      true,
      (err, result) => {
        try {
          AP.Calls.Booking.acceptTerms({
            id: this.state.bookingId,
            customer_signature: result,
            memetype: 'image/' + IMG_TYPE,
          })
            .then((res) => {
              const {
                bookingId,
                customerId,
                vehicleId,
                type,
                amount,
                technicianId,
              } = this.props.route.params;

              this.props.navigation.push('payment', {
                bookingId,
                technicianId,
                customerId,
                vehicleId,
                amount,
                type,
              });
            })
            .catch((e) => {
              console.log('Error :>> ', e);
            });
        } catch (e) {
          console.log('Error :>> ', e);
        }
      },
    );
  };

  render(): React.Node {
    return (
      <>
        <View style={styles.container}>
          <AppHeader
            type={2}
            headerLogo={false}
            headerImg={false}
            headerImgPath={''}
            headerText={'Sign to accept terms & conditions'}
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
          <View style={{opacity: 0.1}}>
            <PageBGArtwork
              type={'thick'}
              style={{position: 'absolute', marginTop: -5}}
            />
          </View>

          <View style={styles.canvasContainer}>
            <SketchCanvas
              ref={(ref) => (this.canvas = ref)}
              style={styles.sketchContainer}
              strokeColor={'dodgerblue'}
              strokeWidth={5}
              onPathsChange={(pathsCount) => {
                this.setState({
                  hasDrawing: pathsCount === 0 ? false : true,
                });
              }}
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              type={'tertiary'}
              label={'CLEAR'}
              disabled={this.state.hasDrawing === false}
              action={this.clearCanvas.bind(this)}
              style={[
                {width: 150, marginRight: 20, elevation: 0},
                this.state.hasDrawing === false ? {opacity: 0.4} : ``,
              ]}
            />
            <Button
              label={'SAVE'}
              disabled={this.state.hasDrawing === false}
              action={this.handleConfirmSave.bind(this)}
              style={[
                {width: 150, backgroundColor: Theme.primary_color_2},
                this.state.hasDrawing === false ? {opacity: 0.4} : ``,
              ]}
            />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    paddingLeft: 100,
  },
  canvasContainer: {
    width: '100%',
    height: height - Theme.header_height - 150,
    borderTopWidth: 1,
    borderColor: Theme.base_color_7,
    borderBottomWidth: 1,
    marginTop: Theme.header_height,
  },
  sketchContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sketchHeading: {
    fontSize: 18,
  },
  buttonRow: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 50,
    paddingTop: 20,
  },

  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default Signature;
