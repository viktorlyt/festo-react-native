/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  Text,
  Button,
  CDropDown,
  TextInput,
  CUploadImages,
  Header,
  ListModal,
  MidModal,
} from '@components';
import { getApiData, getApiDataProgress } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { BaseColors, FontFamily } from '@config/theme';
import styles from './styles';
import _, {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isNull,
  toNumber,
} from 'lodash';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { Images } from '@config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import RangeSlider from 'rn-range-slider';
import FormModal from '@components/FormModal';
import DatePicker from 'react-native-datepicker';
import Thumb from '@components/Sliders/Thumb';
import Label from '@components/Sliders/Label';
import Rail from '@components/Sliders/Rail';
import Notch from '@components/Sliders/Notch';
import RailSelected from '@components/Sliders/RailSelected';
import ImagePicker from '../../libs/react-native-image-crop-picker';
import SelectPhotoModal from '@components/SelectPhotoModal';
import RadioButton from '@components/RadioButton';
import { useFocusEffect } from '@react-navigation/native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  actions,
  getContentCSS,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';

function CreateParty({ navigation, route }) {
  const editData = route?.params?.data || {};
  const isEdit = route?.params?.isEdit || false;
  const IOS = Platform.OS === 'ios';
  const { isBankAccountAdded } = useSelector((state) => state.auth);
  const [mainLoader, setMainLoader] = useState(true);

  const [partyTitle, setPartyTitle] = useState('');
  const [partyTitleErr, setPartyTitleErr] = useState(true);
  const [partyTitleErrTxt, setPartyTitleErrTxt] = useState('');

  const [selectedParty, setSelectedParty] = useState([]);
  const [selectedPartyErr, setSelectedPartyErr] = useState(true);
  const [selectedPartyErrTxt, setSelectedPartyErrTxt] = useState('');

  const [interestList, setInterestList] = useState([]);

  const [locationData, setLocationdata] = useState({});
  const [locAdd, setLocAdd] = useState('');
  const [locData, setLocData] = useState({});
  const [locationDataErr, setLocationdataErr] = useState(false);
  const [locationDataErrTxt, setLocationdataErrTxt] = useState('');

  const [note, setNote] = useState('');
  const [noteErr, setNoteErr] = useState(false);
  const [noteErrTxt, setNoteErrTxt] = useState('');

  const [partyDate, setPartyDate] = useState('');
  const [partyDateErr, setPartyDateErr] = useState(false);
  const [partyDateErrTxt, setPartyDateErrTxt] = useState('');

  const [toDate, setToDate] = useState('');
  const [toDateErr, setToDateErr] = useState(false);
  const [toDateErrTxt, setToDateErrTxt] = useState('');

  const [umImages, setUmImages] = useState([]);
  const [imageErr, setImageErr] = useState(true);
  const [imageErrTxt, setImageErrTxt] = useState([]);

  const [startDatePicker, setStartDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(
    IOS ? moment().format('hh:mm A') : new Date(),
  );
  const [startTimeErr, setStartTimeErr] = useState(false);
  const [startTimeErrTxt, setStartTimeErrTxt] = useState('');

  const [endDatePicker, setEndDatePicker] = useState(false);
  const [endTime, setEndTime] = useState(
    IOS ? moment().format('hh:mm A') : new Date(),
  );
  const [endTimeErr, setEndTimeErr] = useState(false);
  const [endTimeErrTxt, setEndTimeErrTxt] = useState('');

  const [minMaxValues, setMinMaxValues] = useState({
    min: 0,
    max: 100,
  });

  const [selectedRB, setSelectedRB] = useState(false);
  const [selectedRB2, setSelectedRB2] = useState(true);

  const [charges, setCharges] = useState('');
  const [chargeErr, setChargeErr] = useState(false);
  const [chargeErrTxt, setChargeErrTxt] = useState('');

  const [loaderRemove, setLoaderRemove] = useState(false);
  const [createbtnLoader, setCreateBtnLoader] = useState(false);
  const [dateDisable, setDateDisable] = useState(true);

  const [midModal, setMidModal] = useState(false);
  const [partydata, setData] = useState({});
  const [selectedPartyId, setSelectedPartyId] = useState(0);
  const [fillPartyData, setFillPartyData] = useState({});
  const [addBankAc, setaddBankAc] = useState(false);
  const [invitedFrndList, setInvitedFrndList] = useState([]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [buttonloader, setButtonLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);

  const dobRef = useRef();
  const toDateRef = useRef();
  const googlePlaceRef = useRef();
  const CUploadingImages = useRef(null);
  const richTextReference = useRef();

  const refPhotoRBSheet = useRef();
  const mapView = useRef(null);
  const refInviteFriend = useRef();

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low, high) => {
    setMinMaxValues({
      min: low,
      max: high,
    });
  }, []);

  const optionsArray = [
    {
      id: 1,
      optionTitle: 'Select from Gallery',
      handleClick: () => {
        openGallery();
      },
      optionIcon: 'photo',
    },
    {
      id: 1,
      optionTitle: 'Open Camera',
      handleClick: () => {
        openCamera();
      },
      optionIcon: 'camera',
    },
  ];

  useEffect(() => {
    getInterestList();
  }, []);

  useEffect(() => {
    if (isArray(interestList) && !isEmpty(interestList) && isEdit) {
      const result = interestList.filter((v) =>
        editData?.interests.some((e) => e === v?.label),
      );
      setSelectedParty(result || []);
    }
  }, [interestList]);

  useEffect(() => {
    setDateDisable(isEmpty(partyDate));
  }, [partyDate]);

  useFocusEffect(
    useCallback(() => {
      if (isEdit) {
        setPartyTitle(editData?.title || '');
        setTimeout(() => {
          setLocAdd(editData?.location || '');
        }, 10);
        setLocData({
          latitude: editData?.location_lat,
          longitude: editData?.location_lng,
        });
        setLocationdata({
          latitude: editData?.location_lat,
          longitude: editData?.location_lng,
        });
        setNote(editData?.note || '');
        const at_date = editData?.at_date
          ? moment(editData?.at_date, 'DD MMM YYYY').format('yyyy-MM-DD')
          : '';
        setPartyDate(at_date);
        const to_date = editData?.to_date
          ? moment(editData?.to_date, 'DD MMM YYYY').format('yyyy-MM-DD')
          : '';
        setToDate(to_date);
        const from_time = editData?.from_time
          ? IOS
            ? editData?.from_time
            : new Date(moment(editData?.from_time, 'hh:mm A DD-MM-yyyy'))
          : '';
        setStartTime(from_time);
        const to_time = editData?.to_time
          ? IOS
            ? editData?.to_time
            : new Date(moment(editData?.to_time, 'hh:mm A DD-MM-yyyy'))
          : '';
        setEndTime(to_time);
        setMinMaxValues({
          min: editData?.min_age || 0,
          max: editData?.max_age || 100,
        });
        setSelectedRB(Number(editData?.party_type) === 1 ? true : false);
        setSelectedRB2(Number(editData?.is_free) === 1 ? true : false);
        if (Number(editData?.is_free) === 0) {
          setCharges(editData?.price.toString() || '');
        }
        if (
          isArray(editData?.party_images) &&
          !isEmpty(editData?.party_images)
        ) {
          const dummyArr = [];
          editData?.party_images.map((item, index) => {
            const dummyObj = {};
            dummyObj.path = item?.image_url;
            dummyObj.id = item?.id;
            dummyObj.party_id = item?.party_id;

            dummyArr.push(dummyObj);
          });
          setUmImages(dummyArr || []);
        }
      }
      setMainLoader(false);
      return () => {
        clearData();
        clearvalidationErrs();
      };
    }, []),
  );

  function stopLoader() {
    setRefreshLoader(false);
    setPageLoad(false);
  }

  // create party api
  const createPartyApi = async () => {
    setCreateBtnLoader(true);
    const params = {
      'Party[title]': partyTitle.trim(),
      'Party[location_lat]': !_.isEmpty(locData)
        ? locData?.latitude
        : locationData?.geometry?.location?.lat,
      'Party[location_lng]': !_.isEmpty(locData)
        ? locData?.longitude
        : locationData?.geometry?.location?.lng,
      'Party[min_age]': minMaxValues?.min,
      'Party[max_age]': minMaxValues?.max,
      'Party[party_type]': selectedRB ? 1 : 0,
      'Party[at_date]': partyDate,
      'Party[from_time]': IOS ? startTime : moment(startTime).format('hh:mm A'),
      'Party[to_time]': IOS ? endTime : moment(endTime).format('hh:mm A'),
      'Party[note]': note.trim(),
      'Party[to_date]': toDate,
      'Party[is_free]': selectedRB2 ? 1 : 0,
      'Party[is_map]': !_.isEmpty(locData) ? 1 : 0,
    };

    if (_.isEmpty(locData)) {
      params['Party[location]'] = locAdd;
    }

    if (!_.isEmpty(selectedParty) && _.isArray(selectedParty)) {
      selectedParty?.map((dd, ii) => {
        if (dd?.value) {
          params[`Party[interest][${ii}]`] = dd.value;
        } else {
          params[`Party[interest_name][${ii}]`] = dd.label;
        }
      });
    }
    if (!selectedRB2) {
      params['Party[price]'] = charges;
    }

    if (isEdit) {
      params['Party[id]'] = editData?.id;
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
        Toast.show(response?.message);
        setCreateBtnLoader(false);
      }
    } catch (error) {
      setMidModal(false);
      setCreateBtnLoader(false);
      Toast.show(error.toString());
    }
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      refPhotoRBSheet.current.close();
      if (typeof image !== 'undefined') {
        image.isLocal = true;
        let mP = umImages;
        mP = mP.concat([image]);
        setUmImages(mP);
        if (IOS) {
          setTimeout(() => {
            setLocAdd(locAdd);
          }, 200);
        }
      }
    });
  };

  // function for openGallery
  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      // width: 300,
      // height: 400,
      // cropping: true,
      multiple: true,
    }).then((image) => {
      refPhotoRBSheet.current.close();
      let mP = umImages;
      mP = mP.concat(image);
      setUmImages(mP);
      if (IOS) {
        setTimeout(() => {
          setLocAdd(locAdd);
        }, 200);
      }
    });
  };

  // this function for get interests list
  async function getInterestList(bool = false) {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.interestList,
        'GET',
        {},
      );

      if (response.status && _.isArray(response?.data)) {
        const interestList1 = response?.data;
        if (bool) {
          const arr = [...selectedParty];
          arr.push(interestList1[0]);
          setSelectedParty(arr);
        }
        setInterestList(interestList1);
      }
    } catch (error) {
      Toast.show(error.toString());
    }
  }

  // get invited friends list api call
  async function getinvitedFrndList(id, bool) {
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
      }
      stopLoader();
    } catch (error) {
      Toast.show(error.toString());
      stopLoader();
    }
  }

  // this function for block user
  async function removePartyImg(index, item) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.removePartyImg}?id=${item?.id}&party_id=${item?.party_id}`,
        'GET',
      );

      if (response.status === true) {
        Toast.show(response?.message);
        removeImage(index);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
    }
  }

  // handle Invite api call
  const handleInvite = async (attendeeId) => {
    setButtonLoader(true);
    const params = `?party_id=${selectedPartyId}&attendee_id=${attendeeId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.sendPartyInvitation}${params}`,
        'GET',
        {},
      );
      if (response.status) {
        setButtonLoader(false);
        Toast.show(response?.message);
        getinvitedFrndList(selectedPartyId, true);
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
    const params = `?party_id=${selectedPartyId}&user_id=${userId}`;
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
          getinvitedFrndList(selectedPartyId);
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

  // upload party images after create party
  const uploadPartyImages = async (partyId) => {
    const params = {
      'PartyImages[party_id]': partyId,
    };
    if (!_.isEmpty(umImages) && _.isArray(umImages)) {
      umImages.slice(0, 5)?.map((dd, ii) => {
        if (!dd?.id) {
          const imgFile = {
            uri: dd?.path,
            name: dd?.path.substr(dd?.path.lastIndexOf('/') + 1),
            type: dd.mime,
          };
          params[`PartyImages[image_url][${ii}]`] = imgFile;
        }
      });
    }
    try {
      const response = await getApiDataProgress(
        `${BaseSetting.endpoints.uploadPartyImages}`,
        'POST',
        params,
      );
      if (response.status) {
        if (isEdit) {
          setTimeout(() => {
            navigation.goBack();
          }, 200);
        } else {
          setMidModal(true);
          setData(response.data);
          setSelectedPartyId(response.data.party_id);
        }
      } else {
        Toast.show(response?.message);
      }
      setCreateBtnLoader(false);
      clearData();
    } catch (error) {
      setMidModal(false);
      setCreateBtnLoader(false);
      Toast.show(error.toString());
    }
  };

  const validateFields = () => {
    //validate start & end time difference

    // const validatestartendtime = () => {
    //   var duration = moment.duration(moment(endTime).diff(moment(startTime)));
    //   var hours = duration.asHours();
    //   if (hours >= 2) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };

    let valid = true;
    //validate party title
    if (isEmpty(partyTitle.trim())) {
      valid = false;
      setPartyTitleErr(true);
      setPartyTitleErrTxt('Party Title is required');
    } else {
      setPartyTitleErr(false);
      setPartyTitleErrTxt('');
    }
    //validate party type
    if (!_.isArray(selectedParty) || isEmpty(selectedParty)) {
      valid = false;
      setSelectedPartyErr(true);
      setSelectedPartyErrTxt('Party type is required');
    } else {
      setSelectedPartyErr(false);
      setSelectedPartyErrTxt('');
    }
    //validate location
    if (!_.isObject(locationData) || isEmpty(locationData)) {
      valid = false;
      setLocationdataErr(true);
      setLocationdataErrTxt('Location is required');
    } else {
      setLocationdataErr(false);
      setLocationdataErrTxt('');
    }
    const checkMail = note.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    );
    const checkNumber = note.match(/\d+/g);
    let hasNumber = false;

    // validate party Note
    if (
      !isNull(checkNumber) &&
      isArray(checkNumber) &&
      checkNumber.length > 0
    ) {
      checkNumber.map((key) => {
        if (key.length >= 10) {
          hasNumber = true;
        }
      });
    }

    if (isEmpty(note.trim())) {
      valid = false;
      setNoteErr(true);
      setNoteErrTxt('Note is required');
    } else if (!isNull(checkMail)) {
      valid = false;
      setNoteErr(true);
      setNoteErrTxt("You can't enter the email address in note");
    } else if (hasNumber) {
      valid = false;
      setNoteErr(true);
      setNoteErrTxt("You can't enter the phone number in note");
    } else {
      setNoteErr(false);
      setNoteErrTxt('');
    }
    //validate party Date
    if (isEmpty(partyDate)) {
      valid = false;
      setPartyDateErr(true);
      setPartyDateErrTxt('Date is required');
    } else {
      setPartyDateErr(false);
      setPartyDateErrTxt('');
    }

    //validate party End Date
    if (isEmpty(toDate)) {
      valid = false;
      setToDateErr(true);
      setToDateErrTxt('End date is required');
    } else {
      setToDateErr(false);
      setToDateErrTxt('');
    }

    //validate charges
    if (!selectedRB2 && isEmpty(charges)) {
      valid = false;
      setChargeErr(true);
      setChargeErrTxt('Charges are required');
    } else if (
      !selectedRB2 &&
      (charges < 0 || charges > 10000 || isNaN(charges))
    ) {
      valid = false;
      setChargeErr(true);
      if (charges > 1000) {
        setChargeErrTxt('Maximum party charge is 10000.');
      } else {
        setChargeErrTxt('Please enter valid charges');
      }
    } else {
      setChargeErr(false);
      setChargeErrTxt('');
    }
    //validate Images
    if (umImages.length === 0) {
      valid = false;
      setImageErr(true);
      setImageErrTxt('Minimum 1 Image is required');
    } else {
      setImageErr(false);
      setImageErrTxt('');
    }
    if (valid) {
      if (isEdit) {
        createPartyApi();
      } else if (!selectedRB2 && isBankAccountAdded === 0) {
        const params = {
          title: partyTitle.trim(),
          location: locAdd,
          location_lat: !_.isEmpty(locData)
            ? locData?.latitude
            : locationData?.geometry?.location?.lat,
          location_lng: !_.isEmpty(locData)
            ? locData?.longitude
            : locationData?.geometry?.location?.lng,
          min_age: minMaxValues?.min,
          max_age: minMaxValues?.max,
          party_type: selectedRB ? 1 : 0,
          at_date: partyDate,
          from_time: moment(startTime).format('hh:mm A'),
          to_time: moment(endTime).format('hh:mm A'),
          note: note,
          interest: selectedParty,
          is_free: selectedRB2 ? 1 : 0,
          price: charges,
          partyImages: umImages,
          to_date: toDate,
          is_map: !_.isEmpty(locData) ? 1 : 0,
        };
        setTimeout(() => {
          setFillPartyData(params);
          setaddBankAc(true);
        }, 200);
      } else {
        createPartyApi();
      }
      clearvalidationErrs();
    }
  };

  const clearData = () => {
    setDateDisable(true);
    setPartyTitle('');
    setSelectedParty([]);
    // setLocationdata({});
    setNote('');
    setPartyDate('');
    setToDate('');
    setStartTime(IOS ? moment().format('hh:mm A') : new Date());
    setEndTime(IOS ? moment().format('hh:mm A') : new Date());
    setMinMaxValues({
      min: 0,
      max: 100,
    });
    setCharges('');
    setUmImages([]);
    // setLocData({});
    // setStartTime({});
    // setEndTime({});
  };

  const clearvalidationErrs = () => {
    setPartyTitleErr(false);
    setPartyTitleErrTxt('');
    setSelectedPartyErr(false);
    setSelectedPartyErrTxt('');
    setLocationdataErr(false);
    setLocationdataErrTxt('');
    setNoteErr(false);
    setNoteErrTxt('');
    setPartyDateErr(false);
    setPartyDateErrTxt('');
    setStartTimeErr(false);
    setStartTimeErr('');
    setEndTimeErr(false);
    setEndTimeErrTxt('');
    setChargeErr(false);
    setChargeErrTxt('');
    setImageErr(false);
    setImageErrTxt('');
    setToDateErr(false);
    setToDateErrTxt('');
  };

  function addInArr(v) {
    const dummyArr = [...selectedParty];
    const findIndex = dummyArr.findIndex(
      (item) => item?.label.toLowerCase() === v.toLowerCase(),
    );
    if (findIndex >= 0) {
      return null;
    } else {
      const dummyObj = {
        label: v,
      };
      dummyArr.unshift(dummyObj);
    }
    setSelectedParty(dummyArr);
  }

  const removeImage = (index) => {
    let img = umImages;
    img.splice(index, 1);
    setUmImages(img);
    setTimeout(() => {
      setLoaderRemove(false);
    }, 200);
  };

  // render modal list
  const renderModalList = (listData, listRef, btnTitle, type) => {
    return (
      <ListModal
        ListArray={listData}
        pageLoad={pageLoad}
        btnTitle={btnTitle}
        itemBtn={type}
        buttonloader={buttonloader}
        // handleMainBtn={() => {
        //   listRef.current.close();
        // }}
        handleMainBtn={(it) => {
          if (it?.is_free === 0) {
            setPaymentModal(true);
          } else {
            if (!_.isEmpty(partydata) && _.isObject(partydata)) {
              setSelectedPartyId(partydata?.party_id);
              setPageLoad(true);
              setInvitedFrndList([]);
              getinvitedFrndList(partydata?.party_id);
              refInviteFriend?.current?.open();
            } else {
              setSelectedPartyId(it?.id);
              setPageLoad(true);
              setInvitedFrndList([]);
              getinvitedFrndList(it?.id);
              refInviteFriend?.current?.open();
            }
          }
          listRef?.current?.close();
          navigation.popToTop();
        }}
        handleCancel={(item) => {
          handleCancel(item?.id, type);
        }}
        handleInvite={(item) => {
          handleInvite(item?.id);
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

  function onRefresh() {
    setRefreshLoader(true);
    setTimeout(() => {
      // getPartyList();
    }, 2000);
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
        getinvitedFrndList(selectedPartyId, true);
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

  // success modal after creating party
  const renderMidModal = () => {
    return midModal ? (
      <MidModal
        title={'Successfully Created the Party'}
        btnTxt={'View Party'}
        image={Images.PartyImg}
        displayInviteFriends
        btnInviteFriends={() => {
          setMidModal(false);
          setPageLoad(true);
          setInvitedFrndList([]);
          getinvitedFrndList(partydata?.party_id);
          refInviteFriend?.current?.open();
        }}
        btnYPress={() => {
          setMidModal(false);
          navigation.navigate('Events', {
            data: {
              id: partydata.party_id,
              title: partydata.title,
            },
            fromDiscover: true,
            navigation: true,
          });
        }}
        btnNPress={() => {
          setMidModal(false);
          navigation.goBack();
        }}
      />
    ) : null;
  };

  const renderAddBankAccount = () => {
    return addBankAc ? (
      <MidModal
        addBankAc
        title={'Add Bank Account'}
        btnTxt={'Add Bank Account'}
        image={Images.coin}
        btnYPress={() => {
          setaddBankAc(false);
          navigation.navigate('AddBankAc', {
            data: fillPartyData,
            fromParty: true,
            navigation: true,
          });
        }}
        btnNPress={() => {
          setaddBankAc(false);
        }}
      />
    ) : null;
  };

  // this modal will be used in future after discussion with client
  const renderPaymentModal = () => {
    return paymentModal ? (
      <MidModal
        coin={'$200'}
        title={'Pay Now and Join the Event'}
        description={
          'you can pay via credit/debit card and also via apple pay and paypal'
        }
        btnTxt={'Pay Now'}
        image={Images.payImg}
        btnYPress={() => {
          // navigation.navigate('PaymentMethod');
          setPaymentModal(false);
        }}
        btnNPress={() => {
          setPaymentModal(false);
        }}
      />
    ) : null;
  };

  const renderSelectOptionsModal = () => {
    return (
      <SelectPhotoModal
        refRBSheet={refPhotoRBSheet}
        title={'Upload images'}
        optionsArray={optionsArray}
      />
    );
  };

  // create party form - in progress
  const renderCreatePartyForm = () => {
    const today = moment().format('yyyy-MM-DD');
    const values = moment().add(2, 'years').format('YYYY');
    const dateTo = moment(partyDate).format('YYYY-MM-DD');
    const dateFrom = moment(dateTo).add(7, 'd').format('YYYY-MM-DD');
    const month = moment().format('MM');
    const Days = moment().format('DD');
    const EndDate = `${values}-${month}-${Days}`;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: BaseColors.white,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            richTextReference?.current?.dismissKeyboard();
          }}
          style={{ flex: 1 }}>
          <View style={[styles.mainView, { marginTop: 20 }]}>
            <TextInput
              value={partyTitle}
              mandatory={true}
              style={styles.TextInp1}
              inputStyle={IOS ? { height: 25 } : { height: 50 }}
              title={'Party Title'}
              showError={partyTitleErr}
              errorText={partyTitleErrTxt}
              onChange={(value) => {
                setPartyTitle(value);
              }}
            />
          </View>
          <View
            style={[
              styles.mainView,
              { marginTop: !selectedPartyErr ? 20 : null },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.titleText}>
                Select Party{' '}
                <Text
                  style={{
                    color: BaseColors.primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  *
                </Text>
              </Text>
            </View>

            <CDropDown
              isSearch
              isMultiDropDown
              required
              multipleSelectedData={selectedParty}
              data={interestList}
              getSelectedData={(v) => {
                setSelectedParty(v);
              }}
              onAddClick={(v) => {
                addInArr(v);
              }}
            />
            <Text style={styles.errorTxt}>
              {selectedPartyErr ? selectedPartyErrTxt : ''}
            </Text>
          </View>
          <View style={styles.mainView}>
            <Text style={styles.titleText}>
              Add Location{' '}
              <Text
                style={{
                  color: BaseColors.primary,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                *
              </Text>
            </Text>

            <View>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: BaseColors.borderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    paddingRight: 10,
                    zIndex: 1,
                  },
                ]}>
                <GooglePlacesAutocomplete
                  ref={googlePlaceRef}
                  enablePoweredByContainer={false}
                  listViewDisplayed={false}
                  fetchDetails={true}
                  currentLocation={true}
                  predefinedPlacesAlwaysVisible={true}
                  returnKeyType="search"
                  // predefinedPlaces={[homePlace]}
                  nearbyPlacesAPI="GooglePlacesSearch"
                  keyboardShouldPersistTaps={'handled'}
                  keepResultsAfterBlur={true}
                  debounce={100}
                  textInputProps={{
                    value: locAdd,
                    onChangeText: (text) => {
                      setLocAdd(text);
                    },
                  }}
                  onPress={(data, details = null) => {
                    setLocationdata(details);
                    setLocAdd(details.formatted_address);
                    const region = {
                      latitude: details?.geometry?.location?.lat,
                      longitude: details?.geometry?.location?.lng,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    };
                    mapView?.current?.animateToRegion(region, 300);
                    setLocData({});
                  }}
                  onFail={(e) => {
                    console.log('Location error ===>> ', e);
                  }}
                  query={{
                    key: BaseSetting?.MAPS_API_CALL_KEY,
                    language: 'en',
                    components: 'country:gb',
                  }}
                  styles={{
                    textInputContainer: {
                      zIndex: 1,
                      alignItems: 'center',
                      alignContent: 'center',
                      justifyContent: 'center',
                    },
                    listView: {
                      zIndex: 10,
                      color: 'black',
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.6,
                      elevation: 10,
                    },
                    textInput: {
                      zIndex: 0,
                      color: BaseColors.lightBlack,
                      fontFamily: FontFamily.regular,
                      alignSelf: 'center',
                      marginBottom: 0,
                      marginRight: 24,
                      borderRadius: 8,
                    },
                  }}
                />
              </View>
              <Text style={styles.errorTxt}>
                {locationDataErr ? locationDataErrTxt : ''}
              </Text>
            </View>
          </View>

          {!_.isEmpty(locationData) || (!isEmpty(locData) && isEdit) ? (
            <View style={styles.mainView}>
              <Text
                style={[
                  styles.titleText,
                  {
                    fontFamily: FontFamily.semiBold,
                  },
                ]}>
                {'Long press & drag the marker in map for precise location'}
              </Text>

              <MapView
                style={{
                  height: 200,
                  marginBottom: 10,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
                ref={mapView}
                showsUserLocation={false}
                zoomEnabled
                provider="google"
                zoomControlEnabled
                initialRegion={{
                  latitude: !_.isEmpty(locData)
                    ? locData?.latitude
                    : locationData?.geometry?.location?.lat,
                  longitude: !_.isEmpty(locData)
                    ? locData?.longitude
                    : locationData?.geometry?.location?.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                region={{
                  latitude: !_.isEmpty(locData)
                    ? locData?.latitude
                    : locationData?.geometry?.location?.lat,
                  longitude: !_.isEmpty(locData)
                    ? locData?.longitude
                    : locationData?.geometry?.location?.lng,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                }}
                onPress={(e) => {
                  setLocData(e.nativeEvent.coordinate);
                }}>
                <Marker
                  draggable={true}
                  coordinate={{
                    latitude: !_.isEmpty(locData)
                      ? locData?.latitude
                      : locationData?.geometry?.location?.lat,
                    longitude: !_.isEmpty(locData)
                      ? locData?.longitude
                      : locationData?.geometry?.location?.lng,
                  }}
                  onDragEnd={(e) => {
                    setLocData(e.nativeEvent.coordinate);
                  }}
                />
              </MapView>
            </View>
          ) : null}
          <View style={[styles.mainView]}>
            <Text style={styles.titleText}>
              Note{' '}
              <Text
                style={{
                  color: BaseColors.primary,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                *
              </Text>
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e3e3e3',
                flex: 1,
                minHeight: 200,
              }}>
              <RichToolbar
                style={[styles.richBar]}
                flatContainerStyle={styles.flatStyle}
                editor={richTextReference}
                // disabled={disabled}
                // iconTint={color}
                selectedIconTint={'#2095F2'}
                // disabledIconTint={'#bfbfbf'}
                // onPressAddImage={onPressAddImage}
                // iconSize={24}
                // iconGap={10}
                actions={[
                  // actions.fontSize,
                  'bold',
                  'italic',
                  'unorderedList',
                  'orderedList',
                  // actions.setTextColor,
                  actions.heading1,
                  actions.heading2,
                  actions.heading3,
                  actions.heading4,
                  actions.undo,
                  actions.redo,
                  actions.insertOrderedList,
                  actions.setParagraph,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.alignFull,
                  actions.setStrikethrough,
                  actions.blockquote,
                  // actions.code,
                  actions.line,
                ]}
                iconMap={{
                  // [actions.setTextColor]: () => (
                  //   <MIcon name="format-color-text" size={20} color={'gray'} />
                  // ),
                  [actions.setParagraph]: () => (
                    <FA5Icon name="paragraph" size={20} color={'gray'} />
                  ),
                  [actions.heading1]: () => (
                    <Text bold style={{ color: 'gray' }}>
                      H1
                    </Text>
                  ),
                  [actions.heading2]: () => (
                    <Text bold style={{ color: 'gray' }}>
                      H2
                    </Text>
                  ),
                  [actions.heading3]: () => (
                    <Text bold style={{ color: 'gray' }}>
                      H3
                    </Text>
                  ),
                  [actions.heading4]: () => (
                    <Text bold style={{ color: 'gray' }}>
                      H4
                    </Text>
                  ),
                }}
              />
              <RichEditor
                androidHardwareAccelerationDisabled
                // initialFocus={true}
                // disabled={disabled}
                editorStyle={styles.contentStyle} // default light style
                ref={richTextReference}
                style={styles.rich}
                useContainer
                androidLayerType="software"
                // initialHeight={40}
                enterKeyHint={'done'}
                containerStyle={{}}
                placeholder={'Edit your text here...'}
                initialContentHTML={note}
                // editorInitializedCallback={editorInitializedCallback}
                onChange={(text) => {
                  setNote(text);
                }}
                // onHeightChange={handleHeightChange}
                // onPaste={handlePaste}
                // onKeyUp={handleKeyUp}
                // onKeyDown={handleKeyDown}
                // onInput={handleInput}
                // onMessage={handleMessage}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
                // onCursorPosition={handleCursorPosition}
                pasteAsPlainText={true}
              />
            </View>
            <Text style={styles.errorTxt}>{noteErr ? noteErrTxt : null}</Text>
          </View>

          <View
            style={[
              styles.mainView,
              {
                flexDirection: 'row',
              },
            ]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <TextInput
                Date
                mandatory={true}
                showError={partyDateErr}
                errorText={partyDateErrTxt}
                ref={dobRef}
                onSubmit={() => {
                  toDateRef.current.focus();
                }}
                title={'Date of Party'}
                onDateChange={(d) => {
                  setDateDisable(false);
                  setPartyDate(d);
                }}
                inputStyle={IOS ? { height: 28 } : { height: 50 }}
                date={partyDate}
                selectedDate={partyDate}
                minDate={today} //{startDate}
                maxDate={EndDate} // {EndDate}
                returnKeyType="next"
                style={{
                  borderColor: BaseColors.borderColor,
                  marginBottom: 0,
                }}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <TextInput
                Date
                disabledDate={dateDisable}
                mandatory={true}
                showError={toDateErr}
                errorText={toDateErrTxt}
                ref={toDateRef}
                onSubmit={() => {
                  dobRef.current.focus();
                }}
                title={'End Date of Party'}
                onDateChange={(d) => {
                  setToDate(d);
                }}
                inputStyle={IOS ? { height: 28 } : { height: 50 }}
                date={toDate}
                selectedDate={toDate}
                minDate={moment(partyDate).format('yyyy-MM-DD')} //{startDate}
                maxDate={dateFrom} // {EndDate}
                returnKeyType="next"
                style={{
                  borderColor: BaseColors.borderColor,
                  marginBottom: 0,
                  backgroundColor: dateDisable ? '#dddddd' : '#0000',
                }}
              />
            </View>
          </View>

          <View
            style={[
              styles.mainView,
              { flexDirection: 'row', marginTop: !partyDateErr ? 30 : 0 },
            ]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text>
                Start Time{' '}
                <Text
                  style={{
                    color: BaseColors.primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  *
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (!IOS) {
                    setStartDatePicker(true);
                  }
                }}
                style={styles.dateInput}>
                <Text
                  style={{ paddingLeft: 10, fontFamily: FontFamily.regular }}>
                  {IOS ? startTime : moment(startTime).format('hh:mm A')}
                </Text>
                {IOS ? (
                  <DatePicker
                    iconComponent={null}
                    hideText={true}
                    date={startTime}
                    mode="time"
                    showIcon={false}
                    placeholder="Select Time"
                    format="hh:mm A"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    allowFontScaling={false}
                    onDateChange={(v) => {
                      setStartTime(v);
                    }}
                    style={styles.datePickerStyle}
                  />
                ) : startDatePicker ? (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startTime}
                    mode="time"
                    // is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setStartDatePicker(false);
                      if (event.type == 'set') {
                        setStartTime(selectedDate);
                      }
                    }}
                  />
                ) : null}
              </TouchableOpacity>
              <Text style={styles.errorTxt}>
                {startTimeErr ? startTimeErrTxt : ''}
              </Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <Text>
                End Time{' '}
                <Text
                  style={{
                    color: BaseColors.primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  *
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (!IOS) {
                    setEndDatePicker(true);
                  }
                }}
                style={styles.dateInput}>
                <Text
                  style={{ paddingLeft: 10, fontFamily: FontFamily.regular }}>
                  {IOS ? endTime : moment(endTime).format('hh:mm A')}
                </Text>
                {IOS ? (
                  <DatePicker
                    iconComponent={null}
                    hideText={true}
                    date={endTime}
                    mode="time"
                    showIcon={false}
                    placeholder="Select Time"
                    format="hh:mm A"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    allowFontScaling={false}
                    onDateChange={(v) => {
                      setEndTime(v);
                    }}
                    style={styles.datePickerStyle}
                  />
                ) : endDatePicker ? (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={endTime}
                    mode="time"
                    // is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setEndDatePicker(false);
                      if (event.type == 'set') {
                        setEndTime(selectedDate);
                      }
                    }}
                  />
                ) : null}
              </TouchableOpacity>
              <Text style={styles.errorTxt}>
                {endTimeErr ? endTimeErrTxt : ''}
              </Text>
            </View>
          </View>
          <View style={styles.mainView}>
            <Text style={styles.titleText}>
              Select Age{' '}
              <Text
                style={{
                  color: BaseColors.primary,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                *
              </Text>
            </Text>
            <View
              style={[
                {
                  marginTop: 5,
                },
              ]}>
              <RangeSlider
                min={0}
                max={100}
                step={1}
                low={minMaxValues?.min}
                high={minMaxValues?.max}
                floatingLabel
                setRangeDisabled
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onTouchEnd={handleValueChange}
              />
            </View>
          </View>
          {isEdit ? null : (
            <>
              <View
                style={[
                  styles.mainView,
                  { flexDirection: 'row', marginTop: 10 },
                ]}>
                <View style={{ width: '50%' }}>
                  <RadioButton
                    Title={'Private Party'}
                    onPress={() => {
                      setSelectedRB(true);
                    }}
                    selected={selectedRB}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <RadioButton
                    Title={'Public Party'}
                    onPress={() => {
                      setSelectedRB(false);
                    }}
                    selected={!selectedRB}
                  />
                </View>
              </View>
              <View style={[styles.mainView, { flexDirection: 'row' }]}>
                <View style={{ width: '50%' }}>
                  <RadioButton
                    Title={'Free Party'}
                    onPress={() => {
                      setSelectedRB2(true);
                    }}
                    selected={selectedRB2}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <RadioButton
                    Title={'Paid Party'}
                    onPress={() => {
                      setSelectedRB2(false);
                    }}
                    selected={!selectedRB2}
                  />
                </View>
              </View>

              {!selectedRB2 ? (
                <View style={[styles.mainView, { marginTop: 10 }]}>
                  <TextInput
                    keyBoardType="number-pad"
                    style={styles.TextInp1}
                    value={charges}
                    title={'Charges'}
                    otherPlaceholder={'£25'}
                    // placeholder= '£25'
                    mandatory={true}
                    onChange={(value) => {
                      let a = value.replaceAll(' ', '');
                      setCharges(a);
                    }}
                    showError={chargeErr}
                    errorText={chargeErrTxt}
                  />
                </View>
              ) : null}
            </>
          )}

          <View
            style={[
              styles.mainView,
              {
                marginBottom: 5,
                marginTop: !chargeErr ? 20 : 0,
              },
            ]}>
            <Text style={styles.titleText}>
              Upload Images (max. 5){' '}
              <Text
                style={{
                  color: BaseColors.primary,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                *
              </Text>
            </Text>
            <CUploadImages
              ref={CUploadingImages}
              umImages={umImages}
              onPressUpload={() => {
                setTimeout(() => {
                  refPhotoRBSheet.current.open();
                }, 200);
              }}
              loaderRemove={loaderRemove}
              removeImage={(index, item) => {
                if (isEdit) {
                  removePartyImg(index, item);
                } else {
                  removeImage(index);
                }
                setLoaderRemove(true);
              }}
            />
            <Text style={styles.errorTxt}>{imageErr ? imageErrTxt : ''}</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.mainView, { paddingVertical: 20 }]}>
          <Button
            type="primary"
            loading={createbtnLoader}
            onPress={() => {
              validateFields();
            }}>
            {isEdit ? 'Edit Party' : 'Create Party'}
          </Button>
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <Header
        title={isEdit ? 'Edit Party' : 'Create Party'}
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      {mainLoader ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={34} color={BaseColors.primary} animating />
        </View>
      ) : (
        <>
          {renderCreatePartyForm()}
          {renderSelectOptionsModal()}
          {renderMidModal()}
          {renderAddBankAccount()}
          {renderPaymentModal()}
          <FormModal
            rbSheetRef={refInviteFriend}
            title={'Invite Friends'}
            onClose={() => {
              navigation.popToTop();
            }}>
            {renderModalList(
              invitedFrndList,
              refInviteFriend,
              'Done',
              'invite-friends',
            )}
          </FormModal>
        </>
      )}
    </>
  );
}

export default CreateParty;
