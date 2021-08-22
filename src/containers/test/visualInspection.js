// @flow
import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Image,
  LogBox,
  TouchableOpacity,
  Modal,
  ScrollView,
  //Alert,
} from 'react-native';
import style from './style';
import Text from '../../components/Text';
import {AppHeader} from '../../components/AppHeader';
import Theme from '../../App.style';
import PageContainer from '../../components/PageContainer';
import Button from '../../components/Button';
import Button_Text from '../../components/Button.text';
import AP from '../../api';
import Card from '../../components/Card';
import Icon from '../../components/Icons';
import SketchDraw from '../sketchCanvasTest';
import {Loader} from '../../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Message from '../../components/Message';

type Props = {
  navigation: {
    goBack: () => void,
    push: (param1: string, param2: Object) => void,
  },
  route: {
    params: {
      bookingId: number,
    },
  },
};

const aSyncStorageKey = 'visual_inspection';

const VisualInspection = (props: Props): any => {
  const [isDisabled, setDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLoading, setIsLoading] = useState('');
  const [bookingId, setBookingId] = useState(0);
  const [completedSidesStatus, setCompletedSidesStatus] = useState({
    left_side: false,
    right_side: false,
    roof: false,
    back: false,
    front: false,
  });

  const SIDE_LEFT_IMG = require('../../../android/app/src/main/res/drawable/left_side.jpg');
  const SIDE_RIGHT_IMG = require('../../../android/app/src/main/res/drawable/right_side.jpg');
  const SIDE_TOP_IMG = require('../../../android/app/src/main/res/drawable/roof.jpg');
  const SIDE_BACK_IMG = require('../../../android/app/src/main/res/drawable/back.jpg');
  const SIDE_FRONT_IMG = require('../../../android/app/src/main/res/drawable/front.jpg');

  const SIDE_LEFT_NAME = 'left_side';
  const SIDE_RIGHT_NAME = 'right_side';
  const SIDE_TOP_NAME = 'roof';
  const SIDE_BACK_NAME = 'back';
  const SIDE_FRONT_NAME = 'front';

  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem(aSyncStorageKey);
      setBookingId(props.route.params.bookingId);
      checkBtnDisable();
      return async () => {
        await AsyncStorage.removeItem(aSyncStorageKey);
      };
    })();
  }, [props]);

  const handleImgPress = (image) => {
    setModalVisible(true);
    setSelectedImg(image);
  };

  const onSubmit = async (values) => {
    let vInspectionData = await AsyncStorage.getItem(aSyncStorageKey);
    if (vInspectionData) {
      let completedSides = 0;
      vInspectionData = JSON.parse(vInspectionData);
      const data = [];
      for (let side in vInspectionData) {
        if (vInspectionData.hasOwnProperty(side)) {
          completedSides++;
          const formData = new FormData();
          formData.append('booking_id', bookingId);
          formData.append('vehicle_side', side);
          formData.append('camera_image', {
            uri: vInspectionData[side].cameraImg,
            type: 'image/jpeg',
            name: side + '_camera_' + moment().format('YYYY-MM-DD_HH-mm'),
          });
          formData.append('marked_image', {
            uri: vInspectionData[side].markedImg,
            type: 'image/jpeg',
            name: side + '_marked_' + moment().format('YYYY-MM-DD_HH-mm'),
          });
          formData.append(
            'defect_type',
            JSON.stringify(vInspectionData[side].defectsType),
          );
          formData.append('comment', vInspectionData[side].comment);
          data.push(formData);
        }
      }
      if (completedSides < 5) {
        Message.alert(
          'Info',
          `You have Inspected ${completedSides}/5 sides. Please Inspect all Sides?`,
          [
            {
              text: 'OK',
              onPress: async () => {},
              type: 'yes',
            },
          ],
        );
      } else {
        setIsLoading('Saving ...');
        await submitVisualInspection(data);
      }
    }
  };

  const submitVisualInspection: function = async (data) => {
    console.log(data);
    const asyncRes = await Promise.all(
      data.map(async (obj, i) => {
        //console.log(obj);
        //if (i < 2) {
        try {
          setIsLoading(`Saving Side ${i + 1}/${data.length}`);
          const response = await AP.Calls.VisualInspection.addVisualInspection(
            obj,
          );
          return true;
        } catch (e) {
          console.log('Error :>> ', e);
          return false;
        }
        //}
      }),
    );
    const check = asyncRes.find((i) => i === false);
    if (typeof check !== 'undefined') {
      setIsLoading('');
      Message.alert(
        'Error',
        'Saved with some Errors. Please Contact Admin to confirm',
        [
          {
            text: 'OK',
            onPress: async () => {
              concludeSubmission();
            },
            type: 'yes',
          },
        ],
      );
    } else {
      concludeSubmission();
    }
  };

  const concludeSubmission: function = async () => {
    setIsLoading('Updating Status ...');
    await AsyncStorage.removeItem(aSyncStorageKey);
    try {
      const response = await AP.Calls.Booking.setBookingStatus({
        booking_id: bookingId,
        status: 'visually_inspected',
      });
      setIsLoading('');
      props.navigation.push('Test', {
        bookingId: bookingId,
        inspectionType: props.route.params.inspectionType,
        status: props.route.params.status,
      });
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  const checkBtnDisable: function = async () => {
    if (await AsyncStorage.getItem(aSyncStorageKey)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  const handleGoBack: function = () => {
    props.navigation.goBack();
  };

  const handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  const handleCardClick: function = (bookingId) => {
    props.navigation.push('confirmation', {
      bookingId: bookingId,
    });
  };

  const completeInspection: function = async () => {
    const sides = {...completedSidesStatus};
    let vInspectionData = await AsyncStorage.getItem(aSyncStorageKey);
    if (vInspectionData) {
      vInspectionData = JSON.parse(vInspectionData);
      for (let side in vInspectionData) {
        if (vInspectionData.hasOwnProperty(side)) {
          sides[side] = true;
        }
      }
      setCompletedSidesStatus(sides);
    }
    setModalVisible(false);
    checkBtnDisable();
  };

  return (
    <View style={{flex: 1, backgroundColor: Theme.base_color_8}}>
      <Message />
      <Loader visible={isLoading !== ''} message={isLoading} />
      <AppHeader
        type={2}
        headerLogo={false}
        headerImg={false}
        headerImgPath={''}
        headerText={'Visual Inspection'}
        rightIcon={[
          {
            icon: 'Profile',
            action: handleProfileClick,
            fill: Theme.primary_color_2,
            bg: Theme.base_color_10,
          },
          {
            icon: 'Search',
            action: handleSearchClick,
            fill: Theme.primary_color_2,
            bg: Theme.base_color_10,
          },
        ]}
        leftIcon={{
          icon: 'backBtn',
          action: handleGoBack,
          fill: Theme.primary_color_2,
          bg: Theme.base_color_10,
        }}
      />

      {modalVisible && selectedImg && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <SketchDraw
            img={selectedImg}
            onComplete={completeInspection}
            aSyncStorageKey={aSyncStorageKey}
          />
        </Modal>
      )}
      <ScrollView
        style={{
          height: '100%',
          marginTop: Theme.page_margin_for_transparent_header,
        }}>
        <Card style={style.cardContainerLarge}>
          <Text weight={'regular'} color={Theme.base_color_5} size={3}>
            {' '}
            Select an inspection view from below to continue...
          </Text>
          <View style={style.imagesContainer}>
            <TouchableOpacity
              onPress={handleImgPress.bind(this, SIDE_LEFT_NAME)}>
              <View style={[style.imgNumber]}>
                {completedSidesStatus[SIDE_LEFT_NAME] === false ? (
                  <>
                    <Text size={5} style={style.imgNumberText}>
                      1
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name={'tick'}
                      width={40}
                      height={40}
                      fill={Theme.primary_color_3}
                    />
                  </>
                )}
              </View>
              <Image style={style.img} source={SIDE_LEFT_IMG} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImgPress.bind(this, SIDE_FRONT_NAME)}>
              <View style={[{marginLeft: 50}, style.imgNumber]}>
                {completedSidesStatus[SIDE_FRONT_NAME] === false ? (
                  <>
                    <Text size={5} style={style.imgNumberText}>
                      2
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name={'tick'}
                      width={40}
                      height={40}
                      fill={Theme.primary_color_3}
                    />
                  </>
                )}
              </View>
              <Image style={style.img} source={SIDE_FRONT_IMG} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImgPress.bind(this, SIDE_RIGHT_NAME)}>
              <View style={[style.imgNumber]}>
                {completedSidesStatus[SIDE_RIGHT_NAME] === false ? (
                  <>
                    <Text size={5} style={style.imgNumberText}>
                      3
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name={'tick'}
                      width={40}
                      height={40}
                      fill={Theme.primary_color_3}
                    />
                  </>
                )}
              </View>
              <Image style={style.img} source={SIDE_RIGHT_IMG} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImgPress.bind(this, SIDE_BACK_NAME)}>
              <View style={[{marginLeft: 50}, style.imgNumber]}>
                {completedSidesStatus[SIDE_BACK_NAME] === false ? (
                  <>
                    <Text size={5} style={style.imgNumberText}>
                      4
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name={'tick'}
                      width={40}
                      height={40}
                      fill={Theme.primary_color_3}
                    />
                  </>
                )}
              </View>
              <Image style={style.img} source={SIDE_BACK_IMG} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImgPress.bind(this, SIDE_TOP_NAME)}>
              <View style={[{marginLeft: -30}, style.imgNumber]}>
                {completedSidesStatus[SIDE_TOP_NAME] === false ? (
                  <>
                    <Text size={5} style={style.imgNumberText}>
                      5
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name={'tick'}
                      width={40}
                      height={40}
                      fill={Theme.primary_color_3}
                    />
                  </>
                )}
              </View>
              <Image style={style.imgLarge} source={SIDE_TOP_IMG} />
            </TouchableOpacity>
          </View>
          <View style={style.btnContainer}>
            <Button
              label={'Next'}
              action={onSubmit}
              style={{marginTop: '10%', marginBottom: '10%'}}
              disabled={isDisabled}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default VisualInspection;
