/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useReducer, useEffect } from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { EventRegister } from 'react-native-event-listeners';
import Toast from 'react-native-toast-message';
import { UToast } from '@components/Toast/UToast';
import SplashScreen from '@screens/SplashScreen';
// import Notification from '@screens/Alerts';
import Intro from '@screens/Intro';
import Login from '@screens/Login';
import Otp from '@screens/Otp';
import { NotificationContext, NoInternet } from '@components';
import RemotePushController from '@components/Common/RemotePushController';
import notificationReducer from '@redux/reducers/notificationReducer';
import { store } from '@redux/store/configureStore';
import AuthAction from '@redux/reducers/auth/actions';
import { BaseColors, DarkBaseColor } from '@config/theme';
import { navigationRef } from './NavigationService';
import BottomTabBar from './BottomTabBar';
import Find_Friend from '@screens/Find_Friend';
import Create_Profile from '@screens/Create_Profile';
import DiscoverList from '@screens/DiscoverList';
import DiscoverMap from '@screens/DiscoverMap';
import FindScreen from '@screens/FindScreen';
import Profile from '@screens/Profile';
import Party from '@screens/Party';
import AddCreditCard from '@screens/AddCreditCard';
import AddCreditCard2 from '@screens/AddCreditCard2';
import Chat from '@screens/Chat';
import Settings from '@screens/Settings';
import Notifications from '@screens/Notifications';
import Search from '@screens/Search';
import NewSearch from '@screens/NewSeach';
import AddIntrest from '@screens/AddIntrest';
import PaymentMethod from '@screens/PaymentMethod';
import GetPaid from '@screens/GetPaid';
import AddBankAc from '@screens/AddBankAc';
import Events from '@screens/Events';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import Friends from '@screens/Friends';
import ChatMessage from '@screens/ChatMessage';
import SideDrawer from './SideDrawer';
import SeeAllPeople from '@screens/SeeAllPeople';
import CreateParty from '@screens/CreateParty';

const intitialNotificationState = {
  notification: null,
  openedNotification: null,
  countOfNotification: 0,
};
const IOS = Platform.OS === 'ios';

function App() {
  const dispatch = useDispatch();
  const { setBaseColor, setDarkmode, setActiveScreen } = AuthAction;

  const [Notifystate, dispatchState] = useReducer(
    notificationReducer,
    intitialNotificationState,
  );
  const notiValue = useMemo(() => {
    return { Notifystate, dispatchState };
  }, [Notifystate, dispatchState]);

  const darkmode = store.getState().auth.darkmode;

  if (darkmode === false) {
    dispatch(setBaseColor(BaseColors));
  } else {
    dispatch(setBaseColor(DarkBaseColor));
  }

  const [darkApp, setdarkApp] = useState(darkmode);

  useEffect(() => {
    const eventListener = EventRegister.addEventListener(
      'changeAppTheme',
      (data) => {
        setdarkApp(data);
        dispatch(setDarkmode(data));
      },
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...BaseColors,
    },
  };

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkBaseColor,
    },
  };

  const appTheme = darkApp ? darkTheme : lightTheme;
  console.log('app theme ====>>>>> ', appTheme);

  const Stack = createStackNavigator();
  // const Tab = createBottomTabNavigator();
  const Tab = createMaterialTopTabNavigator();
  // const Drawer = createDrawerNavigator();

  // const HomeStack = createStackNavigator();

  // const HomeStackNavigator = () => {
  //   return (
  //     <HomeStack.Navigator
  //       detachInactiveScreens={IOS ? true : false}
  //       screenOptions={{ animationEnabled: false }}>
  //       <HomeStack.Screen
  //         name="Home"
  //         component={Home}
  //         options={{ headerShown: false }}
  //       />
  //     </HomeStack.Navigator>
  //   );
  // };

  // const NotificationStackNavigator = () => {
  //   return (
  //     <NotificationStack.Navigator
  //       detachInactiveScreens={IOS ? true : false}
  //       screenOptions={{ animationEnabled: false }}>
  //       <NotificationStack.Screen
  //         name="Notification"
  //         component={Notification}
  //         options={{ headerShown: false }}
  //       />
  //     </NotificationStack.Navigator>
  //   );
  // };

  // const BottomTabsNavigator = () => {
  //   return (
  //     <Tab.Navigator
  //       initialRouteName={isProvider() ? 'Chat' : 'HomeStackNavigator'}
  //       tabBar={(props) => <BottomTabBar {...props} />}>
  //       <Tab.Screen name="HomeStackNavigator" component={HomeStackNavigator} />
  //     </Tab.Navigator>
  //   );
  // };
  const BottomTabsNavigator = () => {
    const bottomTabSwipe = useSelector((state) => state.auth.bottomTabSwipe);
    return (
      <Tab.Navigator
        initialRouteName={'Party'}
        swipeEnabled={bottomTabSwipe}
        tabBarPosition={'bottom'}
        tabBar={(props) => <BottomTabBar {...props} />}>
        <Tab.Screen name="Party" component={Party} />
        <Tab.Screen name="DiscoverMap" component={DiscoverMap} />
        <Tab.Screen name="Chat" component={Chat} />
        {/* <Tab.Screen name="Wallet" component={Wallet} /> */}
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  };

  // const DrawerNavigator = () => (
  //   <Drawer.Navigator
  //     initialRouteName="Setting"
  //     detachInactiveScreens={IOS ? true : false}
  //     screenOptions={{ animationEnabled: false }}
  //     drawerStyle={{ width: '80%' }}
  //     drawerContent={(props) => <SideDrawer {...props} />}
  //     openByDefault={false}>
  //     {/* <Drawer.Screen name="Dashboard" component={BottomTabsNavigator} /> */}
  //   </Drawer.Navigator>
  // );

  const getActiveRouteName = (state) => {
    const route = state.routeNames[state.index];
    if (route.state) {
      return getActiveRouteName(route.state);
    }
    return route.name;
  };

  /* Toast Design */
  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => <UToast {...props} type={'success'} />,
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => <UToast {...props} type={'error'} />,
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.

      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: (props) => <UToast {...props} type={'success'} />,
  };

  return (
    <NotificationContext.Provider value={notiValue}>
      <RemotePushController />
      {/* <GlobalContext.Provider
        value={{ contextValue, changeValue: (v) => setContextValue(v) }}> */}
      <NavigationContainer
        ref={navigationRef}
        theme={appTheme}
        // onStateChange={async (state) => {
        //   console.log(
        //     '🚀 ~ file: NavigationStack.js ~ line 438 ~ App ~ state',
        //     state,
        //   );
        //   const currentRouteName = await getActiveRouteName(state);
        //   console.log(
        //     '🚀 ~ file: NavigationStack.js ~ line 443 ~ App ~ currentRouteName',
        //     currentRouteName,
        //   );
        //   if (!isEmpty(currentRouteName)) {
        //     dispatch(setActiveScreen(currentRouteName));
        //   }
        // }}
      >
        <Stack.Navigator
          initialRouteName={'SplashScreen'}
          detachInactiveScreens={IOS ? true : false}
          screenOptions={{
            animationEnabled: true,
            gestureEnabled: IOS ? true : false,
          }}>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false, animationEnabled: false }}
          />
          <Stack.Screen
            name="Intro"
            component={Intro}
            options={{
              headerShown: false,
              animationEnabled: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Dashboard"
            component={DrawerNavigator}
            options={{ headerShown: false, gestureEnabled: false }}
          /> */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="Otp"
            component={Otp}
          />
          <Stack.Screen
            name="Find_Friend"
            component={Find_Friend}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Create_Profile"
            component={Create_Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Party"
            component={BottomTabsNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DiscoverList"
            component={DiscoverList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DiscoverMap"
            component={DiscoverMap}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateParty"
            component={CreateParty}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FindScreen"
            component={FindScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddIntrest"
            component={AddIntrest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewSearch"
            component={NewSearch}
            options={{ headerShown: false, animationEnabled: false }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentMethod"
            component={PaymentMethod}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddCreditCard"
            component={AddCreditCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddCreditCard2"
            component={AddCreditCard2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddBankAc"
            component={AddBankAc}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GetPaid"
            component={GetPaid}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Events"
            component={Events}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Friends"
            component={Friends}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatMessage"
            component={ChatMessage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SeeAllPeople"
            component={SeeAllPeople}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Dashboard"
            component={BottomTabsNavigator}
            options={{ headerShown: false, gestureEnabled: false }}
          /> */}
        </Stack.Navigator>
        <NoInternet />
      </NavigationContainer>
      {/* </GlobalContext.Provider> */}
      <Toast
        type={'success'}
        position={'bottom'}
        bottomOffset={120}
        config={toastConfig}
      />
    </NotificationContext.Provider>
  );
}

export default App;
