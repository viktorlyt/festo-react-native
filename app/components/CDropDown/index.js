/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Ficon from 'react-native-vector-icons/Feather';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import _, { isEmpty } from 'lodash';
import styles from './styles';
import { Text } from '@components';
import { BaseColors, FontFamily } from '@config/theme';

const CDropDown = (props) => {
  const {
    data,
    required,
    placeholderText,
    isMultiDropDown,
    isSearch,
    isError,
    searchLoader,
    getSelectedData,
    singleSelectedData,
    multipleSelectedData,
    disabled,
    onAddClick,
  } = props;

  const [isDropDownOpen, setIsDropDown] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [singleSelectedValue, setSignleSelectedValue] =
    useState(singleSelectedData);
  const [multiSelectedValue, setValtiSelectedValue] =
    useState(multipleSelectedData);

  function setFilteredData(value) {
    setFilteredList(
      data.filter((e) => e.label.toLowerCase().includes(value.toLowerCase())),
    );
  }

  useEffect(() => {
    setValtiSelectedValue(multipleSelectedData);
  }, [multipleSelectedData]);

  useEffect(() => {
    setFilteredList(data);
  }, [isDropDownOpen]);

  useEffect(() => {
    getSelectedData(singleSelectedValue);
  }, [singleSelectedValue]);

  useEffect(() => {
    if (isMultiDropDown) {
      getSelectedData(multiSelectedValue);
    }
  }, [multiSelectedValue]);

  function removeObject(item) {
    const aryData = [...multiSelectedValue];
    if (_.isArray(aryData) && !_.isEmpty(aryData)) {
      const findIndex = aryData.findIndex(
        (v) => JSON.stringify(v) === JSON.stringify(item),
      );
      if (findIndex >= 0) {
        aryData.splice(findIndex, 1);
        setValtiSelectedValue(aryData);
      }
    }
  }

  function checkMultiSelectedOption(item) {
    let bool = false;
    if (_.isArray(multiSelectedValue) && !_.isEmpty(multiSelectedValue)) {
      const findIndex = multiSelectedValue.findIndex(
        (v) => JSON.stringify(v) === JSON.stringify(item),
      );
      if (findIndex >= 0) {
        bool = true;
      }
    }

    return bool;
  }

  function optionSelection(item) {
    const aryData = [...multiSelectedValue];
    if (isMultiDropDown) {
      if (_.isArray(aryData)) {
        if (!_.isEmpty(aryData)) {
          const findIndex = aryData.findIndex(
            (v) => JSON.stringify(v) === JSON.stringify(item),
          );
          if (findIndex >= 0) {
            aryData.splice(findIndex, 1);
            setValtiSelectedValue(aryData);
          } else {
            aryData.unshift(item);
            setValtiSelectedValue(aryData);
          }
        } else {
          aryData.push(item);
          setValtiSelectedValue(aryData);
        }
      }
    } else {
      setSignleSelectedValue(item);
      clearSearchData();
      setIsDropDown(false);
    }
  }

  function clearSearchData() {
    if (isSearch) {
      setTimeout(() => {
        setSearchValue('');
      }, 10);
    } else {
      return null;
    }
  }

  function renderMainToggleCon() {
    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.8}
        onPress={() => {
          if (disabled) {
            return null;
          } else {
            setIsDropDown(!isDropDownOpen);
            if (!isDropDownOpen === false) {
              clearSearchData();
            }
          }
        }}
        style={[
          styles.btnCon,
          {
            borderBottomWidth: isDropDownOpen ? StyleSheet.hairlineWidth : 0,
          },
        ]}>
        {renderSelectedItems()}
        <Ficon
          name={isDropDownOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={BaseColors.borderColor}
        />
      </TouchableOpacity>
    );
  }

  function renderSelectedItems() {
    const title =
      _.isObject(singleSelectedValue) && !_.isEmpty(singleSelectedValue) ? (
        <Text numberOfLines={1} style={{ fontSize: 15 }}>
          {singleSelectedValue?.label}
        </Text>
      ) : (
        <Text numberOfLines={1}>Select Option</Text>
      );
    if (isMultiDropDown) {
      if (_.isArray(multiSelectedValue) && !_.isEmpty(multiSelectedValue)) {
        return (
          <ScrollView
            bounces
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            {multiSelectedValue.map((obj, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    removeObject(obj);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: 40,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    backgroundColor: BaseColors.lightRed,
                    marginRight: 5,
                  }}>
                  {obj?.img ? (
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        resizeMode: 'cover',
                        marginRight: 10,
                      }}
                      source={{
                        uri: obj?.img,
                      }}
                    />
                  ) : null}
                  <View
                    style={{
                      flex: 1,
                      paddingRight: 10,
                    }}>
                    <Text
                      subhead
                      numberOfLines={2}
                      style={{
                        color: BaseColors.primary,
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      {obj.label}
                    </Text>
                  </View>
                  <Ficon
                    name="x"
                    style={{
                      fontSize: 20,
                      color: BaseColors.primary,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'center',
            }}>
            <Text numberOfLines={1} style={{ fontFamily: FontFamily.regular }}>
              Select Party
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
          }}>
          {title}
        </View>
      );
    }
  }

  function renderSearchInput() {
    if (isSearch) {
      return (
        <View
          style={{
            height: 40,
            width: '100%',
            paddingHorizontal: 10,
            marginVertical: 10,
          }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderColor: BaseColors.borderColor,
            }}>
            <View style={{ flex: 1 }}>
              <TextInput
                value={searchValue}
                onChangeText={(val) => {
                  setSearchValue(val);
                  setFilteredData(val);
                }}
                allowFontScaling={false}
                placeholder="Enter party type"
                style={{
                  width: '100%',
                  height: '100%',
                  color: BaseColors.black,
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                padding: 4,
                backgroundColor: BaseColors.primary,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                if (isEmpty(searchValue.trim())) {
                  return null;
                } else {
                  onAddClick(searchValue);
                }
                setSearchValue('');
              }}>
              <Ficon
                name="plus"
                style={{
                  fontSize: 20,
                  color: BaseColors.borderColor,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  function renderOptionsCon() {
    return (
      <View
        style={[
          styles.optionConSty,
          { height: filteredList.length > 6 ? 240 : 'auto' },
        ]}>
        {renderSearchInput()}
        {searchLoader ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator
              size={'small'}
              color={BaseColors.primary}
              animating
            />
          </View>
        ) : (
          <ScrollView
            nestedScrollEnabled
            bounces
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.optionScrollCon}>
            {_.isArray(filteredList) && !_.isEmpty(filteredList)
              ? filteredList.map((obj, index) => {
                  const isMatch = isMultiDropDown
                    ? checkMultiSelectedOption(obj)
                    : _.isEqual(singleSelectedValue, obj);
                  const isDisplayBottomBorder = isMultiDropDown && isMatch;
                  const label_value = _.has(obj, 'label') ? obj?.label : '';
                  const img_url = _.has(obj, 'img') ? obj?.img : '';
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => {
                        optionSelection(obj);
                      }}
                      style={{
                        width: '100%',
                        height: 40,
                        paddingHorizontal: 11,
                        marginVertical: 2,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: '100%',
                          borderRadius: 5,
                          paddingHorizontal: 11,
                          backgroundColor: isMatch
                            ? BaseColors.lightRed
                            : index % 2 === 0
                            ? '#FFFFFF'
                            : '#f6f6f6',
                          borderBottomColor: isDisplayBottomBorder
                            ? BaseColors.white
                            : '#0000',
                          borderBottomWidth: isDisplayBottomBorder
                            ? StyleSheet.hairlineWidth
                            : 0,
                        }}>
                        {img_url !== '' ? (
                          <Image
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              resizeMode: 'cover',
                              marginRight: 10,
                            }}
                            source={{
                              uri: img_url,
                            }}
                          />
                        ) : null}
                        <View
                          style={{
                            flex: 1,
                            paddingRight: 10,
                          }}>
                          <Text
                            subhead
                            numberOfLines={2}
                            style={{
                              color: isMatch
                                ? BaseColors.primary
                                : BaseColors.black,
                              fontWeight: isMatch ? 'bold' : '400',
                              fontSize: 14,
                            }}>
                            {label_value}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              : null}
          </ScrollView>
        )}
      </View>
    );
  }

  function renderPlaceHolder() {
    if (placeholderText !== '') {
      return (
        <View style={styles.placeHolderCon}>
          <Text numberOfLines={1} primaryColor style={{ fontSize: 18 }}>
            {placeholderText}
            {required ? (
              <Text numberOfLines={1} redColor>
                {' *'}
              </Text>
            ) : null}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <View style={styles.mainContainer}>
        {renderMainToggleCon()}
        {renderPlaceHolder()}
        {isDropDownOpen ? renderOptionsCon() : null}
      </View>
      {isError ? (
        <Text body2 redColor>
          {isError}
        </Text>
      ) : null}
    </>
  );
};

CDropDown.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  singleSelectedData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  multipleSelectedData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  isSearch: PropTypes.bool,
  required: PropTypes.bool,
  isMultiDropDown: PropTypes.bool,
  placeholderText: PropTypes.string,
  searchLoader: PropTypes.bool,
  getSelectedData: PropTypes.func,
  disabled: PropTypes.bool,
};

CDropDown.defaultProps = {
  data: [],
  singleSelectedData: {},
  isSearch: false,
  required: false,
  placeholderText: '',
  isMultiDropDown: false,
  searchLoader: false,
  getSelectedData: () => {},
  multipleSelectedData: [],
  disabled: false,
};

export default CDropDown;
