/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
// import FIcon from 'react-native-vector-icons/FontAwesome5Brands';
import AIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import { Button, Header, MidModal, AlertModal } from '@components';
import { Images } from '@config';
import Image from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { BaseColors, FontFamily } from '@config/theme';
import BaseSetting from '@config/setting';
import { getApiData, getApiDataProgress } from '@utils/apiHelper';
import { isEmpty } from 'lodash';

/**
 * Module  PaymentMethod
 * @module  PaymentMethod
 *
 */

export default function PaymentMethod({ navigation, route }) {
  const partyData = route?.params?.partyData;
  const [pageLoader, setPageLoader] = useState(true);
  const [cardData, setCardData] = useState({});

  const [midModal, setMidModal] = useState(false);

  const [cAlert, setCAlert] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const [cPayAlert, setCPayAlert] = useState(false);
  const [payBtnLoader, setPayBtnLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPageLoader(true);
      getCardList(true);
    }, []),
  );

  // Delete card Function
  async function makePayment() {
    setPayBtnLoader(true);

    const data = {
      card_token: cardData?.id,
      party_id: partyData?.party_id,
    };

    try {
      const response = await getApiDataProgress(
        `${BaseSetting.endpoints.makePayment}`,
        'POST',
        data,
      );

      if (response.status) {
        setCPayAlert(false);
        Toast.show(response?.message);
        navigation.goBack();
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setPayBtnLoader(false);
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setPayBtnLoader(false);
    }
  }

  // Delete card Function
  async function deleteCard() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.deleteCard}?token=${cardData?.id}`,
        'GET',
      );
      if (response.status) {
        setCAlert(false);
        getCardList(true);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setBtnLoader(false);
    } catch (error) {
      console.log('error ===>>>', error);
      setBtnLoader(false);
    }
  }

  // this function for get card List
  async function getCardList() {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cardList}`,
        'GET',
      );

      console.log('response =======>>>', response);
      if (response.status === true) {
        setCardData(response?.data);
        setPageLoader(false);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setPageLoader(false);
    }
  }

  return (
    <>
      <Header
        title="Payment Method"
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
        <>
          <View style={styles.container}>
            {!isEmpty(cardData) ? (
              <>
                <View style={styles.cardView}>
                  <Image
                    source={require('@assets/Images/creditImg.png')}
                    style={styles.cardImg}
                  />
                  <View style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
                    <View style={styles.cardDetailsView}>
                      <View>
                        <Text style={styles.nameTxt}>
                          {cardData?.name || '-'}
                        </Text>
                        <Text style={[styles.nameTxt, { fontSize: 12 }]}>
                          Credit Card
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          setCAlert(true);
                        }}
                        activeOpacity={0.6}>
                        <MIcon
                          style={styles.menuIcon}
                          name="delete"
                          size={20}
                          color={BaseColors.white}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.numTxt}>
                      **** **** **** {cardData?.last4}
                    </Text>
                    <View
                      style={[styles.cardDetailsView, { marginVertical: 10 }]}>
                      <View>
                        <Text style={[styles.nameTxt, { fontSize: 12 }]}>
                          Expiry Date
                        </Text>
                        <Text style={[styles.nameTxt, { fontSize: 14 }]}>
                          {`${cardData?.exp_month}/${cardData?.exp_year}`}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.nameTxt, { fontSize: 12 }]}>
                          CVV
                        </Text>
                        <Text style={[styles.nameTxt, { fontSize: 14 }]}>
                          ***
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Button
                  style={styles.paypalBtn}
                  type="outlined"
                  onPress={() => {
                    setCPayAlert(true);
                    // navigation.navigate('AddBankAc');
                  }}>
                  <Text
                    style={{
                      color: BaseColors.black,
                      fontSize: 20,
                      fontFamily: FontFamily.semiBold,
                    }}>
                    Pay via Stripe
                  </Text>
                </Button>
              </>
            ) : (
              <Button
                // containerStyle={{ color: BaseColors.black }}
                style={styles.addBtn}
                type="outlined"
                onPress={() => {
                  navigation.navigate('AddCreditCard');
                }}>
                <EIcon style={styles.addIcon} name="plus" size={20} />
                <Text style={{ color: BaseColors.black }}>
                  Add Credit Card/Debit Card
                </Text>
              </Button>
            )}
            {/* <View style={styles.btnsView}>
              <Button
                style={styles.payBtn}
                type="outlined"
                onPress={() => {
                  // navigation.navigate('Party');
                  Toast.show('Coming soon...');
                }}>
                <AIcon
                  style={[styles.addIcon, { color: BaseColors.black }]}
                  name="apple1"
                  size={25}
                />
                <Text style={{ color: BaseColors.black, fontSize: 20 }}>
                  Pay
                </Text>
              </Button>
            </View> */}
          </View>
          {midModal ? (
            <MidModal
              // coin={'$200'}
              title={'Successfully Joined the Party'}
              btnTxt={'View Party'}
              image={Images.sucessImg}
              btnYPress={() => {
                navigation.navigate('Party');
                setMidModal(false);
              }}
              btnNPress={() => {
                setMidModal(false);
              }}
            />
          ) : null}
          <AlertModal
            loader={btnLoader}
            title=" "
            visible={cAlert}
            setVisible={setCAlert}
            description={'Are you sure you want to delete card?'}
            btnYTitle="Delete"
            btnNTitle="Cancel"
            btnYPress={() => {
              deleteCard();
            }}
          />
          <AlertModal
            loader={payBtnLoader}
            title=" "
            visible={cPayAlert}
            setVisible={setCPayAlert}
            description={'Are you sure you want to pay from card?'}
            btnYTitle="Confirm"
            btnNTitle="Cancel"
            btnYPress={() => {
              makePayment();
            }}
          />
        </>
      )}
    </>
  );
}
