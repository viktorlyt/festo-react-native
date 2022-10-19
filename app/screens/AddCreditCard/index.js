/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import { View, Keyboard } from 'react-native';
import styles from './styles';
import { Button, Header, TextInput } from '@components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BaseColors } from '@config/theme';
import stripe from 'tipsi-stripe';
import BaseSetting from '@config/setting';
import { isEmpty } from 'lodash';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';
import { ActivityIndicator } from 'react-native-paper';

/**
 * Module  AddCreditCard
 * @module  AddCreditCard
 *
 */

stripe.setOptions({
  publishableKey: BaseSetting.stripeKey,
  // merchantId: 'MERCHANT_ID', // Optional
  androidPayMode: 'test', // Android only
});

export default function AddCreditCard({ navigation, route }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [cardNumber, setCardNum] = useState('');
  const [cardNumErr, setcardNumErr] = useState(false);
  const [cardNumErrTxt, setCardNumErrTxt] = useState('');

  const [cardOwner, setCardOwner] = useState('');
  const [cardOwnerErr, setcardOwnerErr] = useState(false);
  const [cardOwnerErrTxt, setCardOwnerErrTxt] = useState('');

  const [year, setYear] = useState('');
  const [yearErr, setYearErr] = useState(false);
  const [yearErrTxt, setYearErrTxt] = useState('');

  const [month, setMonth] = useState('');
  const [monthErr, setMonthErr] = useState(false);
  const [monthErrTxt, setMonthErrTxt] = useState('');

  const [cvv, setCvv] = useState('');
  const [cvvErr, setcvvErr] = useState(false);
  const [cvvErrTxt, setcvvErrTxt] = useState('');

  const [loader, setloader] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);

  const cardNumRef = useRef();
  const cardOwnerRef = useRef();
  const monthRef = useRef();
  const yearRef = useRef();
  const cvvRef = useRef();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
      setTimeout(() => {
        setPageLoader(false);
      }, 200),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const allErrorFalse = () => {
    setloader(false);
    setcardOwnerErr(false);
    setcardNumErr(false);
    setYearErr(false);
    setMonthErr(false);
    setcvvErr(false);
  };

  const Validation = () => {
    const cardLength = cardNumber.trim().length;
    if (cardOwner.trim() === '') {
      allErrorFalse();
      setcardOwnerErr(true);
      setCardOwnerErrTxt('Please enter name');
    } else if (cardNumber.trim() === '') {
      allErrorFalse();
      setcardNumErr(true);
      setCardNumErrTxt('Please enter card number');
    } else if (cardLength != 16) {
      allErrorFalse();
      setcardNumErr(true);
      setCardNumErrTxt('Please enter valid card number');
    } else if (month.trim() === '') {
      allErrorFalse();
      setMonthErr(true);
      setMonthErrTxt('Please enter expire month');
    } else if (month.trim().length != 2) {
      allErrorFalse();
      setMonthErr(true);
      setMonthErrTxt('Please enter valid expire month');
    } else if (year.trim() === '') {
      allErrorFalse();
      setYearErr(true);
      setYearErrTxt('Please enter expire year');
    } else if (year.trim().length != 4) {
      allErrorFalse();
      setYearErr(true);
      setYearErrTxt('Please enter valid expire year');
    } else if (cvv.trim() === '') {
      allErrorFalse();
      setcvvErr(true);
      setcvvErrTxt('Please enter CVV');
    } else if (cvv.trim().length != 3) {
      allErrorFalse();
      setcvvErr(true);
      setcvvErrTxt('Please enter valid CVV');
    } else {
      allErrorFalse();
      onVerifyHandler();
    }
  };

  const onVerifyHandler = () => {
    setloader(true);
    stripe
      .createTokenWithCard({
        name: cardOwner,
        number: cardNumber,
        expMonth: Number(month),
        expYear: Number(year),
        cvc: cvv,
      })
      .then((token) => {
        console.log('token =======>>>', token);
        if (!isEmpty(token.tokenId)) {
          addCard(token.tokenId);
        }
      })
      .catch((error) => {
        allErrorFalse();
        Toast.show(error?.message);
        console.log('errr', error);
      });
  };

  //This function for add card
  async function addCard(token) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.createCard}`,
        'POST',
        { token: token },
      );
      console.log('response =======>>>', response);
      if (response.status) {
        navigation.goBack();
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      allErrorFalse();
    } catch (error) {
      console.log('error =======>>>', error);
      Toast.show(error.toString());
      allErrorFalse();
    }
  }

  return (
    <>
      <Header
        title="Add Credit Card/Debit Card"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      {pageLoader ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: BaseColors.white,
          }}>
          <ActivityIndicator size="large" color={BaseColors.primary} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          bounces={false}
          contentContainerStyle={{
            backgroundColor: BaseColors.white,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={false}>
          <View style={styles.container}>
            <View style={{ paddingVertical: 5 }}>
              <TextInput
                title="Card Owner"
                ref={cardOwnerRef}
                value={cardOwner}
                mandatory={true}
                onSubmit={() => {
                  monthRef.current.focus();
                }}
                showError={cardOwnerErr}
                errorText={cardOwnerErrTxt}
                onChange={(newText) => setCardOwner(newText)}
                style={styles.input}
                placeholderTextColor={'#4b4848'}
                placeholderText={'Enter Card Owner'}
                underlineColorAndroid="transparent"
              />

              <TextInput
                title="Card Number"
                ref={cardNumRef}
                value={cardNumber}
                mandatory={true}
                onSubmit={() => {
                  cardOwner.current.focus();
                }}
                showError={cardNumErr}
                errorText={cardNumErrTxt}
                keyBoardType="number-pad"
                onChange={(newText) => {
                  const data = newText.trim().replaceAll(' ', '');
                  setCardNum(data);
                }}
                style={styles.input}
                placeholderTextColor={'#4b4848'}
                placeholderText={'Enter Your Card Number'}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.textInputView}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TextInput
                  ref={monthRef}
                  onSubmit={() => {
                    yearRef.current.focus();
                  }}
                  title="Expire month"
                  value={month}
                  keyBoardType="number-pad"
                  showError={monthErr}
                  errorText={monthErrTxt}
                  mandatory={true}
                  onChange={(newText) => setMonth(newText)}
                  style={styles.input}
                  placeholderTextColor={'#4b4848'}
                  placeholderText={'CVV'}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TextInput
                  ref={yearRef}
                  onSubmit={() => {
                    cvvRef.current.focus();
                  }}
                  title="Expire year"
                  value={year}
                  keyBoardType="number-pad"
                  showError={yearErr}
                  errorText={yearErrTxt}
                  mandatory={true}
                  onChange={(newText) => setYear(newText)}
                  style={styles.input}
                  placeholderTextColor={'#4b4848'}
                  placeholderText={'CVV'}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  ref={cvvRef}
                  onSubmit={() => {
                    Validation();
                  }}
                  title="CVV"
                  value={cvv}
                  showError={cvvErr}
                  errorText={cvvErrTxt}
                  keyBoardType="number-pad"
                  mandatory={true}
                  onChange={(newText) => setCvv(newText)}
                  style={styles.input}
                  placeholderTextColor={'#4b4848'}
                  placeholderText={'CVV'}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
          </View>
          {!isKeyboardVisible ? (
            <View style={styles.btnView}>
              <Button
                loading={loader}
                type="primary"
                onPress={() => {
                  Validation();
                }}>
                Save
              </Button>
            </View>
          ) : null}
        </KeyboardAwareScrollView>
      )}
    </>
  );
}
