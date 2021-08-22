// @flow
import * as React from 'react';
import {View, Modal} from 'react-native';
import style from './style';
import Icon from "../Icons";
import Theme from "../../App.style";
import Text from "../Text";


type Props = {
    visible: boolean,
    onModalHide?: ()=>void,
    message: string,
};
export const Loader = (props: Props) => {
    return (
        <Modal visible={props.visible}  statusBarTranslucent={true}
               onModalHide={props.onModalHide ? props.onModalHide : undefined} transparent={true}
               hardwareAccelerated={true}>
            <View style={style.mainContainer}>
                <View style={style.insideContainer}>
                    <Text weight={"regular"} size={2} color={Theme.base_color_10} style={{marginTop:"24%"}}>{props.message}</Text>
                    <Icon name={'loadingAnimation'} width={150} height={150} style={{backgroundColor:"transparent"}}/>
                </View>
            </View>
        </Modal>
    );
};

export const LoaderSmall = (props: Props) => {
  return (
    <Modal
      visible={props.visible}
      statusBarTranslucent={true}
      onModalHide={props.onModalHide ? props.onModalHide : undefined}
      transparent={true}
      hardwareAccelerated={true}>
      <View style={style.mainContainerSM}>
        <View style={style.insideContainerSM}>
          <Text
            weight={'regular'}
            size={2}
            color={Theme.base_color_2}
            style={{marginTop: '24%'}}>
            {props.message}
          </Text>
          <Icon
            name={'loadingAnimation'}
            width={150}
            height={150}
            style={{backgroundColor: 'transparent'}}
          />
        </View>
      </View>
    </Modal>
  );
};