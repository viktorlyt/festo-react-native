/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from './styles';
import { Button, TextInput, Header, Text } from '@components';
import FIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/AntDesign';
import AuthAction from '@redux/reducers/auth/actions';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';
import { BaseColors } from '@config/theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from '../../libs/react-native-image-crop-picker';
import { CustomIcon } from '@config/LoadIcons';
import { isEmpty } from 'lodash';
import moment from 'moment';

/**
 * Module   Create_Profile
 * @module   Create_Profile
 *
 */

export default function Create_Profile({ navigation, route }) {
  const dispatch = useDispatch();
  const from = route?.params?.from || '';
  const profileData = route?.params?.data || {};
  const IOS = Platform.OS === 'ios';
  const { setUserData } = AuthAction;

  const refRBSheet = useRef();
  const profileSheet = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const dobRef = useRef();
  const bioRef = useRef();
  // const genderRef = useRef();

  const [selected, setSelected] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameErr, setsetFirstNameErr] = useState(false);
  const [firstNameErrTxt, setsetFirstNameTxt] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameErr, setLastNameErr] = useState(false);
  const [lastNameErrTxt, setLastNameErrTxt] = useState('');

  const [birthDateErr, setBirthDateErr] = useState(false);
  const [birthDateErrTxt, setBirthDateErrTxt] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [bioErr, setBioErr] = useState(false);
  const [bioErrTxt, setBioErrTxt] = useState('');
  const [bio, setBio] = useState('');

  const [image, setImage] = useState('');
  const [imageLoader, setImageLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  useEffect(() => {
    if (from === 'Profile') {
      let first_name =
        profileData?.first_name.charAt(0).toUpperCase() +
        profileData?.first_name.slice(1);
      let last_name =
        profileData?.last_name.charAt(0).toUpperCase() +
        profileData?.last_name.slice(1);

      setFirstName(first_name);
      setLastName(last_name);
      setBirthDate(new Date(profileData?.birth_date));
      setBio(profileData?.bio_description);
      setSelected(profileData?.gender);
      setImage(profileData?.photo);
    }
  }, []);

  // function for openCamera
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 200,
      height: 200,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((image) => {
      console.log(image);
      profileSheet.current.close();
      setImage(image.path);

      const imgFile = {
        uri: image?.path,
        name: image?.path.substr(image?.path.lastIndexOf('/') + 1),
        type: image.mime,
      };
      UpdateImage(imgFile);
    });
  };

  // function for openGallery
  const openGallery = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((image) => {
      console.log(image);
      profileSheet.current.close();
      setImage(image.path);

      const imgFile = {
        uri: image?.path,
        name: image?.path.substr(image?.path.lastIndexOf('/') + 1),
        type: image.mime,
      };
      UpdateImage(imgFile);
    });
  };

  // function for Validating data
  const handleSubmit = () => {
    let valid = true;

    function getAgeFromBirthday() {
      var totalMonths = moment().diff(birthDate, 'months');
      var years = parseInt(totalMonths / 12);
      if (years >= 18) {
        return true;
      }
      return false;
    }

    if (isEmpty(firstName.trim())) {
      valid = false;
      setsetFirstNameErr(true);
      setsetFirstNameTxt('First Name is required');
    } else if (firstName[0].toUpperCase() !== firstName[0]) {
      valid = false;
      setsetFirstNameErr(true);
      setsetFirstNameTxt('First letter should be Capital');
    } else if (!firstName.trim().match('^[a-zA-Z]*$')) {
      valid = false;
      setsetFirstNameErr(true);
      setsetFirstNameTxt('Please Enter Valid Name');
    } else {
      setsetFirstNameErr(false);
      setsetFirstNameTxt('');
    }

    if (isEmpty(lastName.trim())) {
      valid = false;
      setLastNameErr(true);
      setLastNameErrTxt('Last Name is required');
    } else if (lastName[0].toUpperCase() !== lastName[0]) {
      valid = false;
      setLastNameErr(true);
      setLastNameErrTxt('First letter should be Capital');
    } else if (!lastName.trim().match('^[a-zA-Z]*$')) {
      valid = false;
      setLastNameErr(true);
      setLastNameErrTxt('Please Enter Valid Name');
    } else {
      setLastNameErr(false);
      setLastNameErrTxt('');
    }

    if (isEmpty(birthDate.toString())) {
      valid = false;
      setBirthDateErr(true);
      setBirthDateErrTxt('Birth Date is required');
    } else if (!getAgeFromBirthday()) {
      valid = false;
      setBirthDateErr(true);
      setBirthDateErrTxt('You are not 18+');
    } else {
      setBirthDateErr(false);
      setBirthDateErrTxt('');
    }

    if (isEmpty(bio.trim())) {
      valid = false;
      setBioErr(true);
      setBioErrTxt('Bio is required');
    } else {
      setBioErr(false);
      setBioErrTxt('');
    }

    if (valid) {
      CreateProfile();
    }
  };

  //API Call for UpdateImage
  async function UpdateImage(file) {
    setImageLoader(true);
    try {
      const data = {
        'ImageForm[photo]': file,
      };

      const resp = await getApiData(
        BaseSetting.endpoints.editImg,
        'POST',
        data,
      );
      if (resp?.status) {
        setImage(resp?.data);
        setImageLoader(false);
        Toast.show(resp?.message);
      } else {
        Toast.show(resp?.message);
        setImageLoader(false);
      }
    } catch (error) {
      Toast.show(error.toString());
      console.log('ERRRRR', error);
      setImageLoader(false);
    }
  }

  //API Call for CreateProfile
  async function CreateProfile() {
    setBtnLoader(true);
    let endPoints =
      from === 'Profile'
        ? BaseSetting.endpoints.editProfile
        : BaseSetting.endpoints.createProfile;

    try {
      const data = {
        'UserData[first_name]': firstName.trim(),
        'UserData[last_name]': lastName.trim(),
        'UserData[birth_date]':
          from === 'Profile'
            ? moment(birthDate).format('YYYY-MM-DD')
            : birthDate,
        'UserData[gender]': selected,
        'UserData[bio_description]': bio.trim(),
      };
      const resp = await getApiData(endPoints, 'POST', data);
      if (resp?.status) {
        dispatch(setUserData(resp?.data));
        if (from === 'Profile') {
          navigation.goBack();
        } else {
          navigation.navigate('AddIntrest');
        }
        setBtnLoader(false);
      } else {
        Toast.show(resp?.message);
        setBtnLoader(false);
      }
    } catch (error) {
      Toast.show(error.toString());
      console.log('ERRRRR', error);
      setBtnLoader(false);
    }
  }

  const genderArray = [
    {
      id: 1,
      label: 'Male',
    },
    {
      id: 2,
      label: 'Female',
    },
    {
      id: 3,
      label: 'Other',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        whiteHeader={from === 'Profile' ? false : true}
        title={from === 'Profile' ? 'Edit Profile' : ''}
        leftIcon={from === 'Profile' ? true : false}
        leftIconName={from === 'Profile' ? 'arrowleft' : ''}
        onBackPress={from === 'Profile' ? () => navigation.goBack() : null}
      />

      {from === 'Profile' ? null : (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <Text
            bold
            style={{
              fontSize: 22,
            }}>
            Create Profile
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={IOS ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            backgroundColor: BaseColors.white,
            flexGrow: 1,
            paddingHorizontal: 15,
            marginTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={false}>
          <View style={styles.Cprofile}>
            {imageLoader ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 35,
                  backgroundColor: BaseColors.borderColor,
                }}>
                <ActivityIndicator
                  animating
                  size="large"
                  color={BaseColors.primary}
                />
              </View>
            ) : (
              <Image
                source={
                  !isEmpty(image)
                    ? { uri: image }
                    : require('@assets/Images/placeholder.png')
                }
                style={[styles.avatarSty, { borderRadius: 30 }]}
              />
            )}
            <TouchableOpacity
              onPress={() => profileSheet.current.open()}
              activeOpacity={0.8}
              style={[
                styles.camBtnView,
                {
                  right: -20,
                  bottom: 30,
                },
              ]}>
              <CustomIcon
                name="camera-o"
                size={20}
                color={BaseColors.lightBlack}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.textInputView, { marginHorizontal: 5 }]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <TextInput
                title="First Name"
                ref={firstNameRef}
                onSubmit={() => {
                  lastNameRef.current.focus();
                }}
                value={firstName}
                returnKeyType="next"
                showError={firstNameErr}
                errorText={firstNameErrTxt}
                mandatory={true}
                onChange={(newText) => {
                  let innerTxt =
                    newText.charAt(0).toUpperCase() + newText.slice(1);
                  setFirstName(innerTxt);
                }}
                style={styles.input}
                placeholderTextColor={'#4b4848'}
                placeholderText={'Enter First Name'}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <TextInput
                ref={lastNameRef}
                onSubmit={() => {
                  lastNameRef.current.focus();
                }}
                title="Last Name"
                value={lastName}
                returnKeyType="next"
                showError={lastNameErr}
                errorText={lastNameErrTxt}
                mandatory={true}
                onChange={(newText) => {
                  let innerTxt =
                    newText.charAt(0).toUpperCase() + newText.slice(1);
                  setLastName(innerTxt);
                }}
                style={styles.input}
                placeholderTextColor={'#4b4848'}
                placeholderText={'Enter Last Name'}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={{ flex: 1, marginHorizontal: 5, marginVertical: 5 }}>
            <TextInput
              Date
              ref={dobRef}
              onSubmit={() => {
                dobRef.current.focus();
              }}
              title={'Date of birth'}
              mandatory={true}
              onDateChange={(d) => {
                setBirthDate(d);
                setBirthDateErr(false);
              }}
              date={birthDate}
              selectedDate={birthDate}
              maxDate={new Date()}
              returnKeyType="next"
              showError={birthDateErr}
              errorText={birthDateErrTxt}
            />
            <TextInput
              mandatory={true}
              ref={bioRef}
              onSubmit={() => {
                bioRef.current.focus();
              }}
              value={bio}
              returnKeyType="next"
              textArea
              showError={bioErr}
              errorText={bioErrTxt}
              onChange={(newText) => setBio(newText)}
              title="Bio"
              style={{
                paddingRight: 10,
              }}
              inputStyle={{ height: 90, textAlignVertical: 'top' }}
              placeholderTextColor={'#4b4848'}
              placeholderText={'Enter Bio'}
              underlineColorAndroid="transparent"
            />
            <Text style={styles.Textt2}>Gender</Text>
            <TouchableOpacity
              style={styles.genderInput}
              onPress={() => refRBSheet.current.open()}>
              {console.log('selected ======>>>>> ', selected)}
              <Text>{selected ? selected : ''}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={280}
            dragFromTopOnly={true}
            customStyles={{
              wrapper: {},
              draggableIcon: {
                backgroundColor: '#F3492E',
                width: 50,
              },
              container: {
                backgroundColor: 'white',
                borderTopRightRadius: 45,
                borderTopLeftRadius: 45,
              },
            }}>
            <Text style={styles.texto}>Gender</Text>

            <View
              style={{
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              {genderArray?.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      padding: 10,
                      marginVertical: 2,
                      alignItems: 'center',
                      backgroundColor:
                        selected === item?.label
                          ? BaseColors.lightRed
                          : BaseColors.white,
                    }}
                    onPress={() => setSelected(item?.label)}>
                    <Text
                      color={
                        selected === item?.label
                          ? BaseColors.primary
                          : BaseColors.textGrey
                      }>
                      {item?.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <Button
                type="primary"
                onPress={() => {
                  refRBSheet.current.close();
                }}>
                Done
              </Button>
            </View>
            {/* 
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    selected === 'Male' ? BaseColors.lightRed : BaseColors.white,
                }}
                onPress={() => setSelected('Male')}>
                <Text
                  style={[
                    styles.genderFields,
                    {
                      color:
                        selected === 'Male'
                          ? BaseColors.secondary
                          : BaseColors.textGrey,
                    },
                  ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected('Female')}
                style={{
                  backgroundColor:
                    selected === 'Female'
                      ? BaseColors.lightRed
                      : BaseColors.white,
                }}>
                <Text
                  style={[
                    styles.genderFields,
                    {
                      color:
                        selected === 'Female'
                          ? BaseColors.secondary
                          : BaseColors.textGrey,
                    },
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    selected === 'Other' ? BaseColors.lightRed : BaseColors.white,
                }}
                onPress={() => setSelected('Other')}>
                <Text
                  style={[
                    styles.genderFields,
                    {
                      color:
                        selected === 'Other'
                          ? BaseColors.secondary
                          : BaseColors.textGrey,
                    },
                  ]}>
                  Other
                </Text>
              </TouchableOpacity>
              <View style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                <Button
                  type="primary"
                  onPress={() => {
                    refRBSheet.current.close();
                  }}>
                  Done
                </Button>
              </View>
            </View> */}
          </RBSheet>
          {/* profileModel*/}
          <RBSheet
            ref={profileSheet}
            closeOnDragDown={true}
            height={250}
            dragFromTopOnly={true}
            customStyles={{
              wrapper: {},
              draggableIcon: {
                backgroundColor: '#F3492E',
                width: 50,
              },
              container: {
                backgroundColor: 'white',
                borderTopRightRadius: 45,
                borderTopLeftRadius: 45,
              },
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '700',
                paddingVertical: 10,
              }}>
              Profile
            </Text>

            <View>
              <TouchableOpacity
                onPress={() => {
                  openGallery();
                }}>
                <View style={styles.modalRowView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FAIcon
                      style={styles.leftIcon}
                      size={25}
                      color={BaseColors.textGrey}
                      name="photo"
                    />
                    <Text style={[styles.modelTxt]}>Select From Gallery</Text>
                  </View>
                  <AIcon
                    size={20}
                    color={BaseColors.borderColor}
                    name="right"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  openCamera();
                }}>
                <View style={styles.modalRowView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FIcon
                      style={styles.leftIcon}
                      size={28}
                      color={BaseColors.textGrey}
                      name="camera"
                    />
                    <Text style={[styles.modelTxt]}>Open Camera</Text>
                  </View>
                  <AIcon
                    size={20}
                    color={BaseColors.borderColor}
                    name="right"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
        <View style={styles.btnView}>
          <Button
            loading={btnLoader}
            type="primary"
            onPress={() => {
              handleSubmit();
            }}>
            {from === 'Profile' ? 'Save' : 'Verify'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
