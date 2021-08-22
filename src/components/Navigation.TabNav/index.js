import * as React from 'react';
import {StyleSheet, TouchableOpacity, View, Modal} from 'react-native';
import _ from 'lodash';
import Theme from '../../App.style'
import style from './style';
import Icon from '../Icons'
import {hasNotch} from "react-native-device-info";
import Text from "../Text";
import {Navigation_MoreNav} from "../Navigation.moreNav";

const TabNavigationContent = ({state, descriptors, navigation, ...props}) => {
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);


    const closeModal = React.useCallback(() => {
        setShowMoreMenu(false);
    }, [showMoreMenu]);
    const onPress = React.useCallback((index) => {
        const isFocused = state.index === index
        const route = state.routes[index];

        if (route.name === 'MoreNav') {
            console.log('iii');
            setShowMoreMenu(true);
        } else {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        }
    }, [state, navigation, descriptors])
    return (
        <View style={[style.mainContainer, style.shadow, {height: hasNotch() ? 80 : 60}]}>
            {
                state.routes.slice(0, 5).map((route, index) => {
                    const {options} = descriptors[route.key];
                    const iconName = options.tabBarIcon
                    const isFocused = state.index === index;
                    return (
                        <TouchableOpacity key={route.name} onPress={onPress.bind(this, index)}
                                          style={{flex: 1, alignItems: 'center'}}>
                            <Icon name={iconName}
                                  fill={isFocused ? Theme.primary_color_2 : Theme.base_color_4}
                                  width={iconName === 'More' ? 24 : 30} height={30}/>
                            <Text size={3} weight={"light"}
                                  style={[{
                                      color: isFocused ? Theme.primary_color_2 : Theme.base_color_4,
                                      textAlign: 'center',
                                  }]}>
                                {options.tabBarLabel}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
            <Modal visible={showMoreMenu} animationType={'slide'}>
                <Navigation_MoreNav state={state} navigation={navigation} descriptors={descriptors} close={closeModal}/>
            </Modal>
        </View>
    );
}

export default TabNavigationContent
