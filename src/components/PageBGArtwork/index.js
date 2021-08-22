import React from 'react';
import {View, TouchableOpacity, Dimensions, Image} from 'react-native';
import style from './style';
import Theme from '../../App.style';

type Props = {
  style?: *,
  onPress: () => void,
  type: string,
};

getSource = (type) => {
  let src;
  if (type === 'thin') {
    src = require('../../assets/artwork/page_bg_artwork.png');
  } else if (type === 'thick') {
    src = require('../../assets/artwork/art_1.png');
  } else if (type === 'calendar') {
    src = require('../../assets/artwork/page_bg_calender.png');
  } else if (type === 'list') {
    src = require('../../assets/artwork/page_bg_list.png');
  } else if (type === 'calculator') {
    src = require('../../assets/artwork/page_bg_calculator.png');
  } else if (type === 'result') {
      src = require('../../assets/artwork/result_art.png');
  } else {
    src = require('../../assets/artwork/page_bg_artwork.png');
  }
  return src;
};

const PageBGArtwork = (props: Props) => {
  const {style: customStyle} = props;
  const windowWidth = Dimensions.get('window').width;
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'column',
          padding: 0,
          height: 460,
          width: 560,
          position: 'absolute',
          right: -2,
          top: -2,
        }}>
        <Image
          source={getSource(props.type)}
          style={{height: '80%', width: '100%', alignSelf: 'flex-end'}}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
};

export default PageBGArtwork;
