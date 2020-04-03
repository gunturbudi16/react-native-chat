import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import AuthLoading from '../src/screens/auth/AuthLoading';
import Login from '../src/screens/auth/Login';
import Register from '../src/screens/auth/Register';

import HomeScreen from './screens/home/Home';
import ChatScreen from './screens/chat/Chat';
import ProfileScreen from './screens/profile/Profile';
import ContactScreen from './screens/contact/Contact';

import {Image} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {createBottomTabNavigator} from 'react-navigation-tabs';
enableScreens();
const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
});
AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index === 0;
  return {
    tabBarVisible,
  };
};
const TabNavigator = createBottomTabNavigator(
  {
    Chats: AppStack,
    Profile: ProfileScreen,
    Contact: ContactScreen,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let imageName = require('./assets/chat1.png');

        if (routeName === 'Profile') {
          imageName = require('./assets/settings.png');
        }

        if (routeName === 'Map') {
          imageName = require('./assets/map.png');
        }

        if (routeName === 'Contact') {
          imageName = require('./assets/contact.png');
        }

        return (
          <Image
            source={imageName}
            style={{width: 25, resizeMode: 'contain', tintColor}}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: '#eaedf0',
      inActiveColor: '#c2cbd3',
      style: {
        borderTopColor: 'transparent',
        backgroundColor: '#34526e',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 60,
        position: 'absolute',
      },
    },
  },
);
const AuthStack = createStackNavigator({
  Login: Login,
  Register: Register,
});
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: TabNavigator,
      Auth: AuthStack,
    },
    {initialRouteName: 'AuthLoading'},
  ),
);
