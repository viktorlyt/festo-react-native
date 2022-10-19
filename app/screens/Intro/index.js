import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Animated,
  Platform,
  NativeModules,
  StatusBar,
} from 'react-native';
import _ from 'lodash';
import Image from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import VersionNumber from 'react-native-version-number';
import { initTranslate } from 'app/lang/Translate';
import { Button } from '@components';
import languageActions from '../../redux/reducers/language/actions';
import { store } from '../../redux/store/configureStore';
import styles from './styles';

export default function Intro({ navigation }) {
  const { languageData } = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const { setLanguage } = languageActions;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier === 'en_US'
        ? 'en'
        : NativeModules.I18nManager.localeIdentifier;
    _.isEmpty(languageData) ? dispatch(setLanguage(deviceLanguage)) : null;
    setTimeout(() => {
      initTranslate(store, true);
    }, 100);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
    }).start();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={'#0000'} translucent />

      <View style={styles.view1}>
        <Animated.View style={[styles.view2, { opacity: fadeAnim }]}>
          <Image
            source={require('@assets/Images/logo.png')}
            style={styles.logoImg}
          />
          <View style={styles.txtView}>
            <Text style={styles.Festotext}>Welcome to Festo</Text>
            <Text style={styles.moretext}>
              Discover the best parties in your area
            </Text>
          </View>
          <View>
            <View style={styles.btnView}>
              <Button
                type="primary"
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                Sign Up
              </Button>
            </View>
            <View style={styles.btnView}>
              <Button
                type="outlined"
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                Login
              </Button>
            </View>
          </View>
        </Animated.View>
        <View style={styles.versionText}>
          <Text style={[styles.btmTxt, { color: '#FFF' }]}>
            {`Version ${VersionNumber.appVersion} (${VersionNumber.buildVersion})`}
          </Text>
        </View>
      </View>
    </>
  );
}
