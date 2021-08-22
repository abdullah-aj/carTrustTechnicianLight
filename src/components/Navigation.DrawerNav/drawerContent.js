import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DrawerItem} from '@react-navigation/drawer';
import Icon from '../Icons';
import {botttomDrawerFunction, drawerFunction} from './DrawerNavConfig';
import Theme from '../../App.style';
import Util from '../../util';
import {hasNotch} from 'react-native-device-info';
import {useDispatch} from 'react-redux';

export const DrawerContent = (props) => {
  const dispatch = useDispatch();
  const {navigation} = props;
  const getActiveRouteState = function (routes, index, name) {
    return routes[index].name.toLowerCase().indexOf(name.toLowerCase()) >= 0;
  };

  const navigateTo = (item) => {
    if (item.action) {
      item.action();
    } else {
      props.navigation.navigate(item.name);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={{height: '20%'}}>
        <Image
          source={require('../../assets/icons/logo_color_2.png')}
          style={{
            height: '40%',
            width: '50%',
            alignSelf: 'flex-start',
            marginLeft: 30,
            marginTop: 30,
          }}
          resizeMode="contain"
        />
      </View>
      <View style={{paddingBottom: 1, height: '82%'}}>
        {props.routesList.map((item, index) => {
          if (item.visible) {
            return (
              <DrawerItem
                focused={getActiveRouteState(
                  props.state.routes,
                  props.state.index,
                  item.name,
                )}
                activeTintColor={Theme.primary_color_1}
                inactiveTintColor={Theme.body_bg_color_1}
                key={index}
                style={
                  getActiveRouteState(
                    props.state.routes,
                    props.state.index,
                    item.name,
                  )
                    ? style.activeItem
                    : style.item
                }
                icon={({focused}) => (
                  <Icon
                    fill={focused ? Theme.base_color_10 : Theme.primary_color_2}
                    width={25}
                    height={20}
                    name={item.iconName}
                  />
                )}
                label={item.label}
                onPress={navigateTo.bind(this, item)}
                labelStyle={
                  getActiveRouteState(
                    props.state.routes,
                    props.state.index,
                    item.name,
                  )
                    ? style.activeLabel
                    : style.label
                }
                {...props}
              />
            );
          }
        })}
        <View
          style={{
            flexDirection: 'column',
            padding: 0,
            height: 230,
            width: 320,
            position: 'absolute',
            bottom: 60,
            left: 0,
            overflow: 'hidden',
          }}>
          <Image
            source={require('../../assets/artwork/page_bg_artwork.png')}
            style={{
              height: '100%',
              width: 390,
              left: -10,
              alignSelf: 'flex-start',
              transform: [{scaleX: -1}],
            }}
            resizeMode="stretch"
          />
        </View>
      </View>
      <View style={style.bottomDrawerSection}>
        {botttomDrawerFunction(navigation).map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.setFunction.bind(this, dispatch)}
              style={style.mainTitleWrapper}>
              <View style={style.iconAndLabel}>
                <Icon
                  name={item.iconName}
                  width={25}
                  height={20}
                  fill={Theme.icon_color_2}
                />
                <Text
                  style={{
                    color: '#000',
                    marginLeft: 15,
                    fontSize: Util.Functions.FontSize(10),
                  }}>
                  {item.label}
                </Text>
              </View>
              <Text
                style={{
                  color: Theme.font_colored,
                  marginRight: 30,
                  fontSize: Util.Functions.FontSize(10),
                }}>
                {item.leftText ? 'English' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    backgroundColor: Theme.header_bg_color_2,
    marginTop: hasNotch() ? 30 : 0,
    height: 80,
    justifyContent: 'center',
  },
  profileImg: {
    width: 150,
    height: 60,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },

  DrawerSection: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  bottomDrawerSection: {
    paddingTop: 5,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  mainTitleWrapper: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    // borderColor:'red',borderWidth:3
  },
  iconAndLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  item: {
    marginLeft: '10%',
    borderRadius: 0,
  },
  activeItem: {
    backgroundColor: 'transparent',
    marginLeft: '10%',
    borderLeftColor: Theme.primary_color_2,
    borderLeftWidth: 3,
    borderRadius: 0,
  },

  label: {
    fontSize: Util.Functions.FontSize(2),
    color: Theme.base_color_4,
    fontWeight: '300',
    marginLeft: -20,
  },
  activeLabel: {
    color: Theme.primary_color_2,
    fontSize: Util.Functions.FontSize(2),
    fontWeight: '600',
    marginLeft: -20,
  },
});
