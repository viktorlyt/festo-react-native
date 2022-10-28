/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import CountryPicker, {
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/Fontisto';
// import { BaseColors, BaseStyles } from '@config/theme';
import Toast from 'react-native-simple-toast';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Image from 'react-native-fast-image';
import { Images } from '@config';
import { translate } from 'app/lang/Translate';
import { BaseColors, FontFamily } from '@config/theme';

let currentDate = moment().format('YYYY-MM-DD');

const IOS = Platform.OS === 'ios';
/**
 *
 *  Component for TextInput
 * @function CInput
 *
 */
function CInput(props, ref) {
  const { darkmode } = useSelector((state) => state.auth);

  const colors = useTheme();
  // const BaseColors = colors.colors;

  const {
    title,
    otherPlaceholder,
    placeholderText,
    onSubmit,
    onChange,
    onCountryChange,
    value,
    secureText,
    placeholderStyle,
    onBlur,
    style,
    onFocus,
    phoneNumber,
    Date,
    date,
    onDateChange,
    selectedDate,
    showError,
    keyBoardType,
    errorText,
    returnKeyType,
    mandatory,
    country,
    callingCode,
    countryCode,
    minDate,
    maxDate,
    DateError,
    textArea,
    // DateErrorTxt,
    // maxLength,
    disabledDate,
    inputStyle = {},
    onTouchStart = () => null,
    ...rest
  } = props;
  // const [countryCode, setCountryCode] = useState(__DEV__ ? 'IN' : 'HK');
  // const [callingCode, setCallingCode] = useState(__DEV__ ? '91' : '852');
  const dateRef = useRef();
  const [focused, setFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [timesPressed, setTimesPressed] = useState(false);

  // const onSelect = (Country) => {
  //   console.log('Button Long Pressed');
  //   setTimesPressed(!timesPressed);
  //   onCountryChange(timesPressed ? '04' : '91', timesPressed ? 'AU' : 'IN');
  //   // console.log('===> ~ onSelect ~ Country', Country);
  //   // setCallingCode(Country.callingCode[0]);
  //   // setCountryCode(Country.cca2);
  //   // onCountryChange(Country);
  // };

  const handlerLongClick = () => {
    console.log('Button Long Pressed');
    setTimesPressed(!timesPressed);
    onCountryChange(timesPressed ? '44' : '91', timesPressed ? 'GB' : 'IN');
  };

  const disabled = _.has(props, 'editable') && props.editable === false;

  const handlePress = () => {
    if (disabled) {
      console.log('TOASTING');
      Toast.show(translate('thisFieldIsNotEditable'));
    }
  };
  const myTheme = {
    ...DEFAULT_THEME,
    primaryColor: '#ccc',
    primaryColorVariant: '#eee',
    onBackgroundTextColor: !isVisible && darkmode ? 'white' : BaseColors.black,
    backgroundColor: darkmode ? 'black' : BaseColors.white,
    filterPlaceholderTextColor: '#aaa',
  };
  return (
    <>
      {title ? (
        <>
          <Text
            style={{
              ...styles.title,
              paddingBottom: 5,
              // marginLeft: 20,
              color:
                darkmode && !focused
                  ? 'white'
                  : !darkmode
                  ? BaseColors.black
                  : BaseColors.white,
            }}>
            {title}
            <Text
              style={{
                color: 'red',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {mandatory ? ' *' : ''}
            </Text>
          </Text>
        </>
      ) : null}
      <TouchableOpacity
        activeOpacity={1}
        onPress={Date ? () => dateRef.current.onPressDate() : handlePress}
        style={{
          backgroundColor: focused ? 'white' : BaseColors.white,
          paddingHorizontal: focused ? 10 : 0,
          paddingBottom: IOS ? 10 : 0,
          paddingTop: IOS ? 10 : 0,
          textAlign: 'center',
          borderRadius: 10,
          marginBottom: showError ? 5 : 10,
          borderColor: showError ? '#FF0B1E' : BaseColors.borderColor,
          borderWidth: showError ? 1 : 1,
          paddingLeft: showError ? 10 : 10,
          // marginTop: showError ? 10 : 5,
          elevation: focused ? 5 : 0,
          ...style,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {phoneNumber ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                delayLongPress={1000}
                activeOpacity={0.8}
                // onLongPress={handlerLongClick}
                style={styles.socialLoginViewStyle}>
                {timesPressed ? (
                  <Image source={Images.india} style={styles.imgStyle} />
                ) : (
                  <Image source={Images.uk} style={styles.imgStyle} />
                )}
              </TouchableOpacity>
              {_.isEmpty(callingCode) ? null : (
                <Text
                  style={{
                    opacity: 0.5,
                    // borderLeftWidth: 1,
                    padding: 3,
                    fontSize: 14,
                    paddingTop: IOS ? 2 : 3,
                    color: disabled
                      ? BaseColors.textSecondary
                      : focused
                      ? 'black'
                      : BaseColors.black,
                  }}
                  color={
                    disabled
                      ? BaseColors.textSecondary
                      : focused
                      ? 'black'
                      : BaseColors.black
                  }>
                  +{callingCode}
                </Text>
              )}
            </View>
          ) : null}

          {Date ? (
            <View
              style={{
                ...styles.datePickView,
                borderColor: DateError ? 'red' : BaseColors.black,
                borderWidth: DateError ? 1 : 0,
                // opacity: darkmode ? 1 : 0.5,
                // paddingBottom: 10,
              }}>
              <DatePicker
                ref={dateRef}
                disabled={disabledDate}
                hideText={true}
                style={[
                  styles.datePickStyle,
                  { color: BaseColors.inactive },
                  inputStyle,
                ]}
                date={date}
                showIcon={false}
                mode="date"
                placeholder=""
                format="YYYY-MM-DD"
                minDate={minDate}
                maxDate={maxDate}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                allowFontScaling={false}
                customStyles={{
                  datePicker: {
                    backgroundColor: '#FFF',
                    color: 'black',
                    justifyContent: 'center',
                  },
                  dateText: {
                    // color: '#000',
                    color: disabled
                      ? BaseColors.textSecondary
                      : focused
                      ? 'black'
                      : BaseColors.black,
                  },
                }}
                onDateChange={onDateChange}
              />
              <TouchableOpacity
                style={{ ...styles.dateTxt }}
                activeOpacity={0.5}
                onPress={() => dateRef.current.onPressDate()}>
                <Text
                  style={{
                    color: BaseColors.black,
                    // opacity: 0.5,
                  }}>
                  {selectedDate
                    ? moment(selectedDate).format('DD-MM-YYYY')
                    : ''}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TextInput
              {...rest}
              ref={ref}
              autoCorrect={false}
              onFocus={onFocus}
              multiline={textArea ? true : false}
              value={value}
              onTouchStart={() => {
                if (onTouchStart) {
                  onTouchStart();
                }
              }}
              placeholder={placeholderText ? '' : otherPlaceholder}
              placeholderTextColor={BaseColors.textSecondary}
              onSubmitEditing={onSubmit}
              onChangeText={onChange}
              secureTextEntry={secureText}
              keyboardType={keyBoardType}
              returnKeyType={returnKeyType}
              // maxLength={maxLength}
              style={[
                {
                  // ...placeholderStyle,
                  paddingHorizontal: 0,
                  // fontWeight: focused ? 'bold' : darkmode ? 'bold' : 'normal',
                  // opacity: focused ? 1 : 0.5,
                  fontSize: 14,
                  paddingLeft: phoneNumber ? 10 : 0,
                  color: disabled
                    ? BaseColors.textSecondary
                    : focused
                    ? 'black'
                    : BaseColors.black,
                  width: '100%',
                  height: IOS ? 28 : 50,
                },
                IOS && textArea
                  ? {
                      height: 60,
                    }
                  : {},
                inputStyle,
              ]}
              onBlur={onBlur}
            />
          )}
        </View>
      </TouchableOpacity>
      {showError ? <Text style={styles.errorTxt}>{errorText}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  datePickView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // opacity: 0.5,
    borderRadius: 5,
    // height: 33,\
    height: IOS ? 28 : 50,
  },
  datePickStyle: {
    width: 0,
    alignItems: 'flex-start',
    height: IOS ? 18 : 30,
    justifyContent: 'center',
  },
  dateTxt: {
    textAlign: 'left',
    flex: 1,
    paddingBottom: 0,
  },
  socialLoginViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginLeft: -2,
  },
  imgStyle: {
    width: 30,
    height: 30,
  },
  errorTxt: {
    color: '#FF0B1E',
    paddingLeft: 5,
    paddingBottom: 10,
  },
});

CInput.propTypes = {
  title: PropTypes.string,
  placeholderText: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  secureText: PropTypes.bool,
  placeholderStyle: PropTypes.object,
  style: PropTypes.object,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  phoneNumber: PropTypes.bool,
  Date: PropTypes.bool,
  date: PropTypes.string,
  onDateChange: PropTypes.func,
  selectedDate: PropTypes.string,
  showError: PropTypes.bool,
  keyBoardType: PropTypes.string,
  errorText: PropTypes.string,
  returnKeyType: PropTypes.string,
  mandatory: PropTypes.bool,
  DateError: PropTypes.bool,
  disabledDate: PropTypes.bool,
  textArea: PropTypes.bool,
  // DateErrorTxt: PropTypes.string,
  // maxLength: PropTypes.number,
};

CInput.defaultProps = {
  title: '',
  placeholderText: '',
  onSubmit: () => {},
  onChange: () => {},
  value: '',
  secureText: false, // true | false
  placeholderStyle: {},
  style: {},
  onBlur: () => {},
  onFocus: () => {},
  phoneNumber: false, // true | false
  Date: false, // true | false
  date: currentDate,
  onDateChange: () => {},
  selectedDate: '',
  showError: false, // true | false
  keyBoardType: 'Default',
  errorText: '',
  returnKeyType: '',
  mandatory: false, // true | false
  DateError: false, // true | false
  // DateErrorTxt: '',
  disabledDate: false,
  textArea: false,
  // maxLength: 1000000000000000,
};

export default React.forwardRef(CInput);
