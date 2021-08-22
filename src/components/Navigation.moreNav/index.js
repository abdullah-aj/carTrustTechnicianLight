// @flow
import * as React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Util from '../../util';
import {SetLoginStatus} from '../../redux/actions/setLoginStatus';
import style from '../Navigation.TabNav/style';
import {AppHeader} from '../AppHeader';
import {Navigation_MoreNav_Item} from './navItem';


type Props = {
    close: ()=>void,
    state: *,
    navigation: *,
    descriptors: *,
};
export const Navigation_MoreNav = (props: Props): any => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onPress = React.useCallback((index) => {
        const isFocused = props.state.index === index + 4;
        const route = props.state.routes[index + 5];

        const event = props.navigation.emit({
            type: 'tabPress',
            target: route.key,
        });
        if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(route.name);
        }
        //close modal
        props.close();

    }, [props.state, props.navigation]);

    const logout = React.useCallback(() => {
        Util.Functions.Alert(t('general.logout'), t('general.messages.5'), '0', 'Yes', 'Cancel', (id, isSuccess) => {
            if (isSuccess === true) {
                dispatch(SetLoginStatus(null));
            }
        });
    }, []);

    const changeLanguage = () => {
        // Util.Functions.ChangeLanguage();
    };

    return (
        <View style={style.container}>
            {/* <StatusBar backgroundColor={'white'} barStyle={'light-content'} /> */}
            <AppHeader headerText={'More'} leftIcon={{icon: 'Cancel', action: props.close}}/>
            {
                props.state.routes.slice(5).map((route, index) => {
                    const {options} = props.descriptors[route.key];
                    const iconName = options.tabBarIcon;
                    const isFocused = props.state.index === index + 4;
                    return (
                        <Navigation_MoreNav_Item key={route.name} name={route.name} index={index}
                                                 onPress={onPress.bind(this, index)}
                                                 label={options.tabBarLabel}
                                                 isFocused={isFocused} iconName={iconName}/>
                    );
                })
            }
            <Navigation_MoreNav_Item index={-1} onPress={changeLanguage}
                                     label={t('changeLanguage')}
                                     route={{}} isFocused={false} iconName={'Language'}/>
            <Navigation_MoreNav_Item index={-1} onPress={logout}
                                     label={t('general.logout')}
                                     route={{}} isFocused={false} iconName={'Logout'}/>
        </View>
    );
};
