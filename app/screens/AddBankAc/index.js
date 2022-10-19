/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';
import { Images } from '@config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Header, TextInput, MidModal, ListModal } from '@components';
import { BaseColors } from '@config/theme';
import { getApiData, getApiDataProgress } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import Toast from 'react-native-simple-toast';
import AuthAction from '@redux/reducers/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import _, {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isObject,
  toNumber,
} from 'lodash';
import FormModal from '@components/FormModal';

/**
 * Module  AddBankAc
 * @module  AddBankAc
 *
 */

export default function AddBankAc({ navigation, route }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const bankData = route?.params?.data?.bank_details;
  const editBAnk = isObject(bankData) && !isEmpty(bankData);
  const createPArtydata = route?.params?.data;
  const fromParty = route?.params?.fromParty || false;
  const navigationBack = route?.params?.navigation || false;
  const { setIsBankAccountAdded } = AuthAction;
  const [acName, setAcName] = useState('');
  const [acNameErr, setAcNameErr] = useState(false);
  const [acNameErrTxt, setAcNameTxt] = useState('');

  const [bankName, setBankName] = useState('');
  const [bankNameErr, setbankNameErr] = useState(false);
  const [bankNameErrTxt, setbankNameErrTxt] = useState('');

  const [acNumber, setAcNumber] = useState('');
  const [acNumErr, setAcNumErr] = useState(false);
  const [acNumErrTxt, setAcNumTxt] = useState('');

  const [selectedAccount, setSelectedAccount] = useState('');
  const [acTypeErr, setAcTypeErr] = useState(false);
  const [acTypeErrTxt, setAcTypeErrTxt] = useState('');

  const [midModal, setMidModal] = useState(false);
  const [bankacAdded, setbankacAdded] = useState('');
  const [bankadded, setBankADD] = useState(0);
  const [btnLoader, setbtnLoader] = useState(false);
  const [createbtnLoader, setCreateBtnLoader] = useState(false);
  const [partydata, setData] = useState({});
  const [pageLoader, setPageLoader] = useState(false);
  const [invitedFrndList, setInvitedFrndList] = useState([]);
  const [moreLoad, setMoreLoad] = useState(false);
  const [buttonloader, setButtonLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);

  const bankNameRef = useRef();
  const acNameRef = useRef();
  const acNumRef = useRef();
  const acTypeRef = useRef();
  const refInviteFriend = useRef();

  useEffect(() => {
    if (editBAnk) {
      setAcName(bankData?.account_name || '');
      setBankName(bankData?.bank_name || '');
      setAcNumber(bankData?.account_number || '');
      setSelectedAccount(bankData?.account_type || '');
    }
  }, []);

  const validations = () => {
    if (_.isEmpty(bankName.trim())) {
      clearData();
      setbankNameErr(true);
      setbankNameErrTxt('Please enter bank name');
    } else if (_.isEmpty(acName.trim())) {
      clearData();
      setAcNameErr(true);
      setAcNameTxt('Please enter account name');
    } else if (_.isEmpty(acNumber.trim())) {
      clearData();
      setAcNumErr(true);
      setAcNumTxt('Please enter account number');
    } else if (_.isEmpty(selectedAccount.trim())) {
      clearData();
      setAcTypeErr(true);
      setAcTypeErrTxt('Please enter account type');
    } else {
      clearData();
      if (bankadded === 1 && fromParty) {
        Toast.show('Bank details already added!');
        navigation.goBack();
      } else {
        addBankAccountApi();
      }
    }
  };

  const clearData = () => {
    setbankNameErr(false);
    setAcNameErr(false);
    setAcNumErr(false);
    setAcTypeErr(false);
  };

  const addBankAccountApi = async () => {
    setbtnLoader(true);
    const params = {
      'HostBankAccount[bank_name]': bankName,
      'HostBankAccount[account_name]': acName,
      'HostBankAccount[account_number]': acNumber,
      'HostBankAccount[account_type]': selectedAccount,
    };
    if (editBAnk) {
      params['HostBankAccount[user_id]'] = userData?.id;
    }

    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.addBankAccoutn}`,
        'POST',
        params,
      );
      if (response.status) {
        if (editBAnk) {
          navigation.goBack();
        } else {
          setBankADD(response?.data.is_bank_account_added);
          dispatch(setIsBankAccountAdded(response?.data.is_bank_account_added));
          setbankacAdded(fromParty ? true : false);
        }
      } else {
        dispatch(setIsBankAccountAdded(0));
        Toast.show(response?.message);
      }
      setbtnLoader(false);
    } catch (error) {
      setMidModal(false);
      setbtnLoader(false);
      Toast.show(error.toString());
    }
  };

  // create party api
  const createPartyApi = async () => {
    setCreateBtnLoader(true);
    const params = {
      'Party[title]': createPArtydata.title,
      'Party[location_lat]': createPArtydata.location_lat,
      'Party[location_lng]': createPArtydata.location_lng,
      'Party[min_age]': createPArtydata.min_age,
      'Party[max_age]': createPArtydata.max_age,
      'Party[party_type]': createPArtydata.party_type,
      'Party[at_date]': createPArtydata.at_date,
      'Party[from_time]': createPArtydata.from_time,
      'Party[to_time]': createPArtydata.to_time,
      'Party[note]': createPArtydata.note,
      'Party[to_date]': createPArtydata.to_date,
      'Party[is_map]': createPArtydata.is_map,
    };

    if (createPArtydata.is_map === 0) {
      params['Party[location]'] = createPArtydata.location;
    }

    if (
      !_.isEmpty(createPArtydata.interest) &&
      _.isArray(createPArtydata.interest)
    ) {
      createPArtydata.interest?.map((dd, ii) => {
        if (dd?.value) {
          params[`Party[interest][${ii}]`] = dd.value;
        } else {
          params[`Party[interest_name][${ii}]`] = dd.label;
        }
      });
    }
    if (createPArtydata.party_type === 1) {
      params['Party[is_free]'] = createPArtydata.is_free;
    }
    if (createPArtydata.is_free === 0) {
      params['Party[price]'] = createPArtydata.price;
    }
    try {
      const response = await getApiDataProgress(
        `${BaseSetting.endpoints.createParty}`,
        'POST',
        params,
      );
      if (response.status) {
        uploadPartyImages(response?.data?.party_id);
      } else {
        setCreateBtnLoader(false);
        Toast.show(response?.message);
      }
    } catch (error) {
      setCreateBtnLoader(false);
      setMidModal(false);
      Toast.show(error.toString());
    }
  };

  // upload party images after create party
  const uploadPartyImages = async (partyId) => {
    const params = {
      'PartyImages[party_id]': partyId,
    };
    if (
      !_.isEmpty(createPArtydata.partyImages) &&
      _.isArray(createPArtydata.partyImages)
    ) {
      createPArtydata.partyImages.slice(0, 4)?.map((dd, ii) => {
        const imgFile = {
          uri: dd?.path,
          name: dd?.path.substr(dd?.path.lastIndexOf('/') + 1),
          type: dd.mime,
        };
        params[`PartyImages[image_url][${ii}]`] = imgFile;
      });
    }
    try {
      const response = await getApiDataProgress(
        `${BaseSetting.endpoints.uploadPartyImages}`,
        'POST',
        params,
      );
      if (response.status) {
        setData(response.data);
        setMidModal(true);
      } else {
        Toast.show(response?.message);
      }
      setCreateBtnLoader(false);
    } catch (error) {
      setMidModal(false);
      setCreateBtnLoader(false);
      Toast.show(error.toString());
    }
  };

  // get invited friends list api call
  async function getinvitedFrndList(id, bool) {
    setPageLoader(true);
    setInvitedFrndList([]);
    const cPage =
      invitedFrndList &&
      invitedFrndList.pagination &&
      invitedFrndList.pagination.currentPage
        ? toNumber(invitedFrndList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.inviteFriends}?party_id=${id}`,
        'GET',
      );
      if (response.status) {
        // setInvitedFrndList(response.data.rows);
        const obj = bool ? {} : cloneDeep(invitedFrndList);

        const newListData =
          response && response.data && response.data.rows
            ? response.data.rows
            : [];
        const paginationDatas =
          response && response.data && response.data.pagination
            ? response.data.pagination
            : {};

        if (isArray(newListData)) {
          if (isArray(obj.data) && obj.data.length > 0) {
            obj.data = flattenDeep([...obj.data, newListData]);
          } else {
            obj.data = newListData;
          }
          obj.pagination = paginationDatas;
        }
        setInvitedFrndList(obj.data);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      stopLoader();
    } catch (error) {
      Toast.show(error.toString());
      stopLoader();
    }
  }

  // handle Invite api call
  const handleInvite = async (attendeeId) => {
    setButtonLoader(true);
    const params = `?party_id=${partydata.party_id}&attendee_id=${attendeeId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.sendPartyInvitation}${params}`,
        'GET',
        {},
      );
      if (response.status) {
        setButtonLoader(false);
        Toast.show(response?.message);
        getinvitedFrndList(partydata.party_id, true);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      setButtonLoader(false);
      Toast.show(error.toString());
    }
  };

  // handle cancel api call
  const handleCancel = async (userId, type) => {
    setButtonLoader(true);
    const params = `?party_id=${partydata.party_id}&user_id=${userId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelPartyRequest}${params}`,
        'GET',
        {},
      );
      if (response.status) {
        Toast.show(response?.message);
        setButtonLoader(false);
        if (type === 'invite-friends') {
          setPageLoader(true);
          setTimeout(() => {
            getinvitedFrndList(partydata.party_id);
          }, 2000);
        }
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      setButtonLoader(false);
      Toast.show(error.toString());
    }
  };

  function stopLoader() {
    setPageLoader(false);
  }

  // render modal list
  const renderModalList = (listData, listRef, btnTitle, type) => {
    return (
      <ListModal
        ListArray={listData}
        pageLoad={pageLoader}
        btnTitle={btnTitle}
        itemBtn={type}
        buttonloader={buttonloader}
        handleMainBtn={() => {
          listRef.current.close();
          navigation.goBack();
        }}
        handleCancel={(item) => {
          handleCancel(item.id, type);
        }}
        handleInvite={(item) => {
          handleInvite(item.id);
        }}
        renderFooterComponent={() => renderFooterComponent(listData)}
        refreshLoader={refreshLoader}
        onRefresh={() => {
          onRefresh(type);
        }}
        onEndReached={() => {
          getMoreData(listData);
        }}
      />
    );
  };

  function onRefresh(type) {
    setRefreshLoader(true);
    if (type === 'invite-friends') {
      setPageLoader(true);
      setTimeout(() => {
        getinvitedFrndList(partydata.party_id, true);
      }, 2000);
    }
  }

  async function getMoreData(listdata, type) {
    const cPage =
      listdata && listdata.pagination && listdata.pagination.currentPage
        ? toNumber(listdata.pagination.currentPage)
        : 0;
    const tPage =
      listdata && listdata.pagination && listdata.pagination.totalPage
        ? toNumber(listdata.pagination.totalPage)
        : 0;
    if (listdata?.pagination?.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      if (type === 'invite-friends') {
        getinvitedFrndList(partydata.party_id, true);
      }
    }
  }

  function renderFooterComponent(listdata) {
    if (moreLoad) {
      return (
        <View style={styles.loaderFooterView}>
          <ActivityIndicator
            size={'small'}
            animating
            color={BaseColors.primary}
          />
        </View>
      );
    } else if (isEmpty(listdata)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  return (
    <>
      <Header
        title="Add Bank Account"
        leftIcon={fromParty ? false : true}
        leftIconName="arrowleft"
        onBackPress={() => {
          if (navigationBack) {
            navigation.popToTop();
          } else {
            navigation.goBack();
          }
        }}
      />
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
              ref={bankNameRef}
              style={styles.TextInp1}
              showError={bankNameErr}
              value={bankName}
              errorText={bankNameErrTxt}
              title={'Bank Name'}
              placeholderText={'Enter Bank Name'}
              onChange={(value) => setBankName(value)}
              onSubmit={() => {
                acNameRef.current.focus();
              }}
            />

            <TextInput
              ref={acNameRef}
              showError={acNameErr}
              errorText={acNameErrTxt}
              value={acName}
              title="Account Name"
              placeholderText={'Enter Your Account Name'}
              onChange={(newText) => setAcName(newText)}
              onSubmit={() => {
                acNumRef.current.focus();
              }}
            />
            <TextInput
              ref={acNumRef}
              title="Account Number"
              showError={acNumErr}
              errorText={acNumErrTxt}
              value={acNumber}
              keyBoardType="number-pad"
              placeholderText={'Enter Your Account Number'}
              onChange={(newText) => setAcNumber(newText)}
              onSubmit={() => {
                acTypeRef.current.focus();
              }}
            />
            <TextInput
              ref={acTypeRef}
              title="Account Type"
              showError={acTypeErr}
              errorText={acTypeErrTxt}
              value={selectedAccount}
              placeholderText={'Enter Account Type'}
              onChange={(newText) => setSelectedAccount(newText)}
              onSubmit={() => {
                acTypeRef.current.blur();
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {midModal ? (
        <MidModal
          title={'Successfully Created the Party'}
          btnTxt={'View Party'}
          image={Images.sucessImg}
          displayInviteFriends
          btnInviteFriends={() => {
            setPageLoader(true);
            getinvitedFrndList(partydata.party_id);
            refInviteFriend.current.open();
          }}
          btnYPress={() => {
            navigation.navigate('Events', {
              data: {
                id: partydata.party_id,
                title: partydata.title,
              },
              fromDiscover: true,
              navigation: true,
            });
            setMidModal(false);
          }}
          btnNPress={() => {
            setMidModal(false);
            navigation.popToTop();
          }}
        />
      ) : null}
      {bankacAdded ? (
        <MidModal
          // coin={'$200'}
          title={'Successfully Bank Account Added'}
          btnTxt={'Create Party Now'}
          image={Images.bankAc}
          btnLoader={createbtnLoader}
          btnYPress={() => {
            if (fromParty) {
              createPartyApi();
            }
            setbankacAdded(false);
          }}
          btnNPress={() => {
            setbankacAdded(false);
          }}
        />
      ) : null}
      <View style={styles.btnView}>
        <Button
          type="primary"
          loading={btnLoader}
          onPress={
            btnLoader
              ? null
              : () => {
                  validations();
                  // addBankAccountApi();
                  // setMidModal(true);
                }
          }>
          Add Account
        </Button>
      </View>

      <FormModal rbSheetRef={refInviteFriend} title={'Invite Friends'}>
        {renderModalList(
          invitedFrndList,
          refInviteFriend,
          'Done',
          'invite-friends',
        )}
      </FormModal>
    </>
  );
}
