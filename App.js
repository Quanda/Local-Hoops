import React from 'react';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Chat from './components/Chat';
import Account from './components/Account';
import AuthLoading from './components/AuthLoading';
import Login from './components/Login';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { YellowBox, Image } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import store from './store';
import { Provider } from 'react-redux'
YellowBox.ignoreWarnings(['Class RCTCxxModule']);


const AuthStack = createStackNavigator({ SignIn: Login });
const AppStack = createBottomTabNavigator({
  Dashboard: { screen: Dashboard },
  Explore: { screen: Explore },
  Chat: { screen: Chat },
  Account: { screen: Account }
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      let iconColor = '#4B4B4B'
      if (routeName === 'Dashboard') {
        iconName = 'md-home';
      } else if (routeName === 'Explore') {
        iconName = 'md-compass';
      } else if (routeName === 'Chat') {
        iconName = 'md-chatboxes'
      } else if (routeName === 'Account') {
        iconName = 'md-person'
      }
      if(focused) {
        iconColor = '#EB5333'
      }
      return <IonIcon name={iconName} size={30} color={iconColor}/>
    },
  }),
  tabBarOptions: {
    style: {
      backgroundColor: '#FAFAFA',
      height: 55
    },
    tabStyle: {
    },
    showLabel: true,
    activeTintColor: '#EB5333',
    inactiveTintColor: 'gray',
  },
}
);

const Nav = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default App = () => {
  return (
      <Provider store={store}>
          <Nav />
      </Provider>
  );
} 

