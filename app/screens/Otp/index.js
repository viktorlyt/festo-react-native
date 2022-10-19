/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import nToast from 'react-native-toast-message';

import { BaseColors } from '@config/theme';
import Toast from 'react-native-simple-toast';
import AuthAction from '@redux/reducers/auth/actions';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import _ from 'lodash';
import '@react-navigation/native';
import '@react-native-firebase/auth';
import { Text, Header, Button } from '@components';

import styles from './styles';

function OtpScreen({ navigation, route }) {
  const IOS = Platform.OS === 'ios';
  const dispatch = useDispatch();
  const { fcmToken } = useSelector((state) => state.notification);
  const { setAccessToken, setUserData, setIsBankAccountAdded } = AuthAction;
  const [resendViewVisible, setResendViewVisible] = useState(false);
  const otpInputRef = useRef('');
  const phone = route?.params?.phone || '';
  const countryCode = route?.params?.countryCode || '';
  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [output, setOutput] = useState('');
  const [timerCount, setTimer] = useState(60);
  const number = phone;
  const lastNum = number.slice(5, 10);

  const [keyboardShow, setKeyboardShow] = useState();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    setTimer(60);
  }, []);

  useEffect(() => {
    if (timerCount === 0) {
      setResendViewVisible(true);
      ReSendOTP();
    }

    if (!timerCount) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimer(timerCount - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerCount]);

  //API Call for ReSendOTP
  async function ReSendOTP() {
    try {
      setLoader(true);
      const data = {
        'SignupForm[country_code]': `+${countryCode}`,
        'SignupForm[phone]': phone,
      };
      const resp = await getApiData(
        BaseSetting.endpoints.ResendOTP,
        'POST',
        data,
      );
      if (resp?.status) {
        setTimer(60);
        setLoader(false);
        setOutput('');
        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah !',
          text2: resp?.message || '',
        });
        // Toast.show(resp?.message || '');
      } else {
        nToast.show({
          type: 'error', // success / error
          text1: 'Error !',
          text2: resp?.message || '',
        });
        setLoader(false);
      }
    } catch (error) {
      nToast.show({
        type: 'error', // success / error
        text1: 'Error !',
        text2: error.toString(),
      });
      // Toast.show(error.toString());
      console.log('ERRRRR 123', error);
      setLoader(false);
    }
  }
  //API Call for OTPVerify
  async function OTPVerify(code) {
    try {
      setBtnLoader(true);
      let otp;
      if (code.length === 4) {
        otp = output.length === 4 && output ? output : code;
      }

      const data = {
        'VerifyOtpForm[phone]': phone,
        'VerifyOtpForm[otp]': otp,
        'VerifyOtpForm[uuid]': fcmToken,
      };
      const resp = await getApiData(
        BaseSetting.endpoints.OtpVerify,
        'POST',
        data,
      );
      if (resp?.status) {
        setBtnLoader(false);
        dispatch(setUserData(resp?.data));
        dispatch(setAccessToken(resp?.data.access_token));
        dispatch(setIsBankAccountAdded(resp?.data.is_bank_account_added));
        setOutput('');
        if (resp?.data?.isProfileSetup === 0) {
          navigation.reset({
            routes: [{ name: 'Create_Profile', from: 'otp' }],
          });
        } else {
          navigation.reset({
            routes: [{ name: 'Party', isProfileSetup: true }],
          });
        }
      } else {
        // Toast.show(resp?.message || '');
        nToast.show({
          type: 'error', // success / error
          text1: 'Error !',
          text2: resp?.message || '',
        });
        setBtnLoader(false);
      }
    } catch (error) {
      nToast.show({
        type: 'error', // success / error
        text1: 'Error !',
        text2: error.toString() || '',
      });
      // Toast.show(error.toString());
      console.log('ERRRRR', error);
      setBtnLoader(false);
    }
  }

  return (
    <>
      <Header
        visible={false}
        title=""
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
        whiteHeader
      />
      <View style={styles.Firstview}>
        <View style={styles.TextView}>
          <Text style={styles.MainText1}>
            Please enter the 4 digit code{'\n'}
            send to you at {lastNum}
          </Text>
          <View style={styles.Secondview}>
            <OTPInputView
              ref={otpInputRef}
              style={{ width: IOS ? '80%' : '75%', height: 80 }}
              pinCount={4}
              onCodeChanged={(code) => {
                setOutput(code);
              }}
              code={output}
              selectionColor={BaseColors.secondary}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.OTPTxt}
              onCodeFilled={(code) => {
                if (code.length === 4) {
                  setOutput(code);
                  setTimeout(() => {
                    OTPVerify(code);
                  }, 500);
                }
              }}
            />
          </View>
        </View>
        <KeyboardAvoidingView
          enabled={true}
          style={{
            paddingHorizontal: 15,
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: keyboardShow
              ? Platform.OS === 'ios'
                ? 'flex-start'
                : 'flex-end'
              : 'flex-end',
            marginBottom: Platform.OS === 'ios' ? 30 : 20,
          }}>
          <TouchableOpacity
            onPress={() => ReSendOTP()}
            style={styles.btmTxtView}>
            {loader ? (
              <View>
                <ActivityIndicator
                  animating
                  color={BaseColors.borderColor}
                  size={'small'}
                />
              </View>
            ) : (
              <Text style={styles.TextTimer}>
                {`Resend code in 00:${
                  timerCount < 10 ? `0${timerCount}` : timerCount
                }`}
              </Text>
            )}
          </TouchableOpacity>
          <View style={styles.btnView}>
            <Button
              disabled={_.isEmpty(output) && output.length !== 4 ? true : false}
              loading={btnLoader}
              type={
                !_.isEmpty(output) && output.length === 4
                  ? 'primary'
                  : 'secondary'
              }
              onPress={
                (_.isEmpty(output) && output?.length !== 4) || btnLoader
                  ? null
                  : () => OTPVerify()
              }>
              Verify otp
            </Button>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
export default OtpScreen;
