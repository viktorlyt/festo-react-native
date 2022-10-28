import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';
import Toast from 'react-native-simple-toast';
import '@react-native-firebase/auth';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { translate } from 'app/lang/Translate';
import { Button, Text, TextInput, Header } from '@components';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import styles from './styles';

/**
 * Login screen
 * @module  Login
 *
 */
export default function Login({ navigation }) {
  const [btnLoader, setBtnLoader] = useState(false);

  const [countryName, setCountryName] = useState('GB');
  const [countryCode, setCountryCode] = useState('44');
  const [phoneNumber, setPhoneNum] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberErrorTxt, setPhoneNumberErrorTxt] = useState('');

  const loginAction = async () => {
    if (phoneNumber === '') {
      setPhoneNumberError(true);
      setPhoneNumberErrorTxt('You must enter a valid mobile number');
    } else if (!phoneNumberError) {
      setPhoneNumberError(false);
      setPhoneNumberErrorTxt('');
      userLogin();
    }
  };

  //API Call for userLogin
  async function userLogin() {
    try {
      setBtnLoader(true);
      const LoginData = {
        'SignupForm[country_code]': `+${countryCode}`,
        'SignupForm[phone]': phoneNumber,
      };
      const resp = await getApiData(
        BaseSetting.endpoints.login,
        'POST',
        LoginData,
      );
      if (resp?.status) {
        setTimeout(() => {
          navigation.navigate('Otp', {
            countryCode: countryCode,
            phone: phoneNumber,
          });
          setBtnLoader(false);
          // phoneNumber();
          Keyboard.dismiss();
        }, 500);
      } else {
        console.log('User not found');
        Toast.show(resp?.message);
        setBtnLoader(false);
      }
    } catch (error) {
      Toast.show(error.toString());
      console.log('ERRRRR', error);
      setBtnLoader(false);
    }
  }
  return (
    <>
      <Header
        title=""
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
        whiteHeader
      />
      <View
        // onPress={() => {
        //   Keyboard.dismiss();
        // }}
        style={styles.container}>
        <Text bold style={styles.Textt}>
          Enter Your Mobile Number
        </Text>
        <View style={styles.contentContainerStyle}>
          <TextInput
            phoneNumber={true}
            value={phoneNumber}
            title={translate('phonenumber')}
            placeholderText={''}
            showError={phoneNumberError}
            errorText={phoneNumberErrorTxt}
            maxLength={12}
            onSubmit={() => {
              loginAction();
            }}
            onChange={(txt) => {
              setPhoneNum(txt.trim().replaceAll(' ', ''));
              if (isValidPhoneNumber(txt, countryName)) {
                setPhoneNumberError(false);
              } else {
                setPhoneNumberError(true);
                setPhoneNumberErrorTxt(translate('ValidEnterMobileNum'));
              }
            }}
            onCountryChange={(code, name) => {
              setCountryCode(code);
              setCountryName(name);
              if (isValidPhoneNumber(phoneNumber, name)) {
                setPhoneNumberError(false);
              } else {
                setPhoneNumberError(true);
                setPhoneNumberErrorTxt(translate('ValidEnterMobileNum'));
              }
            }}
            countryCode={countryName}
            keyBoardType="number-pad"
            returnKeyType="done"
            callingCode={'44'}
          />
        </View>
        <View style={styles.btmTxtView}>
          <Text style={styles.messageText}>
            By continuing you may receive an SMS for verification. Message and
            data rate may apply.
          </Text>
        </View>
        <View style={styles.btnView}>
          <Button
            loading={btnLoader}
            type="primary"
            onPress={() => {
              loginAction();
            }}>
            Next
          </Button>
        </View>
      </View>
    </>
  );
}
