// @flow
import * as React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import style from './style';
import PageBGArtwork from '../../../components/PageBGArtwork';
import FooterLine from '../../../components/footerLine';
import Theme from '../../../App.style';
import Text from '../../../components/Text';

type Props = {
  sectionHead?: any,
  sectionBody?: any,
  artType: string,
  title: string,
};

type State = {
  screenHeight: number,
};

const {height} = Dimensions.get('window');

class TwoHalves extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      screenHeight: 0,
    };
  }

  handleContentSizeChange: function = (contentWidth, contentHeight) => {
    this.setState({
      screenHeight: contentHeight,
    });
  };

  render(): React.Node {
    const scrollEnabled = true; // this.state.screenHeight > height;
    return (
      <>
        <View style={style.container}>
          <View style={style.sectionHead}>
            {this.props.sectionHead}
          </View>

          <View style={style.pageArtCorner}>
            <PageBGArtwork type={this.props.artType} />
          </View>
          <ScrollView
            contentContainerStyle={style.scroller}
            scrollEnabled={scrollEnabled}
            // onContentSizeChange={this.handleContentSizeChange}
          >
            <View style={style.contentTitle}>
              <Text
                weight={'regular'}
                size={5}
                underline={true}
                style={style.titleText}
                color={Theme.primary_color_2}>
                {this.props.title}
              </Text>
            </View>
            <View style={style.body}>{this.props.sectionBody}</View>
          </ScrollView>
          <View style={style.footer}>
            <FooterLine />
          </View>
        </View>
      </>
    );
  }
}

export default TwoHalves;
