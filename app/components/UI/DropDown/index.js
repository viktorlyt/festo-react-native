/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { DEFAULT_THEME } from 'react-native-country-picker-modal';
import AIcon from 'react-native-vector-icons/AntDesign';
import { Text } from '@components';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
const IOS = Platform.OS === 'ios';

export default function DropDown(props) {
  const { darkmode } = useSelector((state) => state.auth);
  const [focused, setFocused] = useState(false);
  const {
    Data,
    onValueChange,
    textStyle,
    title,
    style,
    gender,
    onPressD,
    selectedObj,
    selectedValue,
    dropdownError,
    dropdownErrorTxt,
    dropDownList,
    mandatory,
    ...rest
  } = props;

  const myTheme = {
    ...DEFAULT_THEME,
    primaryColor: '#ccc',
    primaryColorVariant: '#eee',
    onBackgroundTextColor:
      !showOptions && darkmode ? 'white' : BaseColors.black,
    backgroundColor: darkmode ? 'black' : BaseColors.white,
    filterPlaceholderTextColor: '#aaa',
  };
  console.log('🚀🚀🚀🚀 ~ DropDown ~ dropdownError', dropdownError);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(selectedValue || '');

  const renderOptions = () => {
    return (
      <View>
        <ScrollView
          style={[styles.modalView, { display: showOptions ? 'flex' : 'none' }]}
          indicatorStyle={{ backgroundColor: 'red', width: 100 }}
          contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity
            style={styles.centeredView}
            onPress={() => {
              setShowOptions(!showOptions);
            }}>
            {dropDownList.map((obj, index) => {
              return (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                  }}
                  onPress={(el) => {
                    setShowOptions(!showOptions);
                    setSelected(obj.title);
                    onPressD(obj.title);
                    selectedObj(obj);
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      color: BaseColors.textSecondary,
                    }}>
                    {obj.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {title ? (
        <>
          <Text
            style={{
              ...styles.title,
              paddingVertical: Date ? (IOS ? 5 : 10) : 0,
              paddingBottom: IOS ? 10 : 0,
              color:
                darkmode && !focused
                  ? 'white'
                  : !darkmode
                  ? BaseColors.textGrey
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
        onPress={() => {
          setShowOptions(!showOptions);
          Keyboard.dismiss();
        }}
        style={{
          paddingHorizontal: 10,
          borderRadius: 10,
          marginBottom: 10,
          borderColor: BaseColors.borderColor,
          borderWidth: 1,
          paddingLeft: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          paddingVertical: 5,
        }}>
        <Text
          style={{
            paddingLeft: 10,
            paddingVertical: 10,
            fontSize: 14,
            alignItems: 'center',
          }}>
          {selected === '' ? 'Credit Card' : selected}
        </Text>
        <AIcon name="down" size={15} style={{ paddingRight: 15 }} />
      </TouchableOpacity>
      {dropdownError ? (
        <Text style={{ color: 'red', paddingLeft: 10 }}>
          {dropdownErrorTxt}
        </Text>
      ) : null}
      {renderOptions()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
  },
  centeredView: {
    alignItems: 'center',
  },
  modalView: {
    maxHeight: Dimensions.get('window').height / 6,
    backgroundColor: BaseColors.white,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    // borderWidth:2
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
  },
});

DropDown.propTypes = {
  dropDownList: PropTypes.array,
  onValueChange: PropTypes.func,
  title: PropTypes.string,
  textStyle: PropTypes.object,
  style: PropTypes.object,
  gender: PropTypes.bool,
  onPressD: PropTypes.func,
  selectedObj: PropTypes.func,
  dropdownError: PropTypes.bool,
  dropdownErrorTxt: PropTypes.string,
  mandatory: PropTypes.bool,
};

DropDown.defaultProps = {
  dropDownList: [],
  onValueChange: () => {},
  title: '',
  textStyle: {},
  style: {},
  gender: false, // true || false
  onPressD: () => {},
  selectedObj: () => {},
  dropdownError: false, // true || false
  dropdownErrorTxt: '',
  mandatory: false, // true || false
};
