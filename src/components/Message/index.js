// @flow
import * as React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Icon from '../../components/Icons';
import Button from '../../components/Button';
import Theme from '../../App.style';
import style from './style';

class Message extends React.Component {
  static alertInstance;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
      buttons: '',
      type: 'info',
    };

    Message.alertInstance = this;
  }

  static alert = (title, message, buttons, type) => {
    Message.alertInstance._alert(title, message, buttons, type);
  };

  _alert = (title, message, buttons, type) => {
    this.setState({visible: true, title, message, buttons, type});
  };

  render(): React.Node {
    return (
      <Modal
        visible={this.state.visible}
        statusBarTranslucent={true}
        transparent={true}
        hardwareAccelerated={true}>
        <View style={style.dimBackground}>
          <View style={style.modalBody}>
            <View style={style.headRow}>
              <View style={style.titleSec}>
                <View style={style.titleTextBlock}>
                  <Text size={4} style={style.titleText}>
                    {this.state.title}
                  </Text>
                </View>
              </View>
              <View style={style.closeSec}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({visible: false});
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
            </View>
            <View style={style.contentRow}>
              <Text size={2} style={style.contentText}>
                {this.state.message}
              </Text>
            </View>
            <View style={style.buttonRow}>
              {Array.isArray(this.state.buttons) &&
              this.state.buttons.length ? (
                this.state.buttons.map((btn) => (
                  <>
                    <Button
                      type={'tertiary'}
                      label={btn.text}
                      action={async () => {
                        await btn.onPress();
                        await this.setState({
                          visible: false,
                        });
                      }}
                      style={[
                        this.state.buttons.length === 1 && style.oneButtonStyle,
                        this.state.buttons.length === 2 && style.twoButtonStyle,
                        this.state.buttons.length === 3 &&
                          style.threeButtonStyle,
                        btn.type && btn.type === 'yes' && style.buttonYes,
                        btn.type && btn.type === 'no' && style.buttonNo,
                      ]}
                      fontStyle={[
                        btn.type && btn.type === 'yes' && style.buttonYes,
                        btn.type && btn.type === 'no' && style.buttonNo,
                      ]}
                      disabled={false}
                    />
                  </>
                ))
              ) : (
                <>
                  <Button
                    label={'OK'}
                    action={async () => {
                      await this.setState({
                        visible: false,
                      });
                    }}
                    style={style.oneButtonStyle}
                    disabled={false}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default Message;
