/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableOpacity, Text, View } from 'react-native';
import { BaseColors } from '@config/theme';
// import Animated from 'react-native-reanimated';
import styles from './styles';
import { useSelector } from 'react-redux';

/**
 * Component for TabSwitch
 * @function TabSwitch
 */
export default function TabSwitch(props) {
  const {
    tabSize,
    subTabSize,
    tabs,
    onTabChange,
    activeTab,
    isRTL = false,
    fromDrawer = false,
  } = props;

  const { darkmode } = useSelector((state) => state.auth);

  const activeTabIndex = props.tabs.findIndex(
    (tab) => tab.id === props.activeTab.id,
  );

  const [translateValue] = useState(
    new Animated.Value((isRTL ? -1 : 1) * (1 + activeTabIndex * tabSize)),
  );

  const setspring = (index) => {
    Animated.spring(translateValue, {
      toValue: (isRTL ? -1 : 1) * (1 + index * subTabSize),
      velocity: 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // if (!fromDrawer) {
    setspring(activeTabIndex);
    // }
  }, [activeTab]);

  const renderTabData = () => {
    return (
      <View style={{ ...styles.wrapper, width: tabSize }}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [
                {
                  translateX: translateValue,
                },
              ],
              backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
              width: subTabSize,
            },
          ]}
        />
        {tabs.map((obj, index) => (
          <TouchableOpacity
            key={`${index + 1}`}
            activeOpacity={0.8}
            onPress={() => {
              onTabChange(obj);
              // if (fromDrawer) {
              //   setspring(index);
              // }
              console.log('===> ~ onPress', obj);
            }}
            style={{ ...styles.tab, width: subTabSize }}>
            <Text
              style={{
                color: BaseColors.primary,
                fontWeight: 'bold',
              }}>
              {obj.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return renderTabData();
}

TabSwitch.propTypes = {
  tabs: PropTypes.array,
  onTabChange: PropTypes.func,
  tabSize: PropTypes.number,
  subTabSize: PropTypes.number,
  activeTab: PropTypes.object,
};

TabSwitch.defaultProps = {
  tabs: [],
  onTabChange: () => {},
  tabSize: 0,
  subTabSize: 0,
  activeTab: {},
};
