//common
import * as React from 'react';
import {
  NativeModules,
  LayoutAnimation,
  UIManager,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { openSettings } from 'react-native-permissions';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Linking } from 'react-native';
import RNRestart from 'react-native-restart';
import AuthAction from '@redux/reducers/auth/actions';
import { navigationRef } from 'app/navigation/NavigationService';
import NotificationAction from '@redux/reducers/notification/actions';
import { store } from '@redux/store/configureStore';
import BaseSetting from '@config/setting';
import { CAlert } from '@components';

const langJson = require('app/lang/en.json');
const IOS = Platform.OS === 'ios';
const { setAccessToken } = AuthAction;

export const logout = () => {
  store.dispatch(setAccessToken(''));
  navigationRef?.current?.reset({
    index: 0,
    routes: [{ name: 'Intro' }],
  });
};

export const getDevLang = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  const dvlangSplit = deviceLanguage.split('_');
  const dvlang = dvlangSplit[0].toString();

  if (dvlang == 'zh') {
    return 'zh-Hant';
  } else if (dvlang == 'fil') {
    return 'fil';
  } else {
    return 'en-us';
  }
};

export function isValidPhonenumber(inputtxt) {
  let phoneno = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

export const enableAnimateInEaseOut = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const enableAnimateLinear = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
};

export const enableAnimateSpring = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
};

// This functions try to fetch the current location.
/**
 * This functions try to fetch the current location.
 * @function getCurrentLocationTry
 * @param {boolean} disableHighAccuracy
 *
 */
export const getCurrentLocationTry = async (disableHighAccuracy = false) => {
  if (disableHighAccuracy) {
    console.log('Trying again Fetching location with Low Accuracy');
  } else {
    console.log('Fetching location with High Accuracy');
  }
  let hasLocationPermissions = await hasLocationPermission();
  return new Promise(async (resolve, reject) => {
    if (!hasLocationPermissions) {
      Linking.openURL('app-settings:');
      reject({ message: 'Permission Denied' });
    }
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('LONGITUDE', position.coords.longitude);
        console.log('LATITUDE', position.coords.latitude);
        resolve(position);
      },
      (error) => {
        if (
          (error.code === 3 || error.code === 2 || error.code === 1) &&
          !disableHighAccuracy
        ) {
          //Timeout fetching so try without high accuracy option.
          console.log('Fetching loc with High accuracy failed');
          store.dispatch(AuthAction.setLocationPermission(true));
          if (IOS && disableHighAccuracy) {
            CAlert(
              'location_request',
              'enable_gps',
              () => openSettings(),
              () => {},
              'Turn On',
              'Cancel',
            );
          }
          resolve('Failed');
        }
        if (disableHighAccuracy) {
          console.log('error while getting location', error);
          reject(error);
        }
      },
      disableHighAccuracy
        ? BaseSetting.geolocationOptions
        : BaseSetting.geoOptionHighAccurate,
    );
  });
};

/**
 *check location permission
 * @function  hasLocationPermission
 */
export const hasLocationPermission = async () => {
  if (
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version < 23)
  ) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user. Please allow location permission',
      ToastAndroid.LONG,
    );
    //open user setting for permisson.
    openSettings();
  }

  return false;
};
/**
 * get location
 * @function  getLocation
 */
export const getLocation = async () => {
  console.log('getLocation()');
  let hasLocationPermissions = await hasLocationPermission();
  console.log('Has Permission>>>', hasLocationPermissions);
  return new Promise((resolve, reject) => {
    if (!hasLocationPermissions) {
      reject({ message: 'Permission Denied' });
    }
    Geolocation.getCurrentPosition(
      (data) => {
        console.log('getLocation() data>>>', data);
        resolve(data.coords);
      },
      (err) => {
        console.log('getLocation() error:', err);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3600000 },
    );
  });
};
/**
 * Get map data
 * @function GetMapData
 * @param {object} data
 *
 */
export const GetMapData = async function (data) {
  console.log(data);
  let path = `/nearbysearch/json?location=${data.Latitude},${data.Longitude}&radius=1500&type=${data.type}&key=${BaseSetting.MAPS_API_CALL_KEY}`;
  let url = BaseSetting.MAPS_URL + path;
  console.log('Map_Url>>>', url);
  try {
    let response = await axios.get(url);
    let responseStatus = response.status;
    let returnObj = {
      status: responseStatus,
      responseJson: JSON.stringify(response),
    };
    return returnObj;
  } catch (error) {
    console.error(error);
  }
};

/**
 * GetMapCallData function
 * @function GetMapCallData
 * @param {string|number} place_id
 * @returns {object}
 */
export const GetMapCallData = async function (place_id) {
  let path = `/details/json?place_id=${place_id}&fields=formatted_phone_number&key=${BaseSetting.MAPS_API_CALL_KEY}`;
  let url = BaseSetting.MAPS_URL + path;
  console.log('Map_Url>>>', url);
  try {
    let response = await axios.get(url);
    let responseStatus = response.status;
    let returnObj = {
      status: responseStatus,
      responseJson: JSON.stringify(response),
    };
    return returnObj;
  } catch (error) {
    console.error(error);
  }
};

export function saveRecentlyPlayedStations(recentStations) {
  AsyncStorage.setItem('recently_played', JSON.stringify(recentStations));
}

export function getRecentlyVisitedStations(callback) {
  AsyncStorage.getItem('recently_played').then((value) => {
    callback(value);
  });
}
export function saveRadioData(radioData) {
  AsyncStorage.setItem('radioData', JSON.stringify(radioData));
}

export const checkLang = (value) => {
  if (langJson.hasOwnProperty(value)) {
    return true;
  } else {
    return false;
  }
};

export const checkPermission = async (type) => {
  // console.log('🚀🚀🚀🚀 ~ checkPermission ~ type', type);
  let permissontypes;
  if (type === 'Download') {
    permissontypes = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  }
  if (type === 'contact') {
    permissontypes = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
  }
  try {
    const granted = await PermissionsAndroid.request(permissontypes);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted');
      return true;
      // dispatch(setStoragePermisson(true));
    } else {
      console.log('Permission denied');
      return false;
      // setIsDownloading(false);
    }
  } catch (err) {
    console.log('Permission catch error', err);
    return false;
    // setIsDownloading(false);
  }
};

export const handleMode = (d) => {
  return new Promise(async (resolve, reject) => {
    try {
      // if (EventRegister) {
      //   EventRegister.emit('changeAppTheme', d);
      // }
      store.dispatch(AuthAction.setDarkmode(d));
      setTimeout(() => {
        RNRestart.Restart();
      }, 500);
    } catch (error) {
      console.log(
        '🚀 ~ file: CommonFunction.js ~ line 851 ~ returnnewPromise ~ error',
        error,
      );
    }
  });
};
